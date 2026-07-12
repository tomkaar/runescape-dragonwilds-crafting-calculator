"use client";

import "@xyflow/react/dist/style.css";

import {
	type EdgeTypes,
	type NodeTypes,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import type { ReactNode } from "react";
import DefaultEdge from "@/features/crafting-tree/components/edges/default-edge";
import MaterialNode from "@/features/crafting-tree/components/nodes/material-node";
import RecipeGroupNode from "@/features/crafting-tree/components/nodes/recipe-group-node";
import type { Edge } from "@/features/crafting-tree/schemas/Edge";
import type { Node } from "@/features/crafting-tree/schemas/Node";
import { resolveCraftingTree } from "@/features/crafting-tree/utils/resolve-crafting-tree";
import { cn } from "@/lib/utils";
import CraftingTreeLayout from "./crafting-tree-layout";

const nodeTypes: NodeTypes = {
	"recipe-group": RecipeGroupNode,
	material: MaterialNode,
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

	const [nodes, , onNodesChange] = useNodesState<Node>(
		craftingTree?.nodes || [],
	);
	const [edges, , onEdgesChange] = useEdgesState<Edge>(
		craftingTree?.edges || [],
	);

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
