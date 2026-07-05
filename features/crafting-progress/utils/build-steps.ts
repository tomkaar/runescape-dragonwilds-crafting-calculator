import { resolveMaterialsTree } from "@/features/materials-tree/utils/resolve-materials-tree";
import { type MaterialTreeItem } from "@/features/materials-tree/types/material-tree";
import { sourceItemById } from "@/utils/source-item-by-id";

type MarkedMaterial = {
  id: string;
  itemId: string;
  quantity: number;
  nodeId?: string;
  state: "TODO" | "DONE";
};

export type StepParent = {
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
};

type Params = {
  filteredItemIds: string[];
  allItems: Record<string, MarkedMaterial[]>;
  multipliers: Record<string, number>;
  owned: Record<string, number>;
};

function walkTree(
  nodes: MaterialTreeItem[],
  depth: number,
  parent: StepParent | null,
  trackedItemId: string,
  trackedItemName: string,
  trackedItemImage: string | null,
  markedNodeIds: Set<string>,
  aggregated: Map<string, StepEntry>,
) {
  for (const node of nodes) {
    // Variant nodes are transparent — skip but still recurse with the same parent/depth
    if (node.variantNumber !== undefined) {
      if ("children" in node) {
        walkTree(node.children, depth, parent, trackedItemId, trackedItemName, trackedItemImage, markedNodeIds, aggregated);
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
          existing.usedFor.push({ itemId: trackedItemId, name: trackedItemName, image: trackedItemImage });
        }
        if (depth > existing.depth) existing.depth = depth;
        if (hasChildren) existing.hasChildren = true;
      } else {
        aggregated.set(node.id, {
          itemId: node.id,
          name: node.item.name,
          image: node.item.image,
          wikiLink: node.item.wikiLink,
          quantity: node.quantity,
          parents: parent ? [{ ...parent, quantity: node.quantity }] : [],
          usedFor: [{ itemId: trackedItemId, name: trackedItemName, image: trackedItemImage }],
          depth,
          hasChildren,
          coverageWarnings: [],
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
      );
    }
  }
}

// Computes, per item, how much still needs to be fetched/crafted.
//
// A flat `grossTotal - owned` per item is wrong once an item's parent is
// itself partly covered by owned stock: e.g. owning 25 of the 48 Refined
// Obsidian needed means only 23 must actually be crafted, so only crafting
// those 23 (not the full 48) requires Ground Obsidian. This recursively
// scales each item's gross quantity by its ancestors' deficit ratio
// (deficit / gross) before subtracting the item's own owned count, so the
// discount cascades down the recipe chain instead of applying independently
// at every level.
export function computeRemainingQuantities(
  aggregated: Map<string, StepEntry>,
  owned: Record<string, number>,
): Map<string, number> {
  const ratioCache = new Map<string, number>();
  const grossCache = new Map<string, number>();

  function adjustedGross(itemId: string): number {
    const cached = grossCache.get(itemId);
    if (cached !== undefined) return cached;
    const entry = aggregated.get(itemId)!;
    // Sum this item's own contribution through each distinct parent,
    // discounted by that parent's deficit ratio (1 for tracked root items,
    // which are never owned-tracked). Falls back to the raw total for the
    // edge case of a marked node with no recorded parent.
    const total = entry.parents.length === 0
      ? entry.quantity
      : entry.parents.reduce((sum, p) => sum + p.quantity * ratio(p.itemId), 0);
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

  const remainingMap = new Map<string, number>();
  for (const itemId of aggregated.keys()) {
    const remaining = adjustedGross(itemId) - (owned[itemId] ?? 0);
    // Deficit-ratio scaling can land on a fraction of a raw material; round up
    // since you can't fetch a partial item.
    if (remaining > 0) remainingMap.set(itemId, Math.ceil(remaining));
  }
  return remainingMap;
}

// Flags parent relationships where not every tracked item that needs the
// parent also has a marked step for this material. Marking stays fully
// manual (auto-cascading isn't viable once a parent has multiple recipe
// variants to choose between), so a parent's deficit ratio can be computed
// from more tracked items than actually contributed to this item's own
// raw total — the resulting quantity may undercount for that reason.
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
      warnings.push({ parentItemId: parent.itemId, parentName: parent.name, missingRoots });
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

  for (const trackedItemId of filteredItemIds) {
    const multiplier = multipliers[trackedItemId] || 1;
    const trackedItem = sourceItemById(trackedItemId);
    if (!trackedItem) continue;

    const markedTodo = (allItems[trackedItemId] || []).filter(
      (m) => m.state === "TODO" && m.nodeId,
    );
    if (markedTodo.length === 0) continue;

    const markedNodeIds = new Set(markedTodo.map((m) => m.nodeId!));

    const tree = resolveMaterialsTree(trackedItemId, multiplier);

    // Root nodes are the tracked item itself (depth 0); its ingredients are at depth 1.
    // Parent for depth-1 materials is the tracked item.
    walkTree(tree, 0, null, trackedItemId, trackedItem.name, trackedItem.image, markedNodeIds, aggregated);
  }

  const remainingMap = computeRemainingQuantities(aggregated, owned);

  const results: StepEntry[] = [];
  for (const entry of aggregated.values()) {
    const remaining = remainingMap.get(entry.itemId);
    if (remaining === undefined) continue;
    const adjustedParents = entry.parents
      .filter((p) => remainingMap.has(p.itemId))
      .map((p) => ({ ...p, quantity: remainingMap.get(p.itemId)! }));
    results.push({
      ...entry,
      quantity: remaining,
      parents: adjustedParents,
      coverageWarnings: computeCoverageWarnings(entry, aggregated),
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
