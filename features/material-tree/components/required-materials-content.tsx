"use client";

import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useSelectedMaterial } from "@/store/selected-material";
import type { MaterialTreeItem } from "../types/material-tree";
import {
	getActiveRecipeNumbers,
	type RecipeConflict,
} from "../utils/recipe-conflict";
import { resolveMaterialTree } from "../utils/resolve-material-tree";
import { MaterialTreeNode } from "./material-tree-node";

type Props = {
	itemId: string;
	skipFirstLayer?: boolean;
};

function buildBaseQuantityMap(
	nodes: MaterialTreeItem[],
	map: Map<string, number> = new Map(),
): Map<string, number> {
	for (const node of nodes) {
		map.set(node.nodeId, node.quantity);
		if ("children" in node) buildBaseQuantityMap(node.children, map);
	}
	return map;
}

export function RequiredMaterialsContent({
	itemId,
	skipFirstLayer = false,
}: Props) {
	const multipliers = useMaterialMultiplier((state) => state.items);
	const multiplier = multipliers[itemId] || 1;
	const tree = resolveMaterialTree(itemId, multiplier);
	const baseTree = resolveMaterialTree(itemId);
	const baseQuantities = buildBaseQuantityMap(baseTree);

	const marked = useSelectedMaterial((state) => state.items[itemId]);

	// With the tracked item's own row hidden, a conflict between its recipes is
	// shown on the recipe rows instead (see MaterialTreeNode).
	let hiddenParentConflict: RecipeConflict | null = null;
	if (skipFirstLayer && tree[0]) {
		const markedNodeIds = new Set(
			(marked ?? []).flatMap((m) => (m.nodeId ? [m.nodeId] : [])),
		);
		const recipeNumbers = getActiveRecipeNumbers(tree[0], markedNodeIds);
		if (recipeNumbers.length > 1) {
			hiddenParentConflict = { name: tree[0].item.name, recipeNumbers };
		}
	}

	const nodes = skipFirstLayer
		? tree.flatMap((root) => ("children" in root ? root.children : []))
		: tree;

	return (
		<div className="">
			{nodes.map((item) => (
				<MaterialTreeNode
					key={item.nodeId}
					item={item}
					initialItemId={itemId}
					baseQuantities={baseQuantities}
					hiddenParentConflict={hiddenParentConflict}
				/>
			))}
		</div>
	);
}
