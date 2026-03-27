-- Add phone column to profiles
-- Run this in your Supabase SQL Editor

alter table profiles add column if not exists phone text;
