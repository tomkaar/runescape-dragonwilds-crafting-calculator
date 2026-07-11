"use client"

import { resolveMaterialsTree } from "@/features/materials-tree/utils/resolve-materials-tree";
import { type MaterialTreeItem } from "@/features/materials-tree/types/material-tree";
import { MaterialTreeNode } from "./MaterialTreeNode";
import { useMaterialMultiplier } from "@/store/material-multiplier";

type Props = {
  itemId: string;
  skipFirstLayer?: boolean;
};

function buildBaseQuantityMap(
  nodes: MaterialTreeItem[],
  map: Map<string, number> = new Map(),
): Map<string, number> {
  for (const node of nodes) {
    map.set(node.nodeId, node.quantity);
    if ("children" in node) buildBaseQuantityMap(node.children, map);
  }
  return map;
}

export function RequiredMaterialsContent({ itemId, skipFirstLayer = false }: Props) {
  const multipliers = useMaterialMultiplier((state) => state.items);
  const multiplier = multipliers[itemId] || 1;
  const tree = resolveMaterialsTree(itemId, multiplier);
  const baseTree = resolveMaterialsTree(itemId);
  const baseQuantities = buildBaseQuantityMap(baseTree);

  const nodes = skipFirstLayer
    ? tree.flatMap((root) => ("children" in root ? root.children : []))
    : tree;

  return (
    <div className="">
      {nodes.map((item) => (
        <MaterialTreeNode
          key={item.nodeId}
          item={item}
          initialItemId={itemId}
          baseQuantities={baseQuantities}
        />
      ))}
    </div>
  );
}
