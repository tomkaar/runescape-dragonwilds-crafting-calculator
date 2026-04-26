import { resolveCraftingTree } from "@/components/CraftingTree/resolve";
import {
  buildMaterialsTree,
  type MaterialTreeItem,
} from "@/components/Items/Materials/utils/buildMaterialsTree";
import { getItemById } from "@/utils/itemById";

import { type MarkedMaterial } from "./types";

export type SummaryEntry = {
  itemId: string;
  name: string;
  image: string | null;
  todoQty: number;
  doneQty: number;
  maxDepth: number;
};

// Flattens the material tree into a list of (nodeId, itemId, depth, quantity) tuples.
// Variant nodes (recipe alternates) are transparent — their children are promoted
// to the variant's depth so each real material appears at the correct level.
function flattenWithDepth(
  nodes: MaterialTreeItem[],
  depth = 0,
): Array<{ nodeId: string; itemId: string; depth: number; quantity: number }> {
  const result: Array<{
    nodeId: string;
    itemId: string;
    depth: number;
    quantity: number;
  }> = [];
  for (const node of nodes) {
    if (node.variantNumber !== undefined) {
      if ("children" in node) {
        result.push(...flattenWithDepth(node.children, depth));
      }
      continue;
    }
    result.push({ nodeId: node.nodeId, itemId: node.id, depth, quantity: node.quantity });
    if ("children" in node) {
      result.push(...flattenWithDepth(node.children, depth + 1));
    }
  }
  return result;
}

type Params = {
  trackedItemIds: string[];
  // All marked material entries from the store, keyed by tracked item id
  allItems: Record<string, MarkedMaterial[]>;
  multipliers: Record<string, number>;
};

type SummaryResult = {
  todoEntries: SummaryEntry[];
  doneEntries: SummaryEntry[];
};

// Aggregates all marked materials across tracked items into per-material totals.
// Quantities come from the live tree (scaled to the current multiplier) rather
// than the store, so they stay accurate when the multiplier changes.
// A single material can appear in both todoEntries and doneEntries when it has
// been partially completed across different tracked items.
export function buildSummary({
  trackedItemIds,
  allItems,
  multipliers,
}: Params): SummaryResult {
  const aggregated = new Map<string, SummaryEntry>();

  for (const itemId of trackedItemIds) {
    const multiplier = multipliers[itemId] || 1;

    // Resolve the live crafting tree scaled to the current multiplier
    const treeData = resolveCraftingTree({ itemId, prevQuantity: multiplier });
    const tree = treeData ? buildMaterialsTree(treeData.nodes, treeData.edges) : [];

    // Flatten the tree and index each node's live quantity and depth by nodeId
    const flatNodes = flattenWithDepth(tree);
    const depthMap = new Map(flatNodes.map((n) => [n.nodeId, n.depth]));
    const quantityMap = new Map(flatNodes.map((n) => [n.nodeId, n.quantity]));

    // Merge each marked entry into the aggregated map, accumulating todo/done totals
    for (const entry of allItems[itemId] || []) {
      if (!entry.nodeId) continue;
      const material = getItemById(entry.itemId);
      if (!material) continue;

      const depth = depthMap.get(entry.nodeId) ?? 0;
      const quantity = quantityMap.get(entry.nodeId) ?? entry.quantity;

      const existing = aggregated.get(entry.itemId);
      if (existing) {
        if (entry.state === "TODO") existing.todoQty += quantity;
        else existing.doneQty += quantity;
        existing.maxDepth = Math.max(existing.maxDepth, depth);
      } else {
        aggregated.set(entry.itemId, {
          itemId: entry.itemId,
          name: material.name,
          image: material.image,
          todoQty: entry.state === "TODO" ? quantity : 0,
          doneQty: entry.state === "DONE" ? quantity : 0,
          maxDepth: depth,
        });
      }
    }
  }

  const allEntries = Array.from(aggregated.values());

  // Sort deepest nodes (raw materials) first — they're the most immediately obtainable
  const todoEntries = allEntries
    .filter((e) => e.todoQty > 0)
    .sort((a, b) => b.maxDepth - a.maxDepth);
  const doneEntries = allEntries
    .filter((e) => e.doneQty > 0)
    .sort((a, b) => b.maxDepth - a.maxDepth);

  return { todoEntries, doneEntries };
}
