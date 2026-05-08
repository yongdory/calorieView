-- Kakao OAuth profile fields + auto-populate on signup
alter table public.profiles
  add column if not exists kakao_id text unique,
  add column if not exists display_name text,
  add column if not exists avatar_url text;

-- Pull Kakao (or any OAuth) metadata into profiles on auth.users insert
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, kakao_id, display_name, avatar_url, nickname)
  values (
    new.id,
    case when new.raw_app_meta_data->>'provider' = 'kakao'
      then coalesce(m->>'provider_id', m->>'sub')
      else null end,
    coalesce(m->>'name', m->>'full_name', m->>'nickname', m->>'preferred_username'),
    coalesce(m->>'avatar_url', m->>'picture'),
    coalesce(m->>'name', m->>'full_name', m->>'nickname')
  )
  on conflict (id) do nothing;
  return new;
end $$;
