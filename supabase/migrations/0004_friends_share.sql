-- Phase 3: Kakao friends + meal photo sharing
-- Apply via Supabase Dashboard SQL Editor

-- =========================
-- profiles: opt-out share toggle (default true)
-- =========================
alter table public.profiles
  add column if not exists share_with_friends boolean not null default true,
  add column if not exists kakao_friends_synced_at timestamptz;

-- =========================
-- meals: store image url for sharing
-- =========================
alter table public.meals
  add column if not exists image_url text;

-- =========================
-- friendships (mutual; one row per direction)
-- =========================
create table if not exists public.friendships (
  user_id    uuid not null references auth.users(id) on delete cascade,
  friend_id  uuid not null references auth.users(id) on delete cascade,
  source     text not null default 'kakao',
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);

create index if not exists friendships_friend_idx
  on public.friendships (friend_id);

alter table public.friendships enable row level security;

drop policy if exists "fr: own pairs" on public.friendships;
create policy "fr: own pairs" on public.friendships
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================
-- friends_today_summary view (today kcal aggregated per friend)
-- =========================
create or replace view public.friends_today_summary
with (security_invoker = true)
as
  select f.user_id  as viewer_id,
         p.id       as friend_id,
         p.display_name,
         p.avatar_url,
         p.nickname,
         coalesce(sum(m.total_kcal) filter (where m.eaten_at::date = (now() at time zone 'Asia/Seoul')::date), 0)::int as today_kcal,
         max(m.eaten_at) filter (where m.eaten_at::date = (now() at time zone 'Asia/Seoul')::date) as last_eaten_at
  from public.friendships f
  join public.profiles p
    on p.id = f.friend_id
   and p.share_with_friends = true
  left join public.meals m
    on m.user_id = p.id
  group by f.user_id, p.id, p.display_name, p.avatar_url, p.nickname;

-- =========================
-- meals RLS: friend visibility (additive; existing own-row policy stays)
-- =========================
drop policy if exists "meals: friend select" on public.meals;
create policy "meals: friend select" on public.meals
  for select using (
    exists (
      select 1
      from public.friendships f
      join public.profiles p on p.id = meals.user_id
      where f.user_id = auth.uid()
        and f.friend_id = meals.user_id
        and p.share_with_friends = true
    )
  );

-- =========================
-- profiles RLS: friends can read minimal fields (still RLS-protected by friendships)
-- =========================
drop policy if exists "profile: friend read" on public.profiles;
create policy "profile: friend read" on public.profiles
  for select using (
    auth.uid() = id
    or exists (
      select 1 from public.friendships f
      where f.user_id = auth.uid() and f.friend_id = profiles.id
    )
  );

-- existing "profile: own row" stays for write operations

-- =========================
-- Storage bucket for meal photos (public-read, signed write)
-- =========================
insert into storage.buckets (id, name, public)
  values ('meals', 'meals', true)
  on conflict (id) do nothing;

-- Storage policies — owner write, public read (path = {user_id}/{meal_id}.ext)
drop policy if exists "meals storage: own write" on storage.objects;
create policy "meals storage: own write" on storage.objects
  for insert
  with check (
    bucket_id = 'meals'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "meals storage: own update" on storage.objects;
create policy "meals storage: own update" on storage.objects
  for update using (
    bucket_id = 'meals'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "meals storage: own delete" on storage.objects;
create policy "meals storage: own delete" on storage.objects
  for delete using (
    bucket_id = 'meals'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- public bucket gives free SELECT; no policy needed for read.
