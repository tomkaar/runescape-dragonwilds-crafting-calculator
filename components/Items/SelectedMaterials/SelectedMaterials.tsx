"use client";

import { useSelectedMaterial } from "@/store/selected-material";

import { buildTreeFromNodeIds } from "./buildTreeFromNodeIds";
import { RenderBuildTree } from "./RenderBuildTree";

type Props = {
  itemId: string;
};

export function SelectedMaterial(props: Props) {
  const { itemId } = props;

  const removeMaterial = useSelectedMaterial(
    (state) => state.removeAnItemByNodeId,
  );
  const handleRemoveMaterial = (id: string) => {
    removeMaterial(itemId, id);
  };

  const i = useSelectedMaterial((state) => state.items);
  const selectedMaterials = i[props.itemId] || [];

  const tree = buildTreeFromNodeIds(selectedMaterials);

  return (
    <div>
      <div>
        <h3 className="text-lg">Selected materials</h3>
        <p className="text-sm">Click on a material to add it to the list</p>

        <RenderBuildTree tree={tree} handleRemoveNode={handleRemoveMaterial} />
      </div>
    </div>
  );
}
