-- Run in Supabase SQL editor or via CLI migrate.
-- Stores conversational onboarding outcome + optional resume marker.

alter table public.farmer_profiles
  add column if not exists primary_need text;

comment on column public.farmer_profiles.primary_need is 'User-selected primary help need from chat onboarding (e.g. Loans, Market prices).';
