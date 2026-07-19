"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FacilitiesOwnedStore = {
	owned: Record<string, boolean>;
	setOwned: (facility: string, owned: boolean) => void;
	resetOwned: () => void;
};

export const useFacilitiesOwned = create<FacilitiesOwnedStore>()(
	persist(
		(set, get) => ({
			owned: {},
			setOwned: (facility, owned) =>
				set({
					owned: {
						...get().owned,
						[facility]: owned,
					},
				}),
			resetOwned: () => set({ owned: {} }),
		}),
		{
			name: "facilities-owned",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
