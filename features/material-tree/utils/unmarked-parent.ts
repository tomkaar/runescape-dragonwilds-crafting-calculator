import type { MaterialTreeItem } from "../types/material-tree";

/**
 * For an unmarked material node, names the nearest marked materials beneath
 * it — owned stock of this node can't discount them until it's marked too.
 * Returns an empty list when the node isn't such a gap: it's marked itself,
 * it's the tracked item's own node, it's a recipe variant row, or nothing
 * beneath it is marked.
 */
export function getMarkedBeneathNames(
	node: MaterialTreeItem,
	rootNodeId: string,
	markedNodeIds: Set<string>,
): string[] {
	if (
		node.variantNumber !== undefined ||
		node.nodeId === rootNodeId ||
		markedNodeIds.has(node.nodeId)
	) {
		return [];
	}

	const names = new Set<string>();
	const visit = (children: MaterialTreeItem[]) => {
		for (const child of children) {
			if (
				child.variantNumber === undefined &&
				markedNodeIds.has(child.nodeId)
			) {
				names.add(child.item.name);
			} else if ("children" in child) {
				visit(child.children);
			}
		}
	};
	if ("children" in node) visit(node.children);
	return [...names];
}
