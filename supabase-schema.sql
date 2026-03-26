-- ShareRide database schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- Rides table
create table rides (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('offering', 'need')),
  name text not null,
  from_lat double precision,
  from_lng double precision,
  from_name text,
  to_lat double precision,
  to_lng double precision,
  to_name text,
  days text[] default '{}',
  departure_time time,
  payment text default 'free' check (payment in ('free', 'can-pay', 'want-pay')),
  notice text default 'same-day' check (notice in ('same-day', '1-day', '2-days', 'week')),
  notes text,
  created_at timestamptz default now()
);

-- Row-level security: anyone can read, only owner can insert/delete
alter table rides enable row level security;

create policy "Rides are viewable by everyone"
  on rides for select
  using (true);

create policy "Users can insert their own rides"
  on rides for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own rides"
  on rides for delete
  using (auth.uid() = user_id);

-- Index for browsing
create index rides_created_at_idx on rides (created_at desc);
create index rides_type_idx on rides (type);
