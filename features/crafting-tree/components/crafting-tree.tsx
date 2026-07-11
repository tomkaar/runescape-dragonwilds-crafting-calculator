"use client";

import "@xyflow/react/dist/style.css";

import { ReactNode } from "react";
import { EdgeTypes, NodeTypes, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";

import { resolveCraftingTree } from "@/features/crafting-tree/utils/resolve-crafting-tree";

import CraftingTreeLayout from "./crafting-tree-layout";
import DefaultNode from "@/features/crafting-tree/components/nodes/default-node";
import DefaultEdge from "@/features/crafting-tree/components/edges/default-edge";
import { cn } from "@/lib/utils";
import { type Node } from "@/features/crafting-tree/schemas/Node";
import { Edge } from "@/features/crafting-tree/schemas/Edge";

const nodeTypes: NodeTypes = {
  node: DefaultNode,
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

/**
 * Renders a crafting tree for the given item ID.
 * The crafting tree is generated based on the item's crafting requirements
 * and displays the necessary nodes and edges.
 */
export function CraftingTree(props: Props) {
  const { itemId, className, children, treePaddingLeft } = props;

  const craftingTree = resolveCraftingTree({ itemId: itemId });

  const [nodes, , onNodesChange] = useNodesState<Node>(craftingTree?.nodes || []);
  const [edges, , onEdgesChange] = useEdgesState<Edge>(craftingTree?.edges || []);

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
        <CraftingTreeLayout treePaddingLeft={treePaddingLeft} />
      </ReactFlow>
    </div>
  );
}
