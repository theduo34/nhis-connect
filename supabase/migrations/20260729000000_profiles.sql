-- Profiles table backing app-level user data and role-based access control.
-- Every subscriber-facing signup is provisioned with role = 'subscriber' by
-- the handle_new_user trigger below; admin accounts are promoted directly in
-- the database (e.g. via the Supabase dashboard/SQL editor), never through
-- the app, since the client can never set its own role.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  role text not null default 'subscriber' check (role in ('subscriber', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by their owner"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Profiles are updatable by their owner"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- RLS can't restrict a single column on UPDATE, so role changes from
-- anything but the service role (i.e. anything the app itself can do) are
-- silently reverted here. This is what makes "admin created from the
-- backend only" actually enforced rather than just a convention.
create function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and auth.role() <> 'service_role' then
    new.role := old.role;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- Auto-provision a profile row whenever a new auth user is created, always
-- defaulting to 'subscriber' regardless of any client-supplied metadata.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''), 'subscriber');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
