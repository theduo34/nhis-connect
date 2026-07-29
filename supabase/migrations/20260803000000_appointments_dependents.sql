-- Membership status shown on the Card tab.
alter table public.profiles
  add column membership_status text not null default 'active'
    check (membership_status in ('active', 'expiring_soon', 'expired')),
  add column membership_expiry date;

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  facility_name text not null,
  facility_address text,
  appointment_date date not null,
  appointment_time text not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

create index appointments_user_id_idx on public.appointments (user_id, appointment_date);

alter table public.appointments enable row level security;

create policy "Users manage their own appointments"
  on public.appointments for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table public.dependents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  relationship text not null,
  nhis_number text,
  created_at timestamptz not null default now()
);

create index dependents_user_id_idx on public.dependents (user_id);

alter table public.dependents enable row level security;

create policy "Users manage their own dependents"
  on public.dependents for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
