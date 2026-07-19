import { resolveMaterialTree } from "@/features/material-tree/utils/resolve-material-tree";
import {
	buildSteps,
	findRootRecipe,
	getMarkedNodeIds,
	type Params,
} from "./build-steps";

/**
 * Facilities that never belong on a "still need to unlock/build" checklist:
 * Edna is an NPC, not a buildable structure, and the Build Menu is available
 * from the start. Shared with the standalone facilities dialog so the two
 * stay in sync.
 */
export const ALWAYS_AVAILABLE_FACILITIES: string[] = ["Edna", "Build Menu"];

export type FacilityChecklistResult = {
	facilities: string[];
	// Names of tracked items reached through more than one active variant —
	// see findRootRecipe in build-steps.ts. There's no way to know which
	// variant's facility will actually be needed, so the list above may be
	// missing or including one that doesn't apply.
	ambiguousItemNames: string[];
};

/**
 * Every facility involved in actually finishing the current plan: both the
 * facilities needed for remaining (not-yet-owned) ingredient steps, and each
 * tracked item's own facility for the final assembly/craft, which is never
 * itself a "step" (see findRootRecipe in build-steps.ts).
 */
export function buildFacilityChecklist({
	filteredItemIds,
	allItems,
	multipliers,
	owned,
}: Params): FacilityChecklistResult {
	const facilities = new Set<string>();

	const steps = buildSteps({ filteredItemIds, allItems, multipliers, owned });
	for (const step of steps) {
		for (const facility of step.facilities) facilities.add(facility);
	}

	const ambiguousItemNames: string[] = [];
	for (const trackedItemId of filteredItemIds) {
		const markedNodeIds = getMarkedNodeIds(allItems[trackedItemId]);
		if (!markedNodeIds) continue;

		const multiplier = multipliers[trackedItemId] || 1;
		const tree = resolveMaterialTree(trackedItemId, multiplier);
		const { recipe, isAmbiguous } = findRootRecipe(tree, markedNodeIds);
		if (isAmbiguous && tree[0]) ambiguousItemNames.push(tree[0].item.name);
		if (!recipe) continue;

		for (const facility of recipe.facilities) facilities.add(facility);
	}

	return {
		facilities: Array.from(facilities)
			.filter((facility) => !ALWAYS_AVAILABLE_FACILITIES.includes(facility))
			.sort(),
		ambiguousItemNames,
	};
}
