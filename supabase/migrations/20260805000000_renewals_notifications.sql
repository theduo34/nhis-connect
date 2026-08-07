-- Renewal workflow: subscribers submit a renewal request (for themselves or
-- a dependent); admins approve/reject it. Approval/rejection is what actually
-- moves membership_status/membership_expiry — the app never writes those
-- columns directly once a renewal exists, so the "pending review" state
-- shown on the Card tab always reflects a real submitted request.

alter table public.profiles drop constraint profiles_membership_status_check;
alter table public.profiles add constraint profiles_membership_status_check
  check (membership_status in ('active', 'expiring_soon', 'expired', 'pending'));

alter table public.dependents
  add column membership_status text not null default 'active'
    check (membership_status in ('active', 'expiring_soon', 'expired', 'pending')),
  add column membership_expiry date;

create table public.renewals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  dependent_id uuid references public.dependents (id) on delete cascade,
  plan text not null default 'standard',
  duration_months integer not null,
  previous_expiry date,
  requested_expiry date not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_by uuid references auth.users (id),
  reviewed_at timestamptz,
  submitted_at timestamptz not null default now()
);

create index renewals_user_id_idx on public.renewals (user_id);
create index renewals_pending_idx on public.renewals (submitted_at) where status = 'pending';

alter table public.renewals enable row level security;

create policy "Users view their own renewals"
  on public.renewals for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users submit their own renewals"
  on public.renewals for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Shared by every admin-only policy below instead of repeating the exists(...)
-- subquery. It only ever reads the caller's own profiles row (permitted by
-- the owner-select policy on profiles), so it can't be used to probe other
-- users' roles even though it runs as security definer.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Admins manage all renewals"
  on public.renewals for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins view all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

create policy "Admins view all dependents"
  on public.dependents for select
  to authenticated
  using (public.is_admin());

create policy "Admins view all appointments"
  on public.appointments for select
  to authenticated
  using (public.is_admin());

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text not null,
  type text not null default 'general'
    check (type in ('renewal_approved', 'renewal_rejected', 'appointment_booked', 'general')),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "Users view their own notifications"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users mark their own notifications read"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Notifications and membership status changes are both side effects of a
-- renewal decision, not actions the client ever takes directly — these
-- security definer triggers are the only writers, so there's deliberately no
-- insert policy on notifications and no admin update policy on profiles.
create function public.apply_renewal_decision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = old.status then
    return new;
  end if;

  if new.status = 'approved' then
    if new.dependent_id is null then
      update public.profiles
      set membership_status = 'active', membership_expiry = new.requested_expiry
      where id = new.user_id;
    else
      update public.dependents
      set membership_status = 'active', membership_expiry = new.requested_expiry
      where id = new.dependent_id;
    end if;

    insert into public.notifications (user_id, title, body, type)
    values (
      new.user_id,
      'Renewal approved',
      'Your NHIS renewal has been approved. Your card is now valid until '
        || to_char(new.requested_expiry, 'DD Mon YYYY') || '.',
      'renewal_approved'
    );
  elsif new.status = 'rejected' then
    if new.dependent_id is null then
      update public.profiles set membership_status = 'expired' where id = new.user_id;
    else
      update public.dependents set membership_status = 'expired' where id = new.dependent_id;
    end if;

    insert into public.notifications (user_id, title, body, type)
    values (
      new.user_id,
      'Renewal request rejected',
      coalesce(
        'Your NHIS renewal request was rejected: ' || new.rejection_reason,
        'Your NHIS renewal request was rejected. Please review your details and try again.'
      ),
      'renewal_rejected'
    );
  end if;

  return new;
end;
$$;

create trigger on_renewal_decision
  after update of status on public.renewals
  for each row execute function public.apply_renewal_decision();

-- Submitting a request should immediately flip the Card tab to "pending
-- review" rather than leaving the stale prior status showing until an admin
-- acts on it.
create function public.mark_renewal_pending()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.dependent_id is null then
    update public.profiles set membership_status = 'pending' where id = new.user_id;
  else
    update public.dependents set membership_status = 'pending' where id = new.dependent_id;
  end if;
  return new;
end;
$$;

create trigger on_renewal_submitted
  after insert on public.renewals
  for each row execute function public.mark_renewal_pending();

create function public.notify_appointment_booked()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, title, body, type)
  values (
    new.user_id,
    'Appointment booked',
    'Your visit to ' || new.facility_name || ' on '
      || to_char(new.appointment_date, 'DD Mon YYYY') || ' at ' || new.appointment_time
      || ' is confirmed.',
    'appointment_booked'
  );
  return new;
end;
$$;

create trigger on_appointment_booked
  after insert on public.appointments
  for each row execute function public.notify_appointment_booked();
