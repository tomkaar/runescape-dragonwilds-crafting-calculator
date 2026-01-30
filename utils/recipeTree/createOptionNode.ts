import { RecipeVariant } from "@/data/recipes";
import { Nodes, type OptionVariantNode, type FacilityNode } from "./type";
import { createMaterialNode } from "./createMaterialNode";
import { Edge } from "@xyflow/react";

export function createOptionNode(
  recipe: RecipeVariant,
  index = 0,
  quantity = 1,
) {
  const nodes: Nodes[] = [];
  const edges: Edge[] = [];

  const rootNode: OptionVariantNode = {
    id: recipe.id + "_o" + index,
    type: "option-variant",
    data: {
      facility: recipe.facility || undefined,
      optionNumber: index + 1,
    },
    position: { x: 0, y: 200 },
  };
  nodes.push(rootNode);

  // console.log("Creating option node for recipe variant:", recipe);

  // Create facility node
  const facilityNode: FacilityNode = {
    id: recipe.id + "_o" + index + "_facility",
    type: "facility",
    data: {
      facility: recipe.facility || undefined,
    },
    position: { x: 0, y: 300 },
  };
  nodes.push(facilityNode);

  // Connect facility node to option variant node
  edges.push({
    id: rootNode.id + "_" + facilityNode.id,
    source: rootNode.id,
    target: facilityNode.id,
  });

  recipe.materials?.forEach?.((material) => {
    const materialNodeGroup = createMaterialNode(
      facilityNode.id + "_m" + material.name,
      material,
      quantity,
    );
    // console.log("Created material node group:", materialNodeGroup);
    nodes.push(...materialNodeGroup.nodes);
    edges.push(...materialNodeGroup.edges);

    // connect material nodes to facility node
    edges.push({
      id: facilityNode.id + "_" + materialNodeGroup.nodes[0].id,
      source: facilityNode.id,
      target: materialNodeGroup.nodes[0].id,
    });
  });

  return { nodes, edges };
}
