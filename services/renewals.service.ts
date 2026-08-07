import { supabase } from '@/config/supabase';
import type { AuthResult } from '@/interfaces/auth';

export type RenewalStatus = 'pending' | 'approved' | 'rejected';

export interface Renewal {
  id: string;
  dependentId: string | null;
  plan: string;
  durationMonths: number;
  requestedExpiry: string;
  status: RenewalStatus;
  rejectionReason: string | null;
  submittedAt: string;
}

const HISTORY_COLUMNS =
  'id, dependent_id, plan, duration_months, requested_expiry, status, rejection_reason, submitted_at';

function toRenewal(row: {
  id: string;
  dependent_id: string | null;
  plan: string;
  duration_months: number;
  requested_expiry: string;
  status: string;
  rejection_reason: string | null;
  submitted_at: string;
}): Renewal {
  return {
    id: row.id,
    dependentId: row.dependent_id,
    plan: row.plan,
    durationMonths: row.duration_months,
    requestedExpiry: row.requested_expiry,
    status: row.status as RenewalStatus,
    rejectionReason: row.rejection_reason,
    submittedAt: row.submitted_at,
  };
}

/** Full renewal history for a subscriber, across themself and their dependents. */
export async function fetchRenewalHistory(userId: string): Promise<Renewal[]> {
  const { data, error } = await supabase
    .from('renewals')
    .select(HISTORY_COLUMNS)
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });
  if (error || !data) return [];
  return data.map(toRenewal);
}

/** The in-review request for a subject (self when dependentId is null), if any. */
export async function fetchPendingRenewalFor(
  userId: string,
  dependentId: string | null
): Promise<Renewal | null> {
  let query = supabase
    .from('renewals')
    .select(HISTORY_COLUMNS)
    .eq('user_id', userId)
    .eq('status', 'pending');
  query = dependentId ? query.eq('dependent_id', dependentId) : query.is('dependent_id', null);
  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return toRenewal(data);
}

export interface NewRenewal {
  dependentId?: string | null;
  plan: string;
  durationMonths: number;
  previousExpiry?: string | null;
}

function toIsoDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function submitRenewal(userId: string, renewal: NewRenewal): Promise<AuthResult> {
  const today = new Date();
  const previous = renewal.previousExpiry ? new Date(renewal.previousExpiry) : null;
  // Renewing before the card actually expires extends from the current
  // expiry instead of discarding the remaining coverage.
  const startFrom = previous && previous > today ? previous : today;
  const requestedExpiry = new Date(startFrom);
  requestedExpiry.setMonth(requestedExpiry.getMonth() + renewal.durationMonths);

  const { error } = await supabase.from('renewals').insert({
    user_id: userId,
    dependent_id: renewal.dependentId ?? null,
    plan: renewal.plan,
    duration_months: renewal.durationMonths,
    previous_expiry: renewal.previousExpiry ?? null,
    requested_expiry: toIsoDate(requestedExpiry),
  });
  if (error) return { error: error.message };
  return {};
}
