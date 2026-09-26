"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ItemFilterStore = {
	isAll: boolean;
	selectedIds: string[];
	setSelected: (ids: string[], allIds: string[]) => void;
};

export const useItemFilter = create<ItemFilterStore>()(
	persist(
		(set) => ({
			isAll: true,
			selectedIds: [],
			setSelected: (ids: string[], allIds: string[]) => {
				if (allIds.length > 0 && ids.length === allIds.length) {
					set({ isAll: true, selectedIds: [] });
				} else {
					set({ isAll: false, selectedIds: ids });
				}
			},
		}),
		{
			name: "item-filter",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
