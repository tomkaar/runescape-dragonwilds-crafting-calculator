import { RecipeVariant } from "@/data/recipes";
import { Nodes, type OptionVariantNode } from "./type";
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
      facility: recipe.facility || "None",
      optionNumber: index + 1,
    },
    position: { x: 0, y: 200 },
  };
  nodes.push(rootNode);

  // console.log("Creating option node for recipe variant:", recipe);

  recipe.materials?.forEach?.((material) => {
    const materialNodeGroup = createMaterialNode(
      rootNode.id + "_m" + material.name,
      material,
      quantity,
    );
    // console.log("Created material node group:", materialNodeGroup);
    nodes.push(...materialNodeGroup.nodes);
    edges.push(...materialNodeGroup.edges);

    // connect material nodes to option variant node
    edges.push({
      id: rootNode.id + "_" + materialNodeGroup.nodes[0].id,
      source: rootNode.id,
      target: materialNodeGroup.nodes[0].id,
    });
  });

  return { nodes, edges };
}
