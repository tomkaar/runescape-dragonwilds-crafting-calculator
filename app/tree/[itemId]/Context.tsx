"use client";

import { ReactFlow } from "@xyflow/react";

import { resolveRecipeTree } from "@/utils/recipeTree/resolveRecipeTree";
import RootMaterialNode from "./RootMaterialNode";
import OptionVariantNode from "./OptionVariantNode";
import MaterialNode from "./MaterialNode";
import FacilityNode from "./FacilityNode";
import { getLayoutedElements } from "@/utils/recipeTree/getLayoutedElements";

const nodeTypes = {
  root: RootMaterialNode,
  "option-variant": OptionVariantNode,
  material: MaterialNode,
  facility: FacilityNode,
};

export default function Content({ materialName }: { materialName: string }) {
  if (!window) return null;

  const resolved = resolveRecipeTree(materialName);

  const { nodes: initialNodes, edges: initialEdges } = resolved;

  const { nodes, edges } = getLayoutedElements(initialNodes, initialEdges);

  return (
    <div>
      <div className="w-full h-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          draggable={false}
          fitView
          nodeTypes={nodeTypes}
        />
      </div>
    </div>
  );
}
