"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type NextStepsOptionsStore = {
	showCovered: boolean;
	toggleShowCovered: () => void;
	showUsedFor: boolean;
	toggleShowUsedFor: () => void;
	showNeeded: boolean;
	toggleShowNeeded: () => void;
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
			showNeeded: true,
			toggleShowNeeded: () =>
				set((state) => ({ showNeeded: !state.showNeeded })),
		}),
		{
			name: "next-steps-options",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
