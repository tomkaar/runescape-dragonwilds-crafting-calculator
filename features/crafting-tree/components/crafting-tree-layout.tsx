"use client";

import { useNodesInitialized, useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

import type { Node } from "@/features/crafting-tree/schemas/Node";
import { getLayoutNodes } from "@/features/crafting-tree/utils/get-layout-nodes";
import { useCraftingTreeDirection } from "@/store/crafting-tree-direction";

type Props = {
	treePaddingLeft?: number;
};

/**
 * CraftingTreeLayout is a React component that manages the layout of nodes in a crafting tree.
 * It uses the useReactFlow hook to access the React Flow instance and its methods.
 * The component listens for changes in the nodes and edges, and when they are initialized,
 * it calculates the layout of the nodes based on the specified direction (top-to-bottom or left-to-right).
 * The layout is then applied to the nodes, and the view is adjusted to fit the entire crafting tree.
 */
export default function CraftingTreeLayout({ treePaddingLeft }: Props) {
	const { setNodes, getEdges, fitView } = useReactFlow<Node>();
	const nodesInitialized = useNodesInitialized();
	const { direction } = useCraftingTreeDirection();

	useEffect(() => {
		if (!nodesInitialized) return;

		const edges = getEdges();
		setNodes((nds) => getLayoutNodes(nds, edges, direction));
		fitView({
			padding: {
				top: "70px",
				left: `${treePaddingLeft ?? 20}px`,
				right: "20px",
				bottom: "20px",
			},
		});
	}, [
		nodesInitialized,
		getEdges,
		setNodes,
		fitView,
		direction,
		treePaddingLeft,
	]);

	return null;
}
