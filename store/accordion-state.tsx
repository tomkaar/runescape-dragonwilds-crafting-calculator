"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AccordionState = {
	openItems: string[];
	setOpenItems: (items: string[]) => void;
};

const DEFAULT_OPEN_ITEMS = ["progress-instruction"];

export const useAccordionState = create<AccordionState>()(
	persist(
		(set) => ({
			openItems: DEFAULT_OPEN_ITEMS,
			setOpenItems: (items: string[]) => set({ openItems: items }),
		}),
		{
			name: "accordion-state",
			storage: createJSONStorage(() => localStorage),
			version: 1,
			// State saved before the instruction accordion existed has never had
			// a say on it, so open it once; later toggles persist as usual.
			migrate: (persistedState, version) => {
				const state = persistedState as Pick<AccordionState, "openItems">;
				if (version < 1) {
					return {
						...state,
						openItems: [
							...new Set([...(state.openItems ?? []), ...DEFAULT_OPEN_ITEMS]),
						],
					};
				}
				return state;
			},
		},
	),
);
