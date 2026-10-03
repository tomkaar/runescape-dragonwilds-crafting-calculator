import type { MaterialTreeItem } from "@/features/material-tree/types/material-tree";
import type {
	MaterialPathSegment,
	MissingMarking,
} from "../types/owned-material-entry";

type TrackedTree = {
	trackedItemId: string;
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
	trackedItemId: string;
	path: MaterialPathSegment[];
	// What the parent can be crafted from — one entry per recipe variant, or a
	// single entry (number null) for a single-recipe item.
	recipes: Recipe[];
	markedNodeIds: Set<string>;
};

type Recipe = { number: number | null; children: MaterialTreeItem[] };

function toSegment(node: MaterialTreeItem): MaterialPathSegment {
	return { itemId: node.id, name: node.item.name, image: node.item.image };
}

function pathKey(missing: MissingMarking): string {
	return missing.path.map((s) => s.itemId).join(">");
}

function getRecipes(node: MaterialTreeItem): Recipe[] {
	if (!("children" in node)) return [{ number: null, children: [] }];
	const isSelector = node.children.some((c) => c.variantNumber !== undefined);
	return isSelector
		? node.children.map((variant) => ({
				number: variant.variantNumber ?? null,
				children: "children" in variant ? variant.children : [],
			}))
		: [{ number: null, children: node.children }];
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
	const { trackedItemId, path, recipes, markedNodeIds } = occurrence;
	const materialNodes = (recipe: Recipe) =>
		recipe.children.filter((c) => c.id === materialId);

	if (!recipes.some((recipe) => materialNodes(recipe).length > 0)) return null;
	const isMarked = recipes.some((recipe) =>
		materialNodes(recipe).some((c) => markedNodeIds.has(c.nodeId)),
	);
	if (isMarked) return null;

	// A recipe with anything marked beneath it is treated as the chosen one.
	const chosen = recipes.filter((recipe) =>
		hasMarkedNode(recipe.children, markedNodeIds),
	);
	const anyRecipe = recipes.length > 1 && chosen.length === 0;
	const targets = (
		anyRecipe || recipes.length === 1 ? recipes : chosen
	).flatMap((recipe) =>
		materialNodes(recipe).map((c) => ({
			nodeId: c.nodeId,
			recipeNumber: recipe.number,
		})),
	);
	return targets.length > 0
		? { trackedItemId, path, anyRecipe, targets }
		: null;
}

/**
 * Finds, per material item id, the places it's needed but hasn't been marked.
 *
 * For every marked material M with parent P, each other place P appears as
 * a marked material is expected to have M marked beneath it too — and when P
 * is a tracked item, so is every other tracked item using M directly. A place
 * where it isn't means M's total undercounts. Places where P itself is unmarked are skipped, since the user
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
		trackedItemId: string,
		markedNodeIds: Set<string>,
	) {
		for (const node of nodes) {
			// Variant nodes are transparent — recurse with the same parent/path
			if (node.variantNumber !== undefined) {
				if ("children" in node) {
					walk(node.children, parentKey, path, trackedItemId, markedNodeIds);
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
					trackedItemId,
					path: nodePath,
					recipes: getRecipes(node),
					markedNodeIds,
				});
			}

			if ("children" in node) {
				walk(node.children, nodeKey, nodePath, trackedItemId, markedNodeIds);
			}
		}
	}

	for (const { trackedItemId, tree, markedNodeIds } of trackedTrees) {
		walk(tree, null, [], trackedItemId, markedNodeIds);
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
