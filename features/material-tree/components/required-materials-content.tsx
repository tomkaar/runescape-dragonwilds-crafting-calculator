"use client";

import { useMaterialMultiplier } from "@/store/material-multiplier";
import type { MaterialTreeItem } from "../types/material-tree";
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
				/>
			))}
		</div>
	);
}
