import type { MaterialTreeItem } from "@/features/material-tree/types/material-tree";
import type { UnmarkedParents } from "../types/owned-material-entry";
import type { TrackedTree } from "./missing-markings";

/**
 * Finds, per material item id, the places it's marked beneath materials that
 * aren't marked themselves.
 *
 * The total is still right, but owned stock only discounts marked parents
 * (see computeAdjustedGross), so owning some of an unmarked parent never
 * lowers how much of the material is needed — and the parent has no
 * Collected Materials row to enter that stock in. Every unmarked material
 * between the marked one and its nearest marked ancestor (or the tracked
 * item) is listed. Recipe variant nodes are skipped; DONE counts as marked.
 */
export function computeUnmarkedParents(
	trackedTrees: TrackedTree[],
): Map<string, UnmarkedParents[]> {
	const result = new Map<string, UnmarkedParents[]>();

	function walk(
		nodes: MaterialTreeItem[],
		ancestors: MaterialTreeItem[],
		trackedItemId: string,
		markedNodeIds: Set<string>,
	) {
		for (const node of nodes) {
			// Variant nodes are transparent — recurse with the same ancestors
			if (node.variantNumber !== undefined) {
				if ("children" in node) {
					walk(node.children, ancestors, trackedItemId, markedNodeIds);
				}
				continue;
			}

			// ancestors[0] is the tracked item itself, which can't be marked
			if (ancestors.length > 1 && markedNodeIds.has(node.nodeId)) {
				const unmarked: UnmarkedParents["unmarked"] = [];
				for (let i = ancestors.length - 1; i > 0; i--) {
					const ancestor = ancestors[i];
					if (markedNodeIds.has(ancestor.nodeId)) break;
					unmarked.unshift({
						nodeId: ancestor.nodeId,
						itemId: ancestor.id,
						name: ancestor.item.name,
					});
				}
				if (unmarked.length > 0) {
					addUnique(result, node.id, {
						trackedItemId,
						path: ancestors.map((a) => ({
							itemId: a.id,
							name: a.item.name,
							image: a.item.image,
						})),
						unmarked,
					});
				}
			}

			if ("children" in node) {
				walk(node.children, [...ancestors, node], trackedItemId, markedNodeIds);
			}
		}
	}

	for (const { trackedItemId, tree, markedNodeIds } of trackedTrees) {
		walk(tree, [], trackedItemId, markedNodeIds);
	}
	return result;
}

// The same item path can be reached more than once (e.g. under different
// recipes of an ancestor) — list it only once.
function addUnique(
	result: Map<string, UnmarkedParents[]>,
	materialId: string,
	entry: UnmarkedParents,
) {
	const key = entry.path.map((s) => s.itemId).join(">");
	const list = result.get(materialId) ?? [];
	if (list.some((e) => e.path.map((s) => s.itemId).join(">") === key)) return;
	list.push(entry);
	result.set(materialId, list);
}
