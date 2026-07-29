import { supabase } from '@/config/supabase';
import type { AuthResult } from '@/interfaces/auth';

export interface Dependent {
  id: string;
  fullName: string;
  relationship: string;
  nhisNumber: string | null;
}

export async function fetchDependents(userId: string): Promise<Dependent[]> {
  const { data, error } = await supabase
    .from('dependents')
    .select('id, full_name, relationship, nhis_number')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    relationship: row.relationship,
    nhisNumber: row.nhis_number,
  }));
}

export interface NewDependent {
  fullName: string;
  relationship: string;
  nhisNumber?: string;
}

export async function addDependent(userId: string, dependent: NewDependent): Promise<AuthResult> {
  const { error } = await supabase.from('dependents').insert({
    user_id: userId,
    full_name: dependent.fullName,
    relationship: dependent.relationship,
    nhis_number: dependent.nhisNumber || null,
  });
  if (error) return { error: error.message };
  return {};
}
