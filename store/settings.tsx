"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import { xpForLevel } from "@/domain/experience/experience-table";
import type { SkillLevelEntry } from "@/domain/experience/level-progress";
import type { Skill } from "@/Types";

export type Direction = "TB" | "LR";
type SkillName = (typeof Skill)[number];

export type SettingsState = {
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
	/** Replaces every setting at once, e.g. a draft saved from the settings dialog. */
	applySettings: (settings: SettingsState) => void;
};

// Pure updates shared by the store actions and the settings dialog's draft.

/** Sets XP to that level's floor - overwrites any exact XP previously set. */
export function withSkillLevel(
	state: Pick<SettingsState, "skills">,
	skill: SkillName,
	level: number,
): Pick<SettingsState, "skills"> {
	return withSkillXp(state, skill, xpForLevel(level));
}

export function withSkillXp(
	state: Pick<SettingsState, "skills">,
	skill: SkillName,
	xp: number,
): Pick<SettingsState, "skills"> {
	return {
		skills: {
			...state.skills,
			levels: { ...state.skills.levels, [skill]: { xp: Math.max(0, xp) } },
		},
	};
}

export function withoutSkill(
	state: Pick<SettingsState, "skills">,
	skill: SkillName,
): Pick<SettingsState, "skills"> {
	const { [skill]: _removed, ...rest } = state.skills.levels;
	return { skills: { ...state.skills, levels: rest } };
}

/** Merges the same owned value for every listed facility; others are untouched. */
export function withFacilitiesOwned(
	state: Pick<SettingsState, "facilities">,
	facilities: string[],
	owned: boolean,
): Pick<SettingsState, "facilities"> {
	return {
		facilities: {
			...state.facilities,
			owned: {
				...state.facilities.owned,
				...Object.fromEntries(facilities.map((name) => [name, owned])),
			},
		},
	};
}

/** Plain data snapshot of the settings, without the actions. */
export function pickSettings(state: SettingsState): SettingsState {
	return {
		craftingTree: state.craftingTree,
		experienceSummary: state.experienceSummary,
		nextSteps: state.nextSteps,
		skills: state.skills,
		facilities: state.facilities,
	};
}

// Unchecked facilities are stored as `false` once touched, which means the
// same as never having been checked - only the owned ones matter.
function normalizeSettings(settings: SettingsState) {
	return {
		...settings,
		skills: Object.entries(settings.skills.levels).sort(([a], [b]) =>
			a.localeCompare(b),
		),
		facilities: Object.keys(settings.facilities.owned)
			.filter((name) => settings.facilities.owned[name])
			.sort(),
	};
}

export function isSettingsEqual(a: SettingsState, b: SettingsState) {
	return (
		JSON.stringify(normalizeSettings(a)) ===
		JSON.stringify(normalizeSettings(b))
	);
}

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
				set((state) => withSkillLevel(state, skill, level)),
			setXp: (skill, xp) => set((state) => withSkillXp(state, skill, xp)),
			clearSkill: (skill) => set((state) => withoutSkill(state, skill)),
			setFacilityOwned: (facility, owned) =>
				set((state) => withFacilitiesOwned(state, [facility], owned)),
			setFacilitiesOwned: (facilities, owned) =>
				set((state) => withFacilitiesOwned(state, facilities, owned)),
			applySettings: (settings) => set(pickSettings(settings)),
		}),
		{
			name: "settings",
			storage: createJSONStorage(() => localStorage),
			partialize: (state): SettingsState => pickSettings(state),
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
