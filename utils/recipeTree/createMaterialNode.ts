import { RecipeMaterial } from "@/scripts/utils/types";
import { MaterialNode, Nodes } from "./type";
import { Edge } from "@xyflow/react";

export function createMaterialNode(
  previousNodeId: string,
  material: RecipeMaterial,
  quantity: number,
) {
  const nodes: Nodes[] = [];
  const edges: Edge[] = [];

  const materialNodeId = previousNodeId;
  const materialNode: MaterialNode = {
    id: materialNodeId,
    type: "material",
    data: {
      name: material.name,
      quantity: material.quantity! * quantity,
      image: material.image,
    },
    position: { x: 0, y: 0 },
  };
  nodes.push(materialNode);

  return { nodes, edges };
}
