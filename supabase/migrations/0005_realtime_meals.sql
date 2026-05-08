-- Enable Realtime for meals so friends' new meals stream live to clients
alter publication supabase_realtime add table public.meals;
