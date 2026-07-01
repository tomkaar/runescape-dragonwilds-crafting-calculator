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

export type StepParent = {
  itemId: string;
  name: string;
  quantity: number;
  image: string | null;
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
          if (existingParent) {
            existingParent.quantity += parent.quantity;
          } else {
            existing.parents.push({ ...parent });
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
          parents: parent ? [{ ...parent }] : [],
          usedFor: [{ itemId: trackedItemId, name: trackedItemName, image: trackedItemImage }],
          depth,
          hasChildren,
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

export function buildSteps({
  filteredItemIds,
  allItems,
  multipliers,
  owned,
}: Params): StepEntry[] {
  const aggregated = new Map<string, StepEntry>();

  for (const trackedItemId of filteredItemIds) {
    const multiplier = multipliers[trackedItemId] || 1;
    const trackedItem = getItemById(trackedItemId);
    if (!trackedItem) continue;

    const markedTodo = (allItems[trackedItemId] || []).filter(
      (m) => m.state === "TODO" && m.nodeId,
    );
    if (markedTodo.length === 0) continue;

    const markedNodeIds = new Set(markedTodo.map((m) => m.nodeId!));

    const treeData = resolveCraftingTree({
      itemId: trackedItemId,
      prevQuantity: multiplier,
    });
    const tree = treeData
      ? buildMaterialsTree(treeData.nodes, treeData.edges)
      : [];

    // Root nodes are the tracked item itself (depth 0); its ingredients are at depth 1.
    // Parent for depth-1 materials is the tracked item.
    walkTree(tree, 0, null, trackedItemId, trackedItem.name, trackedItem.image, markedNodeIds, aggregated);
  }

  const remainingMap = new Map<string, number>();
  for (const entry of aggregated.values()) {
    const remaining = entry.quantity - (owned[entry.itemId] ?? 0);
    if (remaining > 0) remainingMap.set(entry.itemId, remaining);
  }

  const results: StepEntry[] = [];
  for (const entry of aggregated.values()) {
    const remaining = remainingMap.get(entry.itemId);
    if (remaining === undefined) continue;
    const adjustedParents = entry.parents
      .filter((p) => remainingMap.has(p.itemId))
      .map((p) => ({ ...p, quantity: remainingMap.get(p.itemId)! }));
    results.push({ ...entry, quantity: remaining, parents: adjustedParents });
  }

  return results.sort((a, b) => {
    // Deepest materials (most raw) first
    if (b.depth !== a.depth) return b.depth - a.depth;
    // Intermediate steps (have sub-ingredients) before leaves at same depth
    if (a.hasChildren !== b.hasChildren) return a.hasChildren ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}
