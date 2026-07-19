"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { xpForLevel } from "@/domain/experience/experience-table";
import type { SkillLevelEntry } from "@/domain/experience/level-progress";
import type { Skill } from "@/Types";

type SkillLevelsStore = {
	levels: Partial<Record<(typeof Skill)[number], SkillLevelEntry>>;
	/** Sets XP to that level's floor - overwrites any exact XP previously set. */
	setLevel: (skill: (typeof Skill)[number], level: number) => void;
	setXp: (skill: (typeof Skill)[number], xp: number) => void;
	clearSkill: (skill: (typeof Skill)[number]) => void;
	resetLevels: () => void;
};

export const useSkillLevels = create<SkillLevelsStore>()(
	persist(
		(set, get) => ({
			levels: {},
			setLevel: (skill, level) =>
				set({
					levels: {
						...get().levels,
						[skill]: { xp: xpForLevel(level) },
					},
				}),
			setXp: (skill, xp) =>
				set({
					levels: {
						...get().levels,
						[skill]: { xp: Math.max(0, xp) },
					},
				}),
			clearSkill: (skill) => {
				const { [skill]: _removed, ...rest } = get().levels;
				set({ levels: rest });
			},
			resetLevels: () => set({ levels: {} }),
		}),
		{
			name: "skill-levels",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
