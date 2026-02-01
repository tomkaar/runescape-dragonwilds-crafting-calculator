"use client";

import "@xyflow/react/dist/style.css";

import { ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import { resolveCraftingTree } from "./resolveCraftingTree";

import RootNode from "./Nodes/RootNode";
import RecipeVariantNode from "./Nodes/RecipeVariantNode";
import MaterialNode from "./Nodes/MaterialNode";
import CraftingTreeContent from "./CraftingTreeContent";

const nodeTypes = {
  root: RootNode,
  recipeVariant: RecipeVariantNode,
  material: MaterialNode,
};

type Props = {
  itemId: string;
};

export function CraftingTree(props: Props) {
  const tree = resolveCraftingTree(props.itemId, 1);

  const [nodes, , onNodesChange] = useNodesState(tree?.nodes || []);
  const [edges, , onEdgesChange] = useEdgesState(tree?.edges || []);

  return (
    <div className="w-full h-full bg-neutral-900 text-black">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        draggable={false}
        fitView
        nodeTypes={nodeTypes}
      >
        <CraftingTreeContent />
      </ReactFlow>
    </div>
  );
}
