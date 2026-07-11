"use client";

import "@xyflow/react/dist/style.css";

import { EdgeTypes, NodeTypes, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";

import { resolveCraftingTree } from "@/features/crafting-tree/utils/resolve-crafting-tree";

import CraftingTreeContent from "./CraftingTreeContent";
import DefaultlNode from "./Nodes/DefaultNode";
import DefaultEdge from "./Edges/DefaultEdge";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { type Node } from "@/features/crafting-tree/schemas/Node";
import { Edge } from "@/features/crafting-tree/schemas/Edge";

const nodeTypes: NodeTypes = {
  node: DefaultlNode,
};
const edgeTypes: EdgeTypes = {
  edge: DefaultEdge,
};

type Props = {
  itemId: string;
  className?: string;
  children?: ReactNode;
  treePaddingLeft?: number;
};

export function CraftingTree(props: Props) {
  const { itemId, className, children, treePaddingLeft } = props;

  const anotherTree = resolveCraftingTree({ itemId: itemId });

  const [nodes, , onNodesChange] = useNodesState<Node>(anotherTree?.nodes || []);
  const [edges, , onEdgesChange] = useEdgesState<Edge>(anotherTree?.edges || []);

  return (
    <div
      className={cn(
        "w-full h-full bg-card text-black pattern-square",
        className,
      )}
    >
      <ReactFlow<Node, Edge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        draggable={false}
        maxZoom={1.75}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        {children}
        <CraftingTreeContent treePaddingLeft={treePaddingLeft} />
      </ReactFlow>
    </div>
  );
}
