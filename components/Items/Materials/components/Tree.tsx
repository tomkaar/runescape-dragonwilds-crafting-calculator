import { resolveCraftingTree } from "@/components/CraftingTree/resolve";
import { buildMaterialsTree, type MaterialTreeItem } from "../utils/buildMaterialsTree";
import { MaterialTreeNode } from "./MaterialTreeNode";
import { useMaterialMultiplier } from "@/store/material-multiplier";

type Props = {
  itemId: string;
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

export function RequiredMaterialsContent({ itemId }: Props) {
  const multipliers = useMaterialMultiplier((state) => state.items);
  const multiplier = multipliers[itemId] || 1;
  const treeData = resolveCraftingTree({ itemId, prevQuantity: multiplier });
  const baseTreeData = resolveCraftingTree({ itemId });
  const tree = treeData
    ? buildMaterialsTree(treeData.nodes, treeData.edges)
    : [];
  const baseTree = baseTreeData
    ? buildMaterialsTree(baseTreeData.nodes, baseTreeData.edges)
    : [];
  const baseQuantities = buildBaseQuantityMap(baseTree);

  return (
    <div className="">
      {tree.map((item) => (
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
