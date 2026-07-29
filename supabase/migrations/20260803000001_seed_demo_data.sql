-- One-time demo data for whichever accounts already exist at migration time,
-- so the Card and Appointments screens have something real to render while
-- testing. Guarded so re-running (or a fresh env with no profiles yet) is a
-- no-op rather than an error.
update public.profiles
set membership_status = 'active',
    membership_expiry = (current_date + interval '8 months')::date
where membership_expiry is null;

insert into public.appointments (user_id, facility_name, facility_address, appointment_date, appointment_time, status)
select id, 'Ridge Hospital', 'Castle Road, Accra', (current_date + interval '9 days')::date, '10:30 AM', 'upcoming'
from public.profiles
where not exists (select 1 from public.appointments a where a.user_id = profiles.id);

insert into public.appointments (user_id, facility_name, facility_address, appointment_date, appointment_time, status)
select id, '37 Military Hospital', 'Liberation Road, Accra', (current_date - interval '20 days')::date, '9:00 AM', 'completed'
from public.profiles
where not exists (
  select 1 from public.appointments a
  where a.user_id = profiles.id and a.status = 'completed'
);
