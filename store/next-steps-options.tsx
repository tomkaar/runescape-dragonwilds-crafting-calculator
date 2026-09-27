"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type NextStepsOptionsStore = {
	showCovered: boolean;
	toggleShowCovered: () => void;
	showUsedFor: boolean;
	toggleShowUsedFor: () => void;
};

export const useNextStepsOptions = create<NextStepsOptionsStore>()(
	persist(
		(set) => ({
			showCovered: false,
			toggleShowCovered: () =>
				set((state) => ({ showCovered: !state.showCovered })),
			showUsedFor: true,
			toggleShowUsedFor: () =>
				set((state) => ({ showUsedFor: !state.showUsedFor })),
		}),
		{
			name: "next-steps-options",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
