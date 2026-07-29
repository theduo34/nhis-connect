-- Supabase's dashboard no longer lets you customize the "Confirm signup"
-- template to expose {{ .Token }}, so signup verification is handled
-- entirely by our own code instead of GoTrue's built-in confirmation email.
-- The `send-otp` edge function (service role) generates and stores codes
-- here; this table is intentionally locked down so the only way to read a
-- code from the app is through verify_signup_otp() below — but you can
-- always read it by hand in the SQL editor if an email never arrives:
--   select * from public.otp_codes where email = '...' order by created_at desc;
create table public.otp_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code text not null,
  purpose text not null default 'signup' check (purpose in ('signup')),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  attempts int not null default 0,
  created_at timestamptz not null default now()
);

create index otp_codes_email_purpose_idx on public.otp_codes (email, purpose, created_at desc);

alter table public.otp_codes enable row level security;
-- No policies on purpose: anon/authenticated get zero direct access. Only
-- the service role (edge function) and the SECURITY DEFINER function below
-- can touch this table.

-- Tracks whether a subscriber has completed OTP verification. Kept separate
-- from GoTrue's own email_confirmed_at since signup no longer waits on
-- GoTrue's confirmation flow — the session is issued immediately and this
-- flag is what the app itself gates access on.
alter table public.profiles add column is_verified boolean not null default false;

create function public.verify_signup_otp(p_email text, p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_otp public.otp_codes%rowtype;
  v_user_id uuid;
begin
  select * into v_otp
  from public.otp_codes
  where email = p_email
    and purpose = 'signup'
    and consumed_at is null
  order by created_at desc
  limit 1;

  if v_otp.id is null then
    raise exception 'No verification code found for this email. Request a new one.';
  end if;

  if v_otp.expires_at < now() then
    raise exception 'This code has expired. Request a new one.';
  end if;

  if v_otp.attempts >= 5 then
    raise exception 'Too many attempts. Request a new code.';
  end if;

  if v_otp.code <> p_code then
    update public.otp_codes set attempts = attempts + 1 where id = v_otp.id;
    raise exception 'Incorrect code.';
  end if;

  update public.otp_codes set consumed_at = now() where id = v_otp.id;

  select id into v_user_id from auth.users where email = p_email;
  if v_user_id is not null then
    update public.profiles set is_verified = true where id = v_user_id;
  end if;

  return true;
end;
$$;

grant execute on function public.verify_signup_otp(text, text) to anon, authenticated;
