import { cache } from "react";
import type { ResolvedItem } from "@/domain/crafting/types/resolved-item";
import { resolveItemTree } from "@/domain/crafting/utils/resolve-item-tree";
import type { Edge } from "../schemas/Edge";
import type { Node } from "../schemas/Node";

type Args = {
	/**
	 * The item ID to resolve the crafting tree for
	 */
	itemId: string;
	/**
	 * The quantity of the item to resolve the crafting tree for,
	 * used for scaling the quantities of materials in the tree
	 */
	prevQuantity?: number;
	/**
	 * When recursing, the previous item ID, used for building unique node IDs
	 */
	prevItemId?: string;
	/**
	 * Indicates if this is the starting point of the tree resolution
	 */
	initialNode?: boolean;
	/**
	 * The initial item ID for the tree
	 */
	initialItemId?: string;
};

type ResolveCraftingTreeResult = {
	nodes: Node[];
	edges: Edge[];
};

/**
 * Builds a unique node ID for a given item in the crafting tree, based on its parent node ID, item ID, and optional variant suffix.
 * @param parentNodeId The ID of the parent node in the crafting tree. Can be null for root nodes.
 * @param itemId The ID of the item for which the node is being created.
 * @param variantSuffix An optional suffix to distinguish between different recipe variants of the same item.
 * @returns A unique string that serves as the node ID in the crafting tree.
 */
function buildNodeId(
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
function groupVariants(items: ResolvedItem[]): ResolvedItem[][] {
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

/**
 * Converts a flat list of ResolvedItems into React Flow nodes and edges.
 * Recurses into children so the full tree is flattened into a single nodes/edges result.
 */
function adaptToNodesAndEdges(
	resolvedItems: ResolvedItem[],
	parentNodeId: string | null,
	initialItemId: string,
	isInitialNode: boolean,
): ResolveCraftingTreeResult {
	const nodes: Node[] = [];
	const edges: Edge[] = [];

	// Each group is either a single-item array (one recipe variant) or a multi-item
	// array (multiple recipe variants for the same item).
	for (const group of groupVariants(resolvedItems)) {
		const [first] = group;

		if (first.variantIndex === null) {
			const nodeId = buildNodeId(parentNodeId, first.item.id);

			nodes.push({
				type: "material",
				id: nodeId,
				data: {
					id: first.item.id,
					label: first.item.name,
					image: first.variant.image || null,
					isRecipeNumberVariant: null,
					facilities: first.facilities,
					quantityNeeded: first.quantityNeeded,
					quantityRecieved: first.quantityRecieved,
					hasExcessItems: first.hasExcessItems,
					initialItemId,
					leafNode: first.isLeaf,
					isRoot: isInitialNode,
				},
				position: { x: 0, y: 0 },
			});

			edges.push({
				type: "edge",
				id: nodeId,
				source: parentNodeId || "root",
				target: nodeId,
				data: { highlighted: false },
			});

			if (first.children.length > 0) {
				const sub = adaptToNodesAndEdges(
					first.children,
					nodeId,
					initialItemId,
					false,
				);
				nodes.push(...sub.nodes);
				edges.push(...sub.edges);
			}

			continue;
		}

		// Multi-variant: create a selector node that the user picks a recipe from,
		// then one child node per variant connected to it with highlighted edges.
		const selectorNodeId = buildNodeId(parentNodeId, first.item.id);

		nodes.push({
			type: "recipe-group",
			id: selectorNodeId,
			data: {
				id: first.item.id,
				label: first.item.name,
				image: first.item.image || null,
				numberOfRecipies: group.length,
				quantityNeeded: first.quantityNeeded,
				initialItemId,
				isRoot: isInitialNode,
			},
			position: { x: 0, y: 0 },
		});

		edges.push({
			type: "edge",
			id: selectorNodeId,
			source: parentNodeId || "root",
			target: selectorNodeId,
			data: { highlighted: false },
		});

		// One node and edge per recipe variant, rooted at the selector node.
		group.forEach((variantItem, vi) => {
			const variantNodeId = buildNodeId(parentNodeId, first.item.id, `v${vi}`);

			nodes.push({
				type: "material",
				id: variantNodeId,
				data: {
					id: first.item.id,
					label: first.item.name,
					image: variantItem.variant.image || null,
					isRecipeNumberVariant: vi + 1,
					facilities: variantItem.facilities,
					quantityNeeded: variantItem.quantityNeeded,
					quantityRecieved: variantItem.quantityRecieved,
					hasExcessItems: variantItem.hasExcessItems,
					initialItemId,
					leafNode: variantItem.isLeaf,
					isRoot: false,
				},
				position: { x: 0, y: 0 },
			});

			edges.push({
				type: "edge",
				id: variantNodeId,
				source: selectorNodeId,
				target: variantNodeId,
				data: { highlighted: true },
			});

			if (variantItem.children.length > 0) {
				const sub = adaptToNodesAndEdges(
					variantItem.children,
					variantNodeId,
					initialItemId,
					false,
				);
				nodes.push(...sub.nodes);
				edges.push(...sub.edges);
			}
		});
	}

	return { nodes, edges };
}

/**
 * Resolves the crafting tree for a given item, returning React Flow nodes and edges.
 * Delegates business logic (quantities, multipliers, excess) to resolveItemTree and
 * adapts the result into the flat nodes/edges structure React Flow expects.
 * Memoized per React request so multiple components resolving the same item share one result.
 * @param args The arguments for resolving the crafting tree, including itemId, previous quantity, and other optional parameters.
 * @returns An object containing the nodes and edges representing the crafting tree.
 */
export const resolveCraftingTree = cache(
	(args: Args): ResolveCraftingTreeResult => {
		const { initialItemId = args.itemId } = args;
		const isInitialNode = args.initialNode ?? true;
		const quantityNeeded = args.prevQuantity ?? 1;

		const resolvedItems = resolveItemTree(args.itemId, quantityNeeded);
		if (resolvedItems.length === 0) return { nodes: [], edges: [] };

		return adaptToNodesAndEdges(
			resolvedItems,
			args.prevItemId ?? null,
			initialItemId,
			isInitialNode,
		);
	},
);
