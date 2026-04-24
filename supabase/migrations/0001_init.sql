-- calorieView initial schema
-- Apply via Supabase dashboard SQL editor, or:
--   supabase db push

-- =========================
-- profiles (1:1 with auth.users)
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  sex text check (sex in ('male','female')),
  age_years int check (age_years between 1 and 120),
  weight_kg numeric(5,2) check (weight_kg between 20 and 300),
  height_cm numeric(5,2) check (height_cm between 80 and 250),
  activity text check (activity in ('sedentary','light','moderate','active')),
  daily_kcal_target int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- meals (analysis results)
-- =========================
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  eaten_at timestamptz not null default now(),
  total_kcal int not null,
  total_carb_g int not null,
  total_protein_g int not null,
  total_fat_g int not null,
  items jsonb not null,
  image_hash text,
  created_at timestamptz not null default now()
);

create index if not exists meals_user_eaten_idx
  on public.meals (user_id, eaten_at desc);

-- =========================
-- auto-update updated_at on profiles
-- =========================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- =========================
-- auto-create profile row on signup
-- =========================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================
-- Row Level Security
-- =========================
alter table public.profiles enable row level security;
alter table public.meals enable row level security;

drop policy if exists "profile: own row" on public.profiles;
create policy "profile: own row" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "meals: own rows" on public.meals;
create policy "meals: own rows" on public.meals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
