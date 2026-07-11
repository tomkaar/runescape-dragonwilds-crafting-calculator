import { Edge, Position } from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { type Node } from "@/features/crafting-tree/schemas/Node";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

/**
 * Gets the layouted nodes for the crafting tree.
 */
export function getLayoutNodes(
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB",
): Node[] {
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
      sourcePosition: direction === "TB" ? Position.Bottom : Position.Right,
      targetPosition: direction === "TB" ? Position.Top : Position.Left,
    };
  })
}
