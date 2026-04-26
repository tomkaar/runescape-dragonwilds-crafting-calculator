import { resolveCraftingTree } from "@/components/CraftingTree/resolve";
import {
  buildMaterialsTree,
  type MaterialTreeItem,
} from "@/components/Items/Materials/utils/buildMaterialsTree";
import { getItemById } from "@/utils/itemById";
import {
  type MarkedMaterial,
  type ParentInfo,
  type StepCandidate,
  type StepEntry,
} from "./types";

// Recursively walks the material tree, recording each node's immediate parent.
// Variant nodes (recipe alternates) are transparent — their children are
// promoted to the variant's parent so they appear at the correct depth.
function collectNodes(
  nodes: MaterialTreeItem[],
  parent: ParentInfo | null,
  depth = 0,
): StepCandidate[] {
  const result: StepCandidate[] = [];
  for (const node of nodes) {
    if (node.variantNumber !== undefined) {
      if ("children" in node) {
        result.push(...collectNodes(node.children, parent, depth));
      }
      continue;
    }
    result.push({
      nodeId: node.nodeId,
      itemId: node.id,
      quantity: node.quantity,
      depth,
      parent,
    });
    if ("children" in node) {
      result.push(
        ...collectNodes(
          node.children,
          {
            itemId: node.id,
            name: node.item.name,
            image: node.item.image ?? null,
            quantity: node.quantity,
          },
          depth + 1,
        ),
      );
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

export function buildSteps({
  trackedItemIds,
  allItems,
  multipliers,
}: Params): StepEntry[] {
  const steps: StepEntry[] = [];

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

    // Build a flat list of all tree nodes with parent context, then index by nodeId
    const candidates = collectNodes(tree, null, 0);
    const nodeMap = new Map(candidates.map((c) => [c.nodeId, c]));

    // Match each marked store entry to its tree candidate to get live quantity and depth.
    // Skip entries without a parent — top-level nodes have no "for X I need Y" sentence.
    for (const entry of allItems[trackedItemId] || []) {
      if (!entry.nodeId) continue;
      const candidate = nodeMap.get(entry.nodeId);
      if (!candidate || !candidate.parent) continue;
      const material = getItemById(entry.itemId);
      if (!material) continue;

      steps.push({
        trackedItemId,
        nodeId: entry.nodeId,
        itemId: entry.itemId,
        name: material.name,
        image: material.image,
        quantity: candidate.quantity,
        state: entry.state,
        depth: candidate.depth,
        parent: candidate.parent,
      });
    }
  }

  return steps;
}
