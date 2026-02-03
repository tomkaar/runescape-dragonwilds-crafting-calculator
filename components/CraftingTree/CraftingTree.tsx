"use client";

import "@xyflow/react/dist/style.css";

import { ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import { resolveCraftingTree } from "@/playground/resolve-tree/resolve";

import CraftingTreeContent from "./CraftingTreeContent";
import DefaultlNode from "./Nodes/DefaultNode";

const nodeTypes = {
  node: DefaultlNode,
};

type Props = {
  itemId: string;
};

export function CraftingTree(props: Props) {
  const anotherTree = resolveCraftingTree({ itemId: props.itemId });

  const [nodes, , onNodesChange] = useNodesState(anotherTree?.nodes || []);
  const [edges, , onEdgesChange] = useEdgesState(anotherTree?.edges || []);

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
