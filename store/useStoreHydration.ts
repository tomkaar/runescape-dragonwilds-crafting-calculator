"use client";

import { useEffect, useState } from "react";

type PersistStore = {
  persist: {
    hasHydrated(): boolean;
    onFinishHydration(fn: () => void): () => void;
  };
};

export function useStoreHydration(store: PersistStore): boolean {
  const [_hasHydrated, _setHasHydrated] = useState(() =>
    store.persist?.hasHydrated(),
  );

  useEffect(() => {
    if (_hasHydrated) return;
    return store.persist?.onFinishHydration(() => _setHasHydrated(true));
  }, [_hasHydrated, store]);

  return _hasHydrated;
}
