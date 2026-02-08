"use client";

import { useSelectedMaterial } from "@/store/selected-material";

import { buildTreeFromNodeIds } from "./utils/buildTreeFromNodeIds";
import { RenderBuildTree } from "./components/RenderBuildTree";
import { useMaterialMultiplier } from "@/store/material-multiplier";

type Props = {
  itemId: string;
};

export function SelectedMaterialContent(props: Props) {
  const { itemId } = props;

  const multipliers = useMaterialMultiplier((state) => state.items);
  const multiplier = multipliers[itemId] || 1;

  const markAsDone = useSelectedMaterial((state) => state.markAsDoneByNodeId);
  const handleSetAsDone = (id: string) => {
    markAsDone(itemId, id);
  };

  const i = useSelectedMaterial((state) => state.items);
  const selectedMaterials = (i[props.itemId] || []).filter(
    (item) => item.state === "TODO",
  );

  const tree = buildTreeFromNodeIds(selectedMaterials);

  return (
    <div className="px-4">
      {tree.length === 0 ? (
        <div className="py-2 max-w-80">
          <span className="text-sm text-neutral-200">
            No selected materials to show, click on a material in the crafting
            tree or in the list to add materials.
          </span>
        </div>
      ) : null}
      {multiplier > 0 ? (
        <div className="mt-2">
          <RenderBuildTree
            tree={tree}
            handleSetAsDone={handleSetAsDone}
            multiplier={multiplier}
          />
        </div>
      ) : null}
    </div>
  );
}
