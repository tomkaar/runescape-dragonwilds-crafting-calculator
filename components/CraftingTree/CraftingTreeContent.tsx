"use client";

import {
  Edge,
  useNodesInitialized,
  useReactFlow,
  type Node as FlowNode,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { useEffect } from "react";
import { Node } from "./nodes";
import { useCraftingTreeDirection } from "@/store/crafting-tree-direction";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

export default function CraftingTreeContent() {
  const { setNodes, getEdges, fitView } = useReactFlow<FlowNode<Node>>();
  const nodesInitialized = useNodesInitialized();
  const { direction } = useCraftingTreeDirection();

  useEffect(() => {
    if (!nodesInitialized) return;

    const edges = getEdges();
    setNodes((nds) => getLayoutedNodes(nds, edges, direction));
    fitView({
      padding: { top: "70px", left: "20px", right: "20px", bottom: "20px" },
    });
  }, [nodesInitialized, getEdges, setNodes, fitView, direction]);

  return null;
}

export function getLayoutedNodes(
  nodes: FlowNode<Node>[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB",
): FlowNode<Node>[] {
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 12,
    ranksep: 40,
  });

  nodes.forEach((node) => {
    const width = node.measured?.width ?? 172;
    const height = node.measured?.height ?? 36;

    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);

    const width = node.measured?.width ?? 172;
    const height = node.measured?.height ?? 36;

    return {
      ...node,
      position: {
        x: x - width / 2,
        y: y - height / 2,
      },
      sourcePosition: direction === "TB" ? "bottom" : "right",
      targetPosition: direction === "TB" ? "top" : "left",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any[];
}
