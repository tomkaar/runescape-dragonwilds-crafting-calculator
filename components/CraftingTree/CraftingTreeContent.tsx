"use client";

import { Edge, useNodesInitialized, useReactFlow } from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { Nodes } from "./types";
import { useEffect } from "react";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

export default function CraftingTreeContent() {
  const { setNodes, getEdges, fitView } = useReactFlow<Nodes>();
  const nodesInitialized = useNodesInitialized();

  useEffect(() => {
    if (!nodesInitialized) return;

    const edges = getEdges();
    setNodes((nds) => getLayoutedNodes(nds, edges));
    fitView();
  }, [nodesInitialized, getEdges, setNodes, fitView]);

  return null;
}

export function getLayoutedNodes(nodes: Nodes[], edges: Edge[]): Nodes[] {
  dagreGraph.setGraph({
    rankdir: "TB",
    nodesep: 12,
    ranksep: 20,
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
      sourcePosition: "bottom",
      targetPosition: "top",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any[];
}
