"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ExperienceSummaryOptionsStore = {
	showOnlyGained: boolean;
	toggleShowOnlyGained: () => void;
};

export const useExperienceSummaryOptions =
	create<ExperienceSummaryOptionsStore>()(
		persist(
			(set) => ({
				showOnlyGained: false,
				toggleShowOnlyGained: () =>
					set((state) => ({ showOnlyGained: !state.showOnlyGained })),
			}),
			{
				name: "experience-summary-options",
				storage: createJSONStorage(() => localStorage),
			},
		),
	);
