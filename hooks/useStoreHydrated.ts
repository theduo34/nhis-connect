import { useEffect, useState } from 'react';

interface PersistApi {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (listener: () => void) => () => void;
  };
}

/** Tracks whether a zustand persist-backed store has finished rehydrating from storage. */
export function useStoreHydrated(store: PersistApi): boolean {
  const [hydrated, setHydrated] = useState(store.persist.hasHydrated());

  useEffect(() => {
    if (store.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return store.persist.onFinishHydration(() => setHydrated(true));
  }, [store]);

  return hydrated;
}
