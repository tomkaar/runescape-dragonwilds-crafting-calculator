import { resolveCraftingTree } from "@/components/CraftingTree/resolve";
import { buildMaterialsTree } from "./utils/buildMaterialsTree";
import { MaterialTreeNode } from "./components/MaterialTreeNode";

type Props = {
  itemId: string;
};

export function RequiredMaterialsContent({ itemId }: Props) {
  const treeData = resolveCraftingTree({ itemId });
  const tree = treeData
    ? buildMaterialsTree(treeData.nodes, treeData.edges)
    : [];

  return (
    <div className="px-4">
      {tree.map((item) => (
        <MaterialTreeNode
          key={item.nodeId}
          item={item}
          initialItemId={itemId}
        />
      ))}
    </div>
  );
}
