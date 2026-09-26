"use client";

import { useEffect, useState } from "react";

type PersistStore = {
	persist: {
		hasHydrated(): boolean;
		onFinishHydration(fn: () => void): () => void;
	};
};

export function useStoreHydration(store: PersistStore): boolean {
	// Start as false so the first client render matches the server render.
	const [_hasHydrated, _setHasHydrated] = useState(false);

	useEffect(() => {
		if (store.persist?.hasHydrated()) {
			_setHasHydrated(true);
			return;
		}
		return store.persist?.onFinishHydration(() => _setHasHydrated(true));
	}, [store]);

	return _hasHydrated;
}
