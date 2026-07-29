import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (seen: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      setHasSeenOnboarding: (seen: boolean) => set({ hasSeenOnboarding: seen }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
