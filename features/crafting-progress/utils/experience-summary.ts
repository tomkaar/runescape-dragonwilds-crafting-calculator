import { resolveMaterialTree } from "@/features/material-tree/utils/resolve-material-tree";
import {
	buildSteps,
	findRootRecipe,
	getMarkedNodeIds,
	type Params,
	type StepEntry,
} from "./build-steps";

type SkillExperience = {
	skill: string;
	experience: number;
};

export type ExperienceSummaryResult = {
	totals: SkillExperience[];
	// Names of items reached through more than one recipe in the current plan
	// (e.g. two variants of the same tracked item both have marked
	// materials). There's no way to know which recipe will actually be
	// crafted, so the totals above silently pick one / split proportionally
	// — callers should surface this so the numbers aren't taken as exact.
	ambiguousItemNames: string[];
};

function sortedTotals(totals: Map<string, number>): SkillExperience[] {
	return Array.from(totals.entries())
		.map(([skill, experience]) => ({ skill, experience }))
		.sort((a, b) => b.experience - a.experience);
}

/**
 * Rolls the steps' per-recipe contributions up into a total per skill.
 * Craft actions are whole units (you can't perform a fractional craft), so
 * each contribution is rounded up to the number of crafts needed to cover
 * its share of the remaining quantity before multiplying by the recipe's
 * experience. A step with more than one recipe contribution means the same
 * item was reached through more than one recipe/variant across the tree —
 * its share is a proportional guess, not a known-correct value.
 *
 * @param steps - The steps to compute the experience summary from.
 * @returns An object containing the total experience per skill and any ambiguous item names.
 */
export function computeExperienceSummary(
	steps: StepEntry[],
): ExperienceSummaryResult {
	const totals = new Map<string, number>();
	const ambiguousItemNames: string[] = [];

	for (const step of steps) {
		const contributions = step.recipeContributions ?? [];
		if (contributions.length > 1) ambiguousItemNames.push(step.name);

		for (const contribution of contributions) {
			if (contribution.remainingQuantity <= 0) continue;
			const craftActions = Math.ceil(
				contribution.remainingQuantity / contribution.recipeQuantity,
			);
			for (const skill of contribution.skills) {
				if (!skill.experience) continue;
				totals.set(
					skill.name,
					(totals.get(skill.name) ?? 0) + craftActions * skill.experience,
				);
			}
		}
	}

	return { totals: sortedTotals(totals), ambiguousItemNames };
}

/**
 * Computes the experience summary for the tracked root items themselves, which are
 * never included in the steps' contributions. This function resolves the material
 * tree for each tracked item and finds its root recipe to calculate the total
 * experience gained from crafting these items. If a tracked item has multiple
 * active variants, it marks the experience as ambiguous.
 */
export function computeRootExperienceSummary({
	filteredItemIds,
	allItems,
	multipliers,
}: Pick<
	Params,
	"filteredItemIds" | "allItems" | "multipliers"
>): ExperienceSummaryResult {
	const totals = new Map<string, number>();
	const ambiguousItemNames: string[] = [];

	for (const trackedItemId of filteredItemIds) {
		const markedNodeIds = getMarkedNodeIds(allItems[trackedItemId]);
		if (!markedNodeIds) continue;

		const multiplier = multipliers[trackedItemId] || 1;
		const tree = resolveMaterialTree(trackedItemId, multiplier);
		const { recipe, isAmbiguous } = findRootRecipe(tree, markedNodeIds);
		if (isAmbiguous && tree[0]) ambiguousItemNames.push(tree[0].item.name);
		if (!recipe) continue;

		const craftActions = Math.ceil(multiplier / (recipe.quantity || 1));
		for (const skill of recipe.skills) {
			if (!skill.experience) continue;
			totals.set(
				skill.name,
				(totals.get(skill.name) ?? 0) + craftActions * skill.experience,
			);
		}
	}

	return { totals: sortedTotals(totals), ambiguousItemNames };
}

/**
 * Combines experience from the tracked items' own crafting step with
 * experience from every marked ingredient step beneath them into one
 * per-skill total, plus the names of any items whose contribution to that
 * total is a guess rather than a known-correct value.
 *
 * These two sources never overlap and neither can stand in for the other:
 * `roots` exists because a tracked item's own top-level node is never
 * markable (see findRootRecipe in build-steps.ts), so its experience can't
 * come from `steps` at all — it has to be resolved independently.
 *
 * @param params - The parameters for building the experience summary.
 * @returns An object containing the total experience per skill and any ambiguous item names.
 */
export function buildExperienceSummary(
	params: Params,
): ExperienceSummaryResult {
	const ingredients = computeExperienceSummary(buildSteps(params));
	const roots = computeRootExperienceSummary(params);

	const totals = new Map<string, number>();
	for (const entry of ingredients.totals)
		totals.set(entry.skill, entry.experience);
	for (const entry of roots.totals) {
		totals.set(entry.skill, (totals.get(entry.skill) ?? 0) + entry.experience);
	}

	const ambiguousItemNames = Array.from(
		new Set([...roots.ambiguousItemNames, ...ingredients.ambiguousItemNames]),
	);

	return { totals: sortedTotals(totals), ambiguousItemNames };
}
