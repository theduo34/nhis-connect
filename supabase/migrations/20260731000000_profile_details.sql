-- Additional subscriber details collected during onboarding, after signup.
-- All nullable: the row already exists (created by handle_new_user) before
-- any of this is filled in.
alter table public.profiles
  add column phone text,
  add column gender text check (gender in ('male', 'female', 'prefer_not_to_say')),
  add column date_of_birth date,
  add column nhis_number text;
