import type { MaterialTreeItem } from "@/features/material-tree/types/material-tree";
import { resolveMaterialTree } from "@/features/material-tree/utils/resolve-material-tree";
import type { Recipe, RecipeSkill } from "@/Types";
import { sourceItemById } from "@/utils/source-item-by-id";

export type MarkedMaterial = {
	id: string;
	itemId: string;
	quantity: number;
	nodeId?: string;
	state: "TODO" | "DONE";
};

/**
 * Shared by anything that needs to know which nodes of a tracked item's tree
 * the user has marked as todo — null when there's nothing marked yet, so
 * callers can bail out in one check instead of re-deriving it themselves.
 * Pass `includeDone` to also count nodes already marked DONE.
 */
export function getMarkedNodeIds(
	marked: MarkedMaterial[] | undefined,
	{ includeDone = false }: { includeDone?: boolean } = {},
): Set<string> | null {
	const markedTodo = (marked ?? []).filter(
		(m) => (includeDone || m.state === "TODO") && m.nodeId,
	);
	if (markedTodo.length === 0) return null;
	// biome-ignore lint/style/noNonNullAssertion: <Marked TODOs are filtered to only include entries with a nodeId>
	return new Set(markedTodo.map((m) => m.nodeId!));
}

/**
 * The tracked item's own top-level node never appears in `steps` — the item
 * cards only ever expose its *children* for marking (see skipFirstLayer in
 * RequiredMaterialsContent), so crafting the finished piece itself is never
 * a markable "step". Finds that top-level node's recipe so callers (XP,
 * facilities) don't silently drop whatever it grants/requires. For a
 * multi-variant item there's no top-level node with its own recipe (variants
 * are children of a selector) — the "active" variant is inferred from
 * whichever ones have a marked descendant, mirroring how walkTree already
 * scopes marked nodeIds by their variant-path prefix. More than one active
 * variant means there's no way to know which recipe will actually be
 * crafted; the first one found is used, and the caller is told it's
 * ambiguous.
 */
export function findRootRecipe(
	tree: MaterialTreeItem[],
	markedNodeIds: Set<string>,
): { recipe: Recipe | null; isAmbiguous: boolean } {
	for (const node of tree) {
		if (node.variant)
			return { recipe: node.variant.recipe, isAmbiguous: false };
		if ("children" in node) {
			const activeVariants = node.children.filter(
				(child) =>
					child.variantNumber !== undefined &&
					Array.from(markedNodeIds).some(
						(id) => id === child.nodeId || id.startsWith(`${child.nodeId}_`),
					),
			);
			return {
				recipe: activeVariants[0]?.variant?.recipe ?? null,
				isAmbiguous: activeVariants.length > 1,
			};
		}
	}
	return { recipe: null, isAmbiguous: false };
}

type StepParent = {
	itemId: string;
	name: string;
	quantity: number;
	image: string | null;
};

export type CoverageWarning = {
	parentItemId: string;
	parentName: string;
	missingRoots: Array<{ itemId: string; name: string; image: string | null }>;
};

// One distinct recipe that (partly) produces this step's item, and how much
// of the step's final remaining quantity is attributed to that recipe —
// scaled from this recipe's share of the item's gross demand, since a single
// item can be reached through more than one variant/recipe across the tree.
type StepRecipeContribution = {
	skills: RecipeSkill[];
	recipeQuantity: number;
	remainingQuantity: number;
};

export type NeededMaterial = {
	itemId: string;
	name: string;
	image: string | null;
	quantity: number;
};

type StepNeeded = {
	// Ingredients merged from every recipe the step resolves to, in the order
	// the recipes were first reached.
	materials: NeededMaterial[];
	// One entry per candidate recipe (in variant order) for the part of the
	// step whose recipe couldn't be inferred — empty when all of it resolved.
	alternatives: NeededMaterial[][];
};

export type StepEntry = {
	itemId: string;
	name: string;
	image: string | null;
	wikiLink?: string;
	quantity: number;
	parents: StepParent[];
	usedFor: Array<{ itemId: string; name: string; image: string | null }>;
	depth: number;
	hasChildren: boolean;
	coverageWarnings: CoverageWarning[];
	recipeContributions?: StepRecipeContribution[];
	facilities: string[];
	needed: StepNeeded;
	// Nothing left to fetch/craft (quantity is 0) — either owned stock covers
	// it, or an ancestor is covered so it's no longer needed at all.
	covered: boolean;
};

// Internal-only accumulator used while walking the tree: tracks each
// distinct recipe's gross (pre owned-stock-discount) contribution to a step,
// keyed by recipe id so quantities from repeated marked nodes sharing the
// same recipe accumulate together.
export type RecipeContributionAccumulator = Map<
	string,
	{ skills: RecipeSkill[]; recipeQuantity: number; grossQuantity: number }
>;

/**
 * Internal-only accumulator for a step's "Needed" ingredients, keyed by item
 * id. Gross quantities are pre owned-stock-discount, like
 * RecipeContributionAccumulator. `resolved` holds occurrences whose recipe is
 * known; `unresolved` pools occurrences of a multi-recipe item where the
 * recipe couldn't be inferred, along with the union of their candidates.
 */
export type NeededAccumulator = {
	resolved: Map<string, { recipe: Recipe; grossQuantity: number }>;
	unresolved: {
		candidates: Map<string, { recipe: Recipe; variantNumber: number }>;
		grossQuantity: number;
	};
};

/**
 * Works out which recipe(s) a marked tree node will be crafted with. A
 * single-recipe item just uses its own. A multi-recipe item is a selector
 * node whose recipe is inferred from which variant subtree holds a marked
 * descendant (as findRootRecipe does); none or several active variants
 * leave it unresolved, with the active variants — or all of them when none
 * is active — as candidates.
 */
function resolveNodeRecipes(
	node: MaterialTreeItem,
	markedNodeIds: Set<string>,
):
	| { kind: "resolved"; recipe: Recipe }
	| {
			kind: "unresolved";
			candidates: Array<{ recipe: Recipe; variantNumber: number }>;
	  }
	| null {
	if (node.variant?.recipe)
		return { kind: "resolved", recipe: node.variant.recipe };
	if (!("children" in node)) return null;

	const variants = node.children.flatMap((child) =>
		child.variantNumber !== undefined && child.variant?.recipe
			? [
					{
						nodeId: child.nodeId,
						recipe: child.variant.recipe,
						variantNumber: child.variantNumber,
					},
				]
			: [],
	);
	if (variants.length === 0) return null;

	const active = variants.filter((v) =>
		Array.from(markedNodeIds).some((id) => id.startsWith(`${v.nodeId}_`)),
	);
	if (active.length === 1)
		return { kind: "resolved", recipe: active[0].recipe };
	return {
		kind: "unresolved",
		candidates: active.length > 1 ? active : variants,
	};
}

function accumulateNeeded(
	neededAccumulators: Map<string, NeededAccumulator>,
	node: MaterialTreeItem,
	markedNodeIds: Set<string>,
) {
	const resolution = resolveNodeRecipes(node, markedNodeIds);
	if (!resolution) return;

	let accumulator = neededAccumulators.get(node.id);
	if (!accumulator) {
		accumulator = {
			resolved: new Map(),
			unresolved: { candidates: new Map(), grossQuantity: 0 },
		};
		neededAccumulators.set(node.id, accumulator);
	}

	if (resolution.kind === "resolved") {
		const existing = accumulator.resolved.get(resolution.recipe.id);
		if (existing) existing.grossQuantity += node.quantity;
		else
			accumulator.resolved.set(resolution.recipe.id, {
				recipe: resolution.recipe,
				grossQuantity: node.quantity,
			});
		return;
	}

	accumulator.unresolved.grossQuantity += node.quantity;
	for (const candidate of resolution.candidates) {
		accumulator.unresolved.candidates.set(candidate.recipe.id, candidate);
	}
}

// Floating-point scaling can land a hair above a whole number (e.g.
// 1.0000000000000002), which a bare Math.ceil would bump to an extra craft.
function craftsFor(quantity: number, recipe: Recipe): number {
	return Math.ceil(Number((quantity / (recipe.quantity || 1)).toFixed(9)));
}

function recipeMaterials(recipe: Recipe, crafts: number): NeededMaterial[] {
	return recipe.materials.map((material) => {
		const item = sourceItemById(material.itemId);
		return {
			itemId: material.itemId,
			name: item?.name ?? material.itemId,
			image: item?.image ?? null,
			quantity: material.quantity * crafts,
		};
	});
}

/**
 * Turns a step's accumulated recipes into its "Needed" ingredients for the
 * step's remaining quantity. Each recipe's share of the remaining quantity
 * is weighted by its share of the gross total (as recipeContributions does),
 * and crafts are rounded up once per recipe so a multi-output recipe shared
 * across tracked items isn't over-counted. The ingredients' own owned stock
 * is deliberately not subtracted — their own steps already account for it.
 */
function computeNeeded(
	accumulator: NeededAccumulator | undefined,
	grossQuantity: number,
	remaining: number,
): StepNeeded {
	if (!accumulator || grossQuantity <= 0 || remaining <= 0) {
		return { materials: [], alternatives: [] };
	}
	const scale = remaining / grossQuantity;

	const merged = new Map<string, NeededMaterial>();
	for (const {
		recipe,
		grossQuantity: recipeGross,
	} of accumulator.resolved.values()) {
		const crafts = craftsFor(recipeGross * scale, recipe);
		for (const material of recipeMaterials(recipe, crafts)) {
			const existing = merged.get(material.itemId);
			if (existing) existing.quantity += material.quantity;
			else merged.set(material.itemId, material);
		}
	}

	const unresolvedQuantity = accumulator.unresolved.grossQuantity * scale;
	const alternatives =
		unresolvedQuantity > 0
			? Array.from(accumulator.unresolved.candidates.values())
					.sort((a, b) => a.variantNumber - b.variantNumber)
					.map(({ recipe }) =>
						recipeMaterials(recipe, craftsFor(unresolvedQuantity, recipe)),
					)
			: [];

	return {
		materials: Array.from(merged.values()).filter((m) => m.quantity > 0),
		alternatives,
	};
}

export type Params = {
	filteredItemIds: string[];
	allItems: Record<string, MarkedMaterial[]>;
	multipliers: Record<string, number>;
	owned: Record<string, number>;
};

export function walkTree(
	nodes: MaterialTreeItem[],
	depth: number,
	parent: StepParent | null,
	trackedItemId: string,
	trackedItemName: string,
	trackedItemImage: string | null,
	markedNodeIds: Set<string>,
	aggregated: Map<string, StepEntry>,
	recipeAccumulators: Map<string, RecipeContributionAccumulator>,
	neededAccumulators?: Map<string, NeededAccumulator>,
) {
	for (const node of nodes) {
		// Variant nodes are transparent — skip but still recurse with the same parent/depth
		if (node.variantNumber !== undefined) {
			if ("children" in node) {
				walkTree(
					node.children,
					depth,
					parent,
					trackedItemId,
					trackedItemName,
					trackedItemImage,
					markedNodeIds,
					aggregated,
					recipeAccumulators,
					neededAccumulators,
				);
			}
			continue;
		}

		const isMarked = !!node.nodeId && markedNodeIds.has(node.nodeId);
		const hasChildren =
			"children" in node &&
			node.children.some(
				(c) => c.variantNumber === undefined || "children" in c,
			);

		if (isMarked) {
			if (neededAccumulators) {
				accumulateNeeded(neededAccumulators, node, markedNodeIds);
			}
			const recipe = node.variant?.recipe;
			const recipeKey = recipe?.id ?? "no-recipe";
			let accumulator = recipeAccumulators.get(node.id);
			if (!accumulator) {
				accumulator = new Map();
				recipeAccumulators.set(node.id, accumulator);
			}
			const recipeContribution = accumulator.get(recipeKey);
			if (recipeContribution) {
				recipeContribution.grossQuantity += node.quantity;
			} else {
				accumulator.set(recipeKey, {
					skills: recipe?.skills ?? [],
					recipeQuantity: recipe?.quantity || 1,
					grossQuantity: node.quantity,
				});
			}

			const existing = aggregated.get(node.id);
			if (existing) {
				existing.quantity += node.quantity;
				if (parent) {
					const existingParent = existing.parents.find(
						(p) => p.itemId === parent.itemId,
					);
					// Track this material's own contribution via this parent (not the
					// parent's quantity) — computeRemainingQuantities uses it to weight
					// the parent's deficit ratio; the display quantity is overwritten
					// with the parent's own remaining count further down.
					if (existingParent) {
						existingParent.quantity += node.quantity;
					} else {
						existing.parents.push({ ...parent, quantity: node.quantity });
					}
				}
				if (!existing.usedFor.find((u) => u.itemId === trackedItemId)) {
					existing.usedFor.push({
						itemId: trackedItemId,
						name: trackedItemName,
						image: trackedItemImage,
					});
				}
				if (depth > existing.depth) existing.depth = depth;
				if (hasChildren) existing.hasChildren = true;
				for (const facility of node.facilities) {
					if (!existing.facilities.includes(facility)) {
						existing.facilities.push(facility);
					}
				}
			} else {
				aggregated.set(node.id, {
					itemId: node.id,
					name: node.item.name,
					image: node.item.image,
					wikiLink: node.item.wikiLink,
					quantity: node.quantity,
					parents: parent ? [{ ...parent, quantity: node.quantity }] : [],
					usedFor: [
						{
							itemId: trackedItemId,
							name: trackedItemName,
							image: trackedItemImage,
						},
					],
					depth,
					hasChildren,
					coverageWarnings: [],
					facilities: [...node.facilities],
					needed: { materials: [], alternatives: [] },
					covered: false,
				});
			}
		}

		if ("children" in node) {
			const nodeAsParent: StepParent = {
				itemId: node.id,
				name: node.item.name,
				quantity: node.quantity,
				image: node.item.image,
			};
			walkTree(
				node.children,
				depth + 1,
				nodeAsParent,
				trackedItemId,
				trackedItemName,
				trackedItemImage,
				markedNodeIds,
				aggregated,
				recipeAccumulators,
				neededAccumulators,
			);
		}
	}
}

/**
 * Computes, per item, how many are needed once owned stock of its ancestors
 * is taken into account — the item's own owned count is NOT subtracted.
 *
 * A flat gross total per item is wrong once an item's parent is itself
 * partly covered by owned stock: e.g. owning 25 of the 48 Refined Obsidian
 * needed means only 23 must actually be crafted, so only crafting those 23
 * (not the full 48) requires Ground Obsidian. This recursively scales each
 * item's gross quantity by its ancestors' deficit ratio (deficit / gross),
 * so the discount cascades down the recipe chain instead of applying
 * independently at every level. Results are left unrounded.
 */
export function computeAdjustedGross(
	aggregated: Map<string, StepEntry>,
	owned: Record<string, number>,
): Map<string, number> {
	const ratioCache = new Map<string, number>();
	const grossCache = new Map<string, number>();

	function adjustedGross(itemId: string): number {
		const cached = grossCache.get(itemId);
		if (cached !== undefined) return cached;
		// biome-ignore lint/style/noNonNullAssertion: <Aggregated is built from the same tree>
		const entry = aggregated.get(itemId)!;
		// Sum this item's own contribution through each distinct parent,
		// discounted by that parent's deficit ratio (1 for tracked root items,
		// which are never owned-tracked). Falls back to the raw total for the
		// edge case of a marked node with no recorded parent.
		const total =
			entry.parents.length === 0
				? entry.quantity
				: entry.parents.reduce(
						(sum, p) => sum + p.quantity * ratio(p.itemId),
						0,
					);
		grossCache.set(itemId, total);
		return total;
	}

	function ratio(itemId: string): number {
		const cached = ratioCache.get(itemId);
		if (cached !== undefined) return cached;
		if (!aggregated.has(itemId)) {
			// Root or other untracked ancestor: no deficit correction to apply.
			ratioCache.set(itemId, 1);
			return 1;
		}
		const gross = adjustedGross(itemId);
		const r = gross > 0 ? Math.max(0, gross - (owned[itemId] ?? 0)) / gross : 0;
		ratioCache.set(itemId, r);
		return r;
	}

	const adjustedMap = new Map<string, number>();
	for (const itemId of aggregated.keys()) {
		adjustedMap.set(itemId, adjustedGross(itemId));
	}
	return adjustedMap;
}

/**
 * Computes, per item, how much still needs to be fetched/crafted: the
 * ancestor-discounted gross (see computeAdjustedGross) minus the item's own
 * owned count. Items fully covered are omitted.
 */
export function computeRemainingQuantities(
	aggregated: Map<string, StepEntry>,
	owned: Record<string, number>,
): Map<string, number> {
	const remainingMap = new Map<string, number>();
	for (const [itemId, adjusted] of computeAdjustedGross(aggregated, owned)) {
		const remaining = adjusted - (owned[itemId] ?? 0);
		// Deficit-ratio scaling can land on a fraction of a raw material; round up
		// since you can't fetch a partial item.
		if (remaining > 0) remainingMap.set(itemId, Math.ceil(remaining));
	}
	return remainingMap;
}

/**
 * Flags parent relationships where not every tracked item that needs the
 * parent also has a marked step for this material. Marking stays fully
 * manual (auto-cascading isn't viable once a parent has multiple recipe
 * variants to choose between), so a parent's deficit ratio can be computed
 * from more tracked items than actually contributed to this item's own
 * raw total — the resulting quantity may undercount for that reason.
 */
export function computeCoverageWarnings(
	entry: StepEntry,
	aggregated: Map<string, StepEntry>,
): CoverageWarning[] {
	const warnings: CoverageWarning[] = [];
	for (const parent of entry.parents) {
		const parentEntry = aggregated.get(parent.itemId);
		if (!parentEntry) continue; // parent is a tracked root, not a material — no gap possible
		const missingRoots = parentEntry.usedFor.filter(
			(root) => !entry.usedFor.some((u) => u.itemId === root.itemId),
		);
		if (missingRoots.length > 0) {
			warnings.push({
				parentItemId: parent.itemId,
				parentName: parent.name,
				missingRoots,
			});
		}
	}
	return warnings;
}

export function buildSteps({
	filteredItemIds,
	allItems,
	multipliers,
	owned,
}: Params): StepEntry[] {
	const aggregated = new Map<string, StepEntry>();
	const recipeAccumulators = new Map<string, RecipeContributionAccumulator>();
	const neededAccumulators = new Map<string, NeededAccumulator>();

	for (const trackedItemId of filteredItemIds) {
		const multiplier = multipliers[trackedItemId] || 1;
		const trackedItem = sourceItemById(trackedItemId);
		if (!trackedItem) continue;

		// DONE only mirrors "owned stock covers this" (set when collecting), so
		// DONE nodes are walked too — whether a step is covered is decided by
		// owned stock alone, and a DONE parent still passes its deficit ratio
		// down to its children.
		const markedNodeIds = getMarkedNodeIds(allItems[trackedItemId], {
			includeDone: true,
		});
		if (!markedNodeIds) continue;

		const tree = resolveMaterialTree(trackedItemId, multiplier);

		// Root nodes are the tracked item itself (depth 0); its ingredients are at depth 1.
		// Parent for depth-1 materials is the tracked item.
		walkTree(
			tree,
			0,
			null,
			trackedItemId,
			trackedItem.name,
			trackedItem.image,
			markedNodeIds,
			aggregated,
			recipeAccumulators,
			neededAccumulators,
		);
	}

	const remainingMap = computeRemainingQuantities(aggregated, owned);

	const rootItemIds = new Set(filteredItemIds);

	const results: StepEntry[] = [];
	for (const entry of aggregated.values()) {
		// Items fully covered have no remainingMap entry — keep them as
		// covered steps so the list can still show them as completed.
		const remaining = remainingMap.get(entry.itemId) ?? 0;
		// A parent may itself be a tracked root item (e.g. this material is a
		// direct ingredient of the finished piece, not of an intermediate
		// material) — those never get their own aggregated/remainingMap entry
		// since they're never "marked" as a step, only crafted. Keep them with
		// the tracked quantity instead of dropping them from the parent list.
		const adjustedParents = entry.parents
			.filter((p) => remainingMap.has(p.itemId) || rootItemIds.has(p.itemId))
			.map((p) =>
				remainingMap.has(p.itemId)
					? // biome-ignore lint/style/noNonNullAssertion: <Remaining map is built from the same tree>
						{ ...p, quantity: remainingMap.get(p.itemId)! }
					: { ...p, quantity: multipliers[p.itemId] || 1 },
			);
		// Split the item's remaining (post owned-discount) quantity back across
		// each recipe that contributed to it, weighted by that recipe's share of
		// the gross total — exact when a single recipe produced the item (the
		// overwhelming common case), an approximation when it was reached via
		// more than one variant/recipe across the tree.
		const accumulator = recipeAccumulators.get(entry.itemId);
		const recipeContributions: StepRecipeContribution[] = accumulator
			? Array.from(accumulator.values()).map((contribution) => ({
					skills: contribution.skills,
					recipeQuantity: contribution.recipeQuantity,
					remainingQuantity:
						entry.quantity > 0
							? (contribution.grossQuantity / entry.quantity) * remaining
							: 0,
				}))
			: [];

		results.push({
			...entry,
			quantity: remaining,
			parents: adjustedParents,
			coverageWarnings: computeCoverageWarnings(entry, aggregated),
			recipeContributions,
			needed: computeNeeded(
				neededAccumulators.get(entry.itemId),
				entry.quantity,
				remaining,
			),
			covered: remaining === 0,
		});
	}

	return results.sort((a, b) => {
		// Deepest materials (most raw) first
		if (b.depth !== a.depth) return b.depth - a.depth;
		// Intermediate steps (have sub-ingredients) before leaves at same depth
		if (a.hasChildren !== b.hasChildren) return a.hasChildren ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
}
