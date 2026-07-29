import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import { AuthState, AuthActions } from '@/interfaces/auth';
import { supabase } from '@/config/supabase';
import * as authService from '@/services/auth.service';

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  isSessionChecked: false,
  error: null,
  user: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      clearError: () => set({ error: null }),

      signUp: async (name, email, password) => {
        set({ isLoading: true, error: null });
        const { error } = await authService.signUp(name, email, password);
        if (error) {
          set({ isLoading: false, error });
          return { error };
        }
        await syncUserFromCurrentSession();
        const { error: sendError, delivered, devCode } = await authService.sendOtpEmail(email);
        set({ isLoading: false, error: sendError ?? null });
        if (sendError) return { error: sendError };
        return { delivered, devCode };
      },

      verifyOtp: async (code) => {
        const email = get().user?.email;
        if (!email) return { error: 'Start sign up again — no account is pending verification.' };
        set({ isLoading: true, error: null });
        const { error } = await authService.verifySignupOtp(email, code);
        set({ isLoading: false, error: error ?? null });
        if (error) return { error };
        set((s) => (s.user ? { user: { ...s.user, isVerified: true } } : {}));
        return {};
      },

      resendOtp: async () => {
        const email = get().user?.email;
        if (!email) return { error: 'Start sign up again — no account is pending verification.' };
        return authService.sendOtpEmail(email);
      },

      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        const { error } = await authService.signIn(email, password);
        if (error) {
          set({ isLoading: false, error });
          return { error };
        }
        // Wait for the profile fetch to land in the store before resolving —
        // otherwise a caller that navigates immediately after can read a
        // stale isAuthenticated:false and bounce back to the landing screen.
        await syncUserFromCurrentSession();
        set({ isLoading: false });
        return {};
      },

      signOut: async () => {
        await authService.signOut();
      },

      refreshUser: async () => {
        await syncUserFromCurrentSession();
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

async function syncUserFromSession(session: Session | null): Promise<void> {
  if (!session?.user) {
    useAuthStore.setState({ isAuthenticated: false, user: null, isSessionChecked: true });
    return;
  }

  const authUser = session.user;
  const profile = await authService.fetchProfile(authUser.id);
  useAuthStore.setState({
    isAuthenticated: true,
    isSessionChecked: true,
    user: {
      id: authUser.id,
      email: authUser.email ?? '',
      name: profile?.name ?? '',
      role: profile?.role ?? 'subscriber',
      isVerified: profile?.isVerified ?? false,
    },
  });
}

async function syncUserFromCurrentSession(): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  await syncUserFromSession(session);
}

// Also the single source of truth for auth state outside of the explicit
// actions above: Supabase fires SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED /
// INITIAL_SESSION events for every session change (app boot, token refresh,
// sign-out from elsewhere), keeping the store in sync even when nothing in
// this file triggered the change.
supabase.auth.onAuthStateChange((_event, session) => {
  syncUserFromSession(session);
});
