import { supabase } from '@/config/supabase';
import type { AuthResult } from '@/interfaces/auth';
import type { RenewalStatus } from '@/services/renewals.service';

export interface RenewalRequest {
  id: string;
  userId: string;
  dependentId: string | null;
  subjectName: string;
  nhisNumber: string | null;
  plan: string;
  durationMonths: number;
  requestedExpiry: string;
  submittedAt: string;
}

export interface RenewalActivity extends RenewalRequest {
  status: RenewalStatus;
}

interface RawRenewalRow {
  id: string;
  user_id: string;
  dependent_id: string | null;
  plan: string;
  duration_months: number;
  requested_expiry: string;
  submitted_at: string;
  status?: string;
}

/** Resolves each renewal's subscriber/dependent name in two batched queries (no FK between renewals and profiles for PostgREST to embed). */
async function withSubjectNames(rows: RawRenewalRow[]): Promise<RenewalRequest[]> {
  const userIds = [...new Set(rows.map((r) => r.user_id))];
  const dependentIds = rows.map((r) => r.dependent_id).filter((id): id is string => id !== null);

  const [{ data: profiles }, { data: dependents }] = await Promise.all([
    supabase.from('profiles').select('id, name, nhis_number').in('id', userIds),
    dependentIds.length
      ? supabase.from('dependents').select('id, full_name').in('id', dependentIds)
      : Promise.resolve({ data: [] as { id: string; full_name: string }[] }),
  ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const dependentMap = new Map((dependents ?? []).map((d) => [d.id, d]));

  return rows.map((r) => {
    const dependent = r.dependent_id ? dependentMap.get(r.dependent_id) : undefined;
    const profile = profileMap.get(r.user_id);
    return {
      id: r.id,
      userId: r.user_id,
      dependentId: r.dependent_id,
      subjectName: dependent?.full_name ?? profile?.name ?? 'Unknown member',
      nhisNumber: profile?.nhis_number ?? null,
      plan: r.plan,
      durationMonths: r.duration_months,
      requestedExpiry: r.requested_expiry,
      submittedAt: r.submitted_at,
    };
  });
}

/** Admin queue: every pending request, oldest first. */
export async function fetchPendingRenewals(): Promise<RenewalRequest[]> {
  const { data, error } = await supabase
    .from('renewals')
    .select('id, user_id, dependent_id, plan, duration_months, requested_expiry, submitted_at')
    .eq('status', 'pending')
    .order('submitted_at', { ascending: true });
  if (error || !data || data.length === 0) return [];
  return withSubjectNames(data);
}

/** Admin home feed: most recent requests regardless of status. */
export async function fetchRecentRenewalActivity(limit = 5): Promise<RenewalActivity[]> {
  const { data, error } = await supabase
    .from('renewals')
    .select(
      'id, user_id, dependent_id, plan, duration_months, requested_expiry, submitted_at, status'
    )
    .order('submitted_at', { ascending: false })
    .limit(limit);
  if (error || !data || data.length === 0) return [];
  const resolved = await withSubjectNames(data);
  return resolved.map((r, i) => ({ ...r, status: data[i]!.status as RenewalStatus }));
}

export async function approveRenewal(renewalId: string, reviewerId: string): Promise<AuthResult> {
  const { error } = await supabase
    .from('renewals')
    .update({ status: 'approved', reviewed_by: reviewerId, reviewed_at: new Date().toISOString() })
    .eq('id', renewalId);
  if (error) return { error: error.message };
  return {};
}

export async function rejectRenewal(
  renewalId: string,
  reviewerId: string,
  reason: string
): Promise<AuthResult> {
  const { error } = await supabase
    .from('renewals')
    .update({
      status: 'rejected',
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason,
    })
    .eq('id', renewalId);
  if (error) return { error: error.message };
  return {};
}
