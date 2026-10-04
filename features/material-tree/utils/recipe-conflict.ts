import type { MaterialTreeItem } from "../types/material-tree";

/** A multi-recipe item with materials marked under more than one recipe. */
export type RecipeConflict = { name: string; recipeNumbers: number[] };

function hasMarkedNode(
	nodes: MaterialTreeItem[],
	markedNodeIds: Set<string>,
): boolean {
	return nodes.some(
		(node) =>
			markedNodeIds.has(node.nodeId) ||
			("children" in node && hasMarkedNode(node.children, markedNodeIds)),
	);
}

/**
 * For a multi-recipe item, the numbers of the recipes with anything marked
 * beneath them (at any depth), in recipe order. Each recipe's materials are
 * counted at the item's full quantity, so more than one active recipe means
 * its totals are counted more than once. Empty for a single-recipe item.
 */
export function getActiveRecipeNumbers(
	node: MaterialTreeItem,
	markedNodeIds: Set<string>,
): number[] {
	if (!("children" in node)) return [];
	return node.children.flatMap((variant) =>
		variant.variantNumber !== undefined &&
		"children" in variant &&
		hasMarkedNode(variant.children, markedNodeIds)
			? [variant.variantNumber]
			: [],
	);
}
