import type { MaterialTreeItem } from "@/features/material-tree/types/material-tree";
import type {
	MaterialPathSegment,
	MissingMarking,
} from "../types/owned-material-entry";

type TrackedTree = {
	tree: MaterialTreeItem[];
	/** Marked (TODO or DONE) nodeIds for this tracked item. */
	markedNodeIds: Set<string>;
};

// Tracked items are all treated as the same parent: a material marked directly
// under one is expected directly under every other tracked item that uses it.
// Item ids are never empty, so this can't collide with a material's key.
const TRACKED_ITEM_KEY = "";

// A place a parent item appears that its children are expected to be marked
// under: either a tracked item's own top-level node or a marked material.
type ParentOccurrence = {
	path: MaterialPathSegment[];
	// The child lists the parent can be crafted from — one per recipe variant,
	// or a single list for a single-recipe item.
	recipes: MaterialTreeItem[][];
	markedNodeIds: Set<string>;
};

function toSegment(node: MaterialTreeItem): MaterialPathSegment {
	return { itemId: node.id, name: node.item.name, image: node.item.image };
}

function pathKey(missing: MissingMarking): string {
	return missing.path.map((s) => s.itemId).join(">");
}

function getRecipes(node: MaterialTreeItem): MaterialTreeItem[][] {
	if (!("children" in node)) return [[]];
	const isSelector = node.children.some((c) => c.variantNumber !== undefined);
	return isSelector
		? node.children.map((variant) =>
				"children" in variant ? variant.children : [],
			)
		: [node.children];
}

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

function findMissing(
	occurrence: ParentOccurrence,
	materialId: string,
): MissingMarking | null {
	const { recipes, markedNodeIds } = occurrence;
	const contains = (recipe: MaterialTreeItem[]) =>
		recipe.some((c) => c.id === materialId);

	if (!recipes.some(contains)) return null;
	const isMarked = recipes.some((recipe) =>
		recipe.some((c) => c.id === materialId && markedNodeIds.has(c.nodeId)),
	);
	if (isMarked) return null;

	if (recipes.length === 1) return { path: occurrence.path, anyRecipe: false };

	// A recipe with anything marked beneath it is treated as the chosen one.
	const chosen = recipes.filter((recipe) =>
		hasMarkedNode(recipe, markedNodeIds),
	);
	if (chosen.length === 0) return { path: occurrence.path, anyRecipe: true };
	return chosen.some(contains)
		? { path: occurrence.path, anyRecipe: false }
		: null;
}

/**
 * Finds, per material item id, the places it's needed but hasn't been marked.
 *
 * For every marked material M with parent P, each other place P appears as
 * a marked material is expected to have M marked beneath it too — and when
 * P is a tracked item, every other tracked item using M directly is too; a place where it isn't means M's total
 * undercounts. Places where P itself is unmarked are skipped, since the user
 * chose not to collect through that branch. For a multi-variant P, a recipe
 * with anything marked beneath it is treated as chosen and only it is
 * checked; when none is, M is missing if any recipe uses it.
 *
 * Each place is checked separately, so a gap within a single tracked item is
 * caught too.
 */
export function computeMissingMarkings(
	trackedTrees: TrackedTree[],
): Map<string, MissingMarking[]> {
	// Keyed by the parent's item id, or TRACKED_ITEM_KEY for tracked items.
	const occurrencesByParent = new Map<string, ParentOccurrence[]>();
	// Parent key → item ids of the materials marked directly beneath it.
	const markedChildrenByParent = new Map<string, Set<string>>();

	function walk(
		nodes: MaterialTreeItem[],
		parentKey: string | null,
		path: MaterialPathSegment[],
		markedNodeIds: Set<string>,
	) {
		for (const node of nodes) {
			// Variant nodes are transparent — recurse with the same parent/path
			if (node.variantNumber !== undefined) {
				if ("children" in node) {
					walk(node.children, parentKey, path, markedNodeIds);
				}
				continue;
			}

			const isMarked = markedNodeIds.has(node.nodeId);
			if (isMarked && parentKey !== null) {
				let children = markedChildrenByParent.get(parentKey);
				if (!children) {
					children = new Set();
					markedChildrenByParent.set(parentKey, children);
				}
				children.add(node.id);
			}

			const isTrackedItem = parentKey === null;
			const nodeKey = isTrackedItem ? TRACKED_ITEM_KEY : node.id;
			const nodePath = [...path, toSegment(node)];
			if (isTrackedItem || isMarked) {
				let occurrences = occurrencesByParent.get(nodeKey);
				if (!occurrences) {
					occurrences = [];
					occurrencesByParent.set(nodeKey, occurrences);
				}
				occurrences.push({
					path: nodePath,
					recipes: getRecipes(node),
					markedNodeIds,
				});
			}

			if ("children" in node) {
				walk(node.children, nodeKey, nodePath, markedNodeIds);
			}
		}
	}

	for (const { tree, markedNodeIds } of trackedTrees) {
		walk(tree, null, [], markedNodeIds);
	}

	const result = new Map<string, MissingMarking[]>();
	for (const [parentKey, materialIds] of markedChildrenByParent) {
		for (const materialId of materialIds) {
			for (const occurrence of occurrencesByParent.get(parentKey) ?? []) {
				const missing = findMissing(occurrence, materialId);
				if (!missing) continue;
				const list = result.get(materialId) ?? [];
				// The same item path can be reached more than once (e.g. under
				// different recipes of an ancestor) — list it only once.
				const key = pathKey(missing);
				if (list.some((m) => pathKey(m) === key)) continue;
				list.push(missing);
				result.set(materialId, list);
			}
		}
	}
	return result;
}
