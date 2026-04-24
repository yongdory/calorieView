-- Add nickname to profiles
alter table public.profiles
  add column if not exists nickname text;
