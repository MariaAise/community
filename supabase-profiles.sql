-- Profiles table migration
-- Run this in your Supabase SQL Editor

-- Profiles table (one per user)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  area text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row-level security
alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create profile on user sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
