import { resolveMaterialTree } from "@/features/material-tree/utils/resolve-material-tree";
import type { SelectedMaterial } from "@/store/selected-material";
import { sourceItemById } from "@/utils/source-item-by-id";
import type { OwnedMaterialEntry } from "../types/owned-material-entry";
import {
	computeAdjustedGross,
	getMarkedNodeIds,
	type RecipeContributionAccumulator,
	type StepEntry,
	walkTree,
} from "./build-steps";
import { flattenQuantities } from "./flatten-quantities";

type Params = {
	/** Ids of the items the user is currently tracking. */
	trackedItemIds: string[];
	/** All marked material entries from the store, keyed by tracked item id. */
	allItems: Record<string, SelectedMaterial[]>;
	/** Per-tracked-item quantity multipliers (defaults to 1 when absent). */
	multipliers: Record<string, number>;
	/** Owned quantity per material item id. */
	owned: Record<string, number>;
};

/**
 * Aggregates marked materials across all tracked items into per-material totals.
 *
 * For each tracked item, the function resolves its material tree (respecting the
 * multiplier), then sums the needed quantity for every material the user has
 * marked — regardless of TODO/DONE state. Materials that appear in multiple
 * tracked items are merged into a single entry with a combined `total` count.
 *
 * `adjustedValue` reuses the same ancestor-discount logic as Next Steps
 * (computeAdjustedGross): owning some of a marked parent material reduces how
 * many of its children are needed. DONE-marked parents are included so a
 * fully collected parent still discounts its children.
 *
 * @returns One `OwnedMaterialEntry` per distinct material, with the total and
 *   adjusted quantities needed and the list of (trackedItemId, nodeId) pairs
 *   that contributed to it.
 */
export function buildOwnedMaterials({
	trackedItemIds,
	allItems,
	multipliers,
	owned,
}: Params): OwnedMaterialEntry[] {
	const aggregated = new Map<string, OwnedMaterialEntry>();
	const stepAggregated = new Map<string, StepEntry>();
	const recipeAccumulators = new Map<string, RecipeContributionAccumulator>();

	for (const trackedItemId of trackedItemIds) {
		const multiplier = multipliers[trackedItemId] ?? 1;
		const tree = resolveMaterialTree(trackedItemId, multiplier);

		// Build a nodeId → quantity lookup from the resolved tree so we use the
		// multiplied quantity rather than the raw value stored on the entry.
		const quantityMap = new Map(
			flattenQuantities(tree).map((n) => [n.nodeId, n.quantity]),
		);

		const markedNodeIds = getMarkedNodeIds(allItems[trackedItemId], {
			includeDone: true,
		});
		if (markedNodeIds) {
			const trackedItem = sourceItemById(trackedItemId);
			walkTree(
				tree,
				0,
				null,
				trackedItemId,
				trackedItem?.name ?? trackedItemId,
				trackedItem?.image ?? null,
				markedNodeIds,
				stepAggregated,
				recipeAccumulators,
			);
		}

		for (const entry of allItems[trackedItemId] ?? []) {
			if (!entry.nodeId) continue;
			const material = sourceItemById(entry.itemId);
			if (!material) continue;

			const quantity = quantityMap.get(entry.nodeId) ?? entry.quantity;

			const existing = aggregated.get(entry.itemId);
			if (existing) {
				existing.total += quantity;
				existing.nodeRefs.push({ trackedItemId, nodeId: entry.nodeId });
			} else {
				aggregated.set(entry.itemId, {
					itemId: entry.itemId,
					name: material.name,
					wikiLink: material.wikiLink,
					image: material.image,
					total: quantity,
					adjustedValue: quantity,
					nodeRefs: [{ trackedItemId, nodeId: entry.nodeId }],
				});
			}
		}
	}

	const adjustedMap = computeAdjustedGross(stepAggregated, owned);

	return Array.from(aggregated.values(), (entry) => ({
		...entry,
		// Deficit-ratio scaling can land on a fraction; round up since you can't
		// collect a partial item. Entries whose node isn't in the resolved tree
		// get no discount.
		adjustedValue: Math.ceil(adjustedMap.get(entry.itemId) ?? entry.total),
	}));
}
