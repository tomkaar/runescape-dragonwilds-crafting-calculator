"use client";

import { Edge, ReactFlow } from "@xyflow/react";
import dagre from "@dagrejs/dagre";

import { resolveRecipeTree } from "@/utils/recipeTree/resolveRecipeTree";
import { Nodes } from "@/utils/recipeTree/type";
import RootMaterialNode from "./RootMaterialNode";
import OptionVariantNode from "./OptionVariantNode";
import MaterialNode from "./MaterialNode";

const nodeWidth = 36;
const nodeHeight = 36;

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (
  nodes: Nodes[],
  edges: Edge[],
  direction = "TB",
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

const nodeTypes = {
  root: RootMaterialNode,
  "option-variant": OptionVariantNode,
  material: MaterialNode,
};

export default function Content({ materialName }: { materialName: string }) {
  if (!window) return null;

  const resolved = resolveRecipeTree(materialName);

  const { nodes: initialNodes, edges: initialEdges } = resolved;

  const { nodes, edges } = getLayoutedElements(initialNodes, initialEdges);

  return (
    <div>
      <div className="w-full h-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          draggable={false}
          fitView
          nodeTypes={nodeTypes}
        />
      </div>
    </div>
  );
}
