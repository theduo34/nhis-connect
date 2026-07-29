create table public.facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  region text not null,
  type text not null default 'hospital' check (type in ('hospital', 'clinic', 'pharmacy')),
  phone text,
  created_at timestamptz not null default now()
);

create index facilities_region_idx on public.facilities (region);

alter table public.facilities enable row level security;

-- Read-only from the app; management happens from the backend (SQL editor /
-- service role), same pattern as admin role assignment in profiles.
create policy "Facilities are viewable by authenticated users"
  on public.facilities for select
  to authenticated
  using (true);

-- Denormalized facility_name/address on appointments stays the source of
-- truth for what was booked (so past appointments don't change if a
-- facility record is later edited); this just adds a traceable link.
alter table public.appointments add column facility_id uuid references public.facilities (id);

insert into public.facilities (name, address, region, type) values
  ('Korle Bu Teaching Hospital', 'Guggisberg Ave, Accra', 'Greater Accra', 'hospital'),
  ('Ridge Hospital', 'Castle Road, Accra', 'Greater Accra', 'hospital'),
  ('37 Military Hospital', 'Liberation Road, Accra', 'Greater Accra', 'hospital'),
  ('Tema General Hospital', 'Community 3, Tema', 'Greater Accra', 'hospital'),
  ('Komfo Anokye Teaching Hospital', 'Bantama High Street, Kumasi', 'Ashanti', 'hospital'),
  ('Tamale Teaching Hospital', 'Hospital Road, Tamale', 'Northern', 'hospital'),
  ('Cape Coast Teaching Hospital', 'Residency Road, Cape Coast', 'Central', 'hospital'),
  ('Effia-Nkwanta Regional Hospital', 'Axim Road, Sekondi-Takoradi', 'Western', 'hospital'),
  ('Ho Teaching Hospital', 'Ho-Kpalime Road, Ho', 'Volta', 'hospital'),
  ('Sunyani Regional Hospital', 'Sunyani-Berekum Road, Sunyani', 'Bono', 'hospital'),
  ('Bolgatanga Regional Hospital', 'Regional Hospital Road, Bolgatanga', 'Upper East', 'hospital'),
  ('Wa Regional Hospital', 'Wa-Kumasi Road, Wa', 'Upper West', 'hospital');
