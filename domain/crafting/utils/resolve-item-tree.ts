import { cache } from "react";
import { sourceItemById } from "@/utils/source-item-by-id";
import type { ResolvedItem } from "../types/resolved-item";

/**
 * Recursively resolves the crafting tree for a given item, returning a hierarchical structure of ResolvedItems.
 * Each ResolvedItem contains the item, variant, quantities, facilities, and its children.
 * @param itemId The ID of the item to resolve.
 * @param quantityNeeded The quantity of the item needed.
 * @param isRoot Indicates if this is the root call (used for excess item calculation).
 * @param ancestors IDs of the items above this one in the current branch, used to avoid cycles.
 * @returns An array of ResolvedItems representing the crafting tree for the given item.
 */
function resolveItemTreeInternal(
	itemId: string,
	quantityNeeded: number,
	isRoot: boolean,
	ancestors: ReadonlySet<string> = new Set(),
): ResolvedItem[] {
	const item = sourceItemById(itemId);
	if (!item || item.variants.length === 0) return [];

	const path = new Set(ancestors).add(item.id.toLowerCase());

	// Skip variants that consume an item already in this branch, e.g. recycling
	// recipes like Gold Leaf -> Gold Bar while resolving Gold Bar -> Gold Leaf.
	// Following them would recurse forever.
	const acyclicVariants = item.variants.filter(
		(variant) =>
			!variant.recipe?.materials.some((mat) =>
				path.has(mat.itemId.toLowerCase()),
			),
	);
	// If every variant is cyclic, keep the item as a leaf so it still shows up as a material.
	const variants =
		acyclicVariants.length > 0
			? acyclicVariants
			: [{ ...item.variants[0], recipe: null }];

	const multipleVariants = variants.length > 1;

	return variants.map((variant, idx) => {
		const recipeWillCreateQuantity = variant.recipe?.quantity || 1;
		const recipeMultiplier = Math.ceil(
			quantityNeeded / recipeWillCreateQuantity,
		);
		const quantityRecieved = recipeMultiplier * recipeWillCreateQuantity;

		const children: ResolvedItem[] = [];
		for (const mat of variant.recipe?.materials ?? []) {
			const subItems = resolveItemTreeInternal(
				mat.itemId,
				mat.quantity * recipeMultiplier,
				false,
				path,
			);
			children.push(...subItems);
		}

		return {
			item,
			variant,
			variantIndex: multipleVariants ? idx : null,
			quantityNeeded,
			quantityRecieved,
			hasExcessItems: !isRoot && quantityRecieved > quantityNeeded,
			facilities: variant.recipe?.facilities ?? [],
			isLeaf: children.length === 0,
			children,
		};
	});
}

/**
 * Resolves the crafting tree for a given item, returning a hierarchical structure of ResolvedItems.
 * Each ResolvedItem contains the item, variant, quantities, facilities, and its children.
 * @param itemId The ID of the item to resolve.
 * @param quantityNeeded The quantity of the item needed. Defaults to 1.
 * @returns An array of ResolvedItems representing the crafting tree for the given item.
 */
export const resolveItemTree = cache(
	(itemId: string, quantityNeeded = 1): ResolvedItem[] =>
		resolveItemTreeInternal(itemId, quantityNeeded, true),
);
