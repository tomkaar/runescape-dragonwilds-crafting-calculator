"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type MaterialOwnedStore = {
	owned: Record<string, number>;
	setOwned: (itemId: string, qty: number) => void;
	resetOwned: () => void;
};

export const useMaterialOwned = create<MaterialOwnedStore>()(
	persist(
		(set, get) => ({
			owned: {},
			setOwned: (itemId: string, qty: number) =>
				set({
					owned: {
						...get().owned,
						[itemId]: Math.max(0, qty),
					},
				}),
			resetOwned: () => set({ owned: {} }),
		}),
		{
			name: "material-owned",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
