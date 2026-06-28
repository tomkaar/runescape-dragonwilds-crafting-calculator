import { resolveCraftingTree } from "@/components/CraftingTree/resolve";
import {
  buildMaterialsTree,
  type MaterialTreeItem,
} from "@/components/Items/Materials/utils/buildMaterialsTree";
import { getItemById } from "@/utils/itemById";

type MarkedMaterial = {
  id: string;
  itemId: string;
  quantity: number;
  nodeId?: string;
  state: "TODO" | "DONE";
};

export type OwnedMaterialEntry = {
  itemId: string;
  name: string;
  wikiLink?: string;
  image: string | null;
  needed: number;
  nodeRefs: { trackedItemId: string; nodeId: string }[];
};

// Flattens the material tree into a list of (nodeId, quantity) tuples.
// Variant nodes (recipe alternates) are transparent — their children are
// promoted to the variant's depth so each real material is still included.
function flattenQuantities(
  nodes: MaterialTreeItem[],
): Array<{ nodeId: string; quantity: number }> {
  const result: Array<{ nodeId: string; quantity: number }> = [];
  for (const node of nodes) {
    if (node.variantNumber !== undefined) {
      if ("children" in node) {
        result.push(...flattenQuantities(node.children));
      }
      continue;
    }
    result.push({ nodeId: node.nodeId, quantity: node.quantity });
    if ("children" in node) {
      result.push(...flattenQuantities(node.children));
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

// Aggregates all marked materials across tracked items into per-material
// totals, regardless of their current TODO/DONE state — "needed" is the
// total quantity of that material across every recipe that references it.
export function buildOwnedMaterials({
  trackedItemIds,
  allItems,
  multipliers,
}: Params): OwnedMaterialEntry[] {
  const aggregated = new Map<string, OwnedMaterialEntry>();

  for (const trackedItemId of trackedItemIds) {
    const multiplier = multipliers[trackedItemId] || 1;

    // Resolve the live crafting tree scaled to the current multiplier
    const treeData = resolveCraftingTree({
      itemId: trackedItemId,
      prevQuantity: multiplier,
    });
    const tree = treeData
      ? buildMaterialsTree(treeData.nodes, treeData.edges)
      : [];

    const quantityMap = new Map(
      flattenQuantities(tree).map((n) => [n.nodeId, n.quantity]),
    );

    for (const entry of allItems[trackedItemId] || []) {
      if (!entry.nodeId) continue;
      const material = getItemById(entry.itemId);
      if (!material) continue;

      const quantity = quantityMap.get(entry.nodeId) ?? entry.quantity;

      const existing = aggregated.get(entry.itemId);
      if (existing) {
        existing.needed += quantity;
        existing.nodeRefs.push({ trackedItemId, nodeId: entry.nodeId });
      } else {
        aggregated.set(entry.itemId, {
          itemId: entry.itemId,
          name: material.name,
          wikiLink: material.wikiLink,
          image: material.image,
          needed: quantity,
          nodeRefs: [{ trackedItemId, nodeId: entry.nodeId }],
        });
      }
    }
  }

  return Array.from(aggregated.values());
}
