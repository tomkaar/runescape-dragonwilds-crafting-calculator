"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ShowCoveredStepsStore = {
	showCovered: boolean;
	toggleShowCovered: () => void;
};

export const useShowCoveredSteps = create<ShowCoveredStepsStore>()(
	persist(
		(set) => ({
			showCovered: false,
			toggleShowCovered: () =>
				set((state) => ({ showCovered: !state.showCovered })),
		}),
		{
			name: "show-covered-steps",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
