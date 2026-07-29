export type UserRole = 'subscriber' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
}

export interface AuthResult {
  error?: string;
}

export interface OtpSendResult extends AuthResult {
  /** False when the code was generated and stored but email delivery couldn't be confirmed. */
  delivered?: boolean;
  /** Only set when `delivered` is false — no email provider is configured yet. */
  devCode?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  /** True once the initial Supabase session check has resolved (success or not). */
  isSessionChecked: boolean;
  error: string | null;
  user: User | null;
}

export interface AuthActions {
  clearError: () => void;
  signUp: (name: string, email: string, password: string) => Promise<OtpSendResult>;
  verifyOtp: (code: string) => Promise<AuthResult>;
  resendOtp: () => Promise<OtpSendResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  /** Re-fetches the profile for the current session — call after editing name/etc elsewhere. */
  refreshUser: () => Promise<void>;
}
