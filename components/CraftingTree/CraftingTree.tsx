"use client";

import "@xyflow/react/dist/style.css";

import { ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";

import { resolveCraftingTree } from "./resolve";

import CraftingTreeContent from "./CraftingTreeContent";
import DefaultlNode from "./Nodes/DefaultNode";
import DefaultEdge from "./Edges/DefaultEdge";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const nodeTypes = {
  node: DefaultlNode,
};
const edgeTypes = {
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

  const [nodes, , onNodesChange] = useNodesState(anotherTree?.nodes || []);
  const [edges, , onEdgesChange] = useEdgesState(anotherTree?.edges || []);

  return (
    <div
      className={cn(
        "w-full h-full bg-card text-black pattern-square",
        className,
      )}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        draggable={false}
        maxZoom={1.75}
        // @ts-expect-error - invalid types
        nodeTypes={nodeTypes}
        // @ts-expect-error - invalid types
        edgeTypes={edgeTypes}
      >
        {children}
        <CraftingTreeContent treePaddingLeft={treePaddingLeft} />
      </ReactFlow>
    </div>
  );
}
