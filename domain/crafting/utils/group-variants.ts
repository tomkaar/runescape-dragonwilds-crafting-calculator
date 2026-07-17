import type { ResolvedItem } from "@/domain/crafting/types/resolved-item";

/**
 * Builds a unique node ID for a given item in a resolved tree, based on its
 * parent node ID, item ID, and optional variant suffix.
 * @param parentNodeId The ID of the parent node. Can be null for root nodes.
 * @param itemId The ID of the item the node is being created for.
 * @param variantSuffix An optional suffix to distinguish between different recipe variants of the same item.
 * @returns A unique string that serves as the node ID.
 */
export function buildNodeId(
	parentNodeId: string | null,
	itemId: string,
	variantSuffix: string | null = null,
): string {
	return [parentNodeId, itemId, variantSuffix]
		.filter((p): p is string => p !== null)
		.join("_");
}

/**
 * Groups consecutive ResolvedItems that belong to the same multi-variant item into
 * a single array, so they can be rendered as a selector + variant node pair.
 * Single-variant items are wrapped in a one-element array for uniform iteration.
 */
export function groupVariants(items: ResolvedItem[]): ResolvedItem[][] {
	return items.reduce<ResolvedItem[][]>((groups, item) => {
		const last = groups[groups.length - 1];
		if (
			last &&
			last[0].item.id === item.item.id &&
			item.variantIndex !== null
		) {
			last.push(item);
		} else {
			groups.push([item]);
		}
		return groups;
	}, []);
}
