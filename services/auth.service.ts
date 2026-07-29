import { supabase } from '@/config/supabase';
import type { AuthResult, OtpSendResult, UserRole } from '@/interfaces/auth';

export interface Profile {
  name: string;
  role: UserRole;
  isVerified: boolean;
}

export async function signUp(name: string, email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) return { error: error.message };
  return {};
}

export async function sendOtpEmail(email: string): Promise<OtpSendResult> {
  const { data, error } = await supabase.functions.invoke('send-otp', { body: { email } });
  if (error) return { error: await describeFunctionError(error) };
  return { delivered: data?.delivered ?? true, devCode: data?.code };
}

/**
 * `supabase.functions.invoke` only puts a generic "non-2xx status code"
 * message on the error object for HTTP failures — the actual reason lives in
 * `error.context`, the raw Response from the function.
 */
async function describeFunctionError(error: { context?: Response; message?: string }): Promise<string> {
  if (error.context instanceof Response) {
    try {
      const body = await error.context.json();
      if (typeof body?.error === 'string') return body.error;
    } catch {
      // Non-JSON response (e.g. the function isn't deployed) — fall through.
    }
  }
  return error.message ?? 'Something went wrong sending the verification email.';
}

export async function verifySignupOtp(email: string, code: string): Promise<AuthResult> {
  const { error } = await supabase.rpc('verify_signup_otp', { p_email: email, p_code: code });
  if (error) return { error: error.message };
  return {};
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return {};
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, role, is_verified')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return { name: data.name, role: data.role as UserRole, isVerified: data.is_verified };
}
