import { supabase } from '@/config/supabase';

export type MembershipStatus = 'active' | 'expiring_soon' | 'expired' | 'pending';

export interface Membership {
  status: MembershipStatus;
  expiry: string | null;
}

export async function fetchMembershipStatus(userId: string): Promise<Membership | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('membership_status, membership_expiry')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return {
    status: data.membership_status as MembershipStatus,
    expiry: data.membership_expiry,
  };
}
