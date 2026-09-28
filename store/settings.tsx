"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import { xpForLevel } from "@/domain/experience/experience-table";
import type { SkillLevelEntry } from "@/domain/experience/level-progress";
import type { Skill } from "@/Types";

type Direction = "TB" | "LR";
type SkillName = (typeof Skill)[number];

type SettingsState = {
	craftingTree: { direction: Direction };
	experienceSummary: { showOnlyGained: boolean };
	nextSteps: {
		showCovered: boolean;
		showUsedFor: boolean;
		showNeeded: boolean;
	};
	skills: { levels: Partial<Record<SkillName, SkillLevelEntry>> };
	facilities: { owned: Record<string, boolean> };
};

type SettingsActions = {
	setDirection: (direction: Direction) => void;
	toggleShowOnlyGained: () => void;
	toggleShowCovered: () => void;
	toggleShowUsedFor: () => void;
	toggleShowNeeded: () => void;
	/** Sets XP to that level's floor - overwrites any exact XP previously set. */
	setLevel: (skill: SkillName, level: number) => void;
	setXp: (skill: SkillName, xp: number) => void;
	clearSkill: (skill: SkillName) => void;
	setFacilityOwned: (facility: string, owned: boolean) => void;
	/** Merges the same owned value for every listed facility; others are untouched. */
	setFacilitiesOwned: (facilities: string[], owned: boolean) => void;
};

export const useSettings = create<SettingsState & SettingsActions>()(
	persist(
		(set) => ({
			craftingTree: { direction: "TB" },
			experienceSummary: { showOnlyGained: false },
			nextSteps: { showCovered: false, showUsedFor: true, showNeeded: true },
			skills: { levels: {} },
			facilities: { owned: {} },

			setDirection: (direction) =>
				set((state) => ({
					craftingTree: { ...state.craftingTree, direction },
				})),
			toggleShowOnlyGained: () =>
				set((state) => ({
					experienceSummary: {
						...state.experienceSummary,
						showOnlyGained: !state.experienceSummary.showOnlyGained,
					},
				})),
			toggleShowCovered: () =>
				set((state) => ({
					nextSteps: {
						...state.nextSteps,
						showCovered: !state.nextSteps.showCovered,
					},
				})),
			toggleShowUsedFor: () =>
				set((state) => ({
					nextSteps: {
						...state.nextSteps,
						showUsedFor: !state.nextSteps.showUsedFor,
					},
				})),
			toggleShowNeeded: () =>
				set((state) => ({
					nextSteps: {
						...state.nextSteps,
						showNeeded: !state.nextSteps.showNeeded,
					},
				})),
			setLevel: (skill, level) =>
				set((state) => ({
					skills: {
						...state.skills,
						levels: {
							...state.skills.levels,
							[skill]: { xp: xpForLevel(level) },
						},
					},
				})),
			setXp: (skill, xp) =>
				set((state) => ({
					skills: {
						...state.skills,
						levels: {
							...state.skills.levels,
							[skill]: { xp: Math.max(0, xp) },
						},
					},
				})),
			clearSkill: (skill) =>
				set((state) => {
					const { [skill]: _removed, ...rest } = state.skills.levels;
					return { skills: { ...state.skills, levels: rest } };
				}),
			setFacilityOwned: (facility, owned) =>
				set((state) => ({
					facilities: {
						...state.facilities,
						owned: { ...state.facilities.owned, [facility]: owned },
					},
				})),
			setFacilitiesOwned: (facilities, owned) =>
				set((state) => ({
					facilities: {
						...state.facilities,
						owned: {
							...state.facilities.owned,
							...Object.fromEntries(facilities.map((name) => [name, owned])),
						},
					},
				})),
		}),
		{
			name: "settings",
			storage: createJSONStorage(() => localStorage),
			partialize: (state): SettingsState => ({
				craftingTree: state.craftingTree,
				experienceSummary: state.experienceSummary,
				nextSteps: state.nextSteps,
				skills: state.skills,
				facilities: state.facilities,
			}),
		},
	),
);

export function useCraftingTreeDirection() {
	return useSettings(
		useShallow((state) => ({
			direction: state.craftingTree.direction,
			setDirection: state.setDirection,
		})),
	);
}

export function useExperienceSummaryOptions() {
	return useSettings(
		useShallow((state) => ({
			showOnlyGained: state.experienceSummary.showOnlyGained,
			toggleShowOnlyGained: state.toggleShowOnlyGained,
		})),
	);
}

export function useNextStepsOptions() {
	return useSettings(
		useShallow((state) => ({
			...state.nextSteps,
			toggleShowCovered: state.toggleShowCovered,
			toggleShowUsedFor: state.toggleShowUsedFor,
			toggleShowNeeded: state.toggleShowNeeded,
		})),
	);
}

export function useSkillLevels() {
	return useSettings(
		useShallow((state) => ({
			levels: state.skills.levels,
			setLevel: state.setLevel,
			setXp: state.setXp,
			clearSkill: state.clearSkill,
		})),
	);
}

export function useFacilitiesOwned() {
	return useSettings(
		useShallow((state) => ({
			owned: state.facilities.owned,
			setOwned: state.setFacilityOwned,
			setAllOwned: state.setFacilitiesOwned,
		})),
	);
}
