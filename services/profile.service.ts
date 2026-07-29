import { supabase } from '@/config/supabase';
import type { AuthResult } from '@/interfaces/auth';

export interface ProfileDetails {
  nhisNumber: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'prefer_not_to_say';
  country: string;
}

export async function updateProfileDetails(
  userId: string,
  details: ProfileDetails
): Promise<AuthResult> {
  const { error } = await supabase
    .from('profiles')
    .update({
      nhis_number: details.nhisNumber,
      date_of_birth: details.dateOfBirth,
      gender: details.gender,
      country: details.country,
    })
    .eq('id', userId);
  if (error) return { error: error.message };
  return {};
}

export interface FullProfile {
  name: string;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  nhisNumber: string | null;
  region: string | null;
  country: string | null;
}

export async function fetchProfileDetails(userId: string): Promise<FullProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, phone, gender, date_of_birth, nhis_number, region, country')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return {
    name: data.name,
    phone: data.phone,
    gender: data.gender,
    dateOfBirth: data.date_of_birth,
    nhisNumber: data.nhis_number,
    region: data.region,
    country: data.country,
  };
}

export interface AccountSettings {
  name: string;
  phone: string;
  region: string;
  country: string;
}

export async function updateAccountSettings(
  userId: string,
  settings: AccountSettings
): Promise<AuthResult> {
  const { error } = await supabase
    .from('profiles')
    .update({
      name: settings.name,
      phone: settings.phone,
      region: settings.region,
      country: settings.country,
    })
    .eq('id', userId);
  if (error) return { error: error.message };
  return {};
}
