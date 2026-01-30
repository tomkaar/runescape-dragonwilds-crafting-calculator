"use client";

import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";
import { X } from "lucide-react";
import {
  ReactFlow,
  useEdgesState,
  useNodesInitialized,
  useNodesState,
  useReactFlow,
  type Edge,
} from "@xyflow/react";

import { useModal } from "@/components/Modal";
import { resolveRecipeTree } from "@/utils/recipeTree/resolveRecipeTree";

import RootMaterialNode from "@/app/tree/[itemId]/RootMaterialNode";
import OptionVariantNode from "@/app/tree/[itemId]/OptionVariantNode";
import MaterialNode from "@/app/tree/[itemId]/MaterialNode";
import { getRecipeByNameOrId } from "@/utils/getRecipeByNameOrID";
import { useEffect } from "react";
import { Nodes } from "@/utils/recipeTree/type";
import FacilityNode from "@/app/tree/[itemId]/FacilityNode";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeTypes = {
  root: RootMaterialNode,
  "option-variant": OptionVariantNode,
  material: MaterialNode,
  facility: FacilityNode,
};

export default function Content({ materialName }: { materialName: string }) {
  const { dismiss } = useModal();

  const materialRecipe = getRecipeByNameOrId(materialName);

  const resolved = resolveRecipeTree(
    materialRecipe ? materialRecipe.id : materialName,
  );
  const [nodes, , onNodesChange] = useNodesState(resolved.nodes);
  const [edges, , onEdgesChange] = useEdgesState(resolved.edges);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row justify-between bg-neutral-800 w-full px-8 py-4">
        <h2 className="text-2xl font-bold first-letter:uppercase text-white">
          {materialRecipe ? materialRecipe.name : materialName}
        </h2>
        <button onClick={dismiss} className="text-white">
          <X />
        </button>
      </div>

      <div className="grow w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          // @ts-expect-error - types
          nodeTypes={nodeTypes}
        >
          <FlowContent />
        </ReactFlow>
      </div>
    </div>
  );
}

function FlowContent() {
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
