-- Shown on the Profile tab's header card ("<region>, Ghana"), editable from
-- Account settings. Nullable: not collected during onboarding.
alter table public.profiles add column region text;
