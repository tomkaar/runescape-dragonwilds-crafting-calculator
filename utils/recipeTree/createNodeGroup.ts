import { Edge } from "@xyflow/react";
import { getRecipeById } from "../getRecipeById";
import { createMaterialNode } from "./createMaterialNode";
import { createOptionNode } from "./createOptionNode";
import { Nodes, RootNode } from "./type";
import { getRecipeByName } from "../getRecipeByName";

export function createNodeGroup(
  recipe: ReturnType<typeof getRecipeById>,
  quantity = 1,
  hasTarget = false,
) {
  const nodes: Nodes[] = [];
  const edges: Edge[] = [];

  if (!recipe) return;

  console.log("Creating node group for recipe:", recipe);

  const rootNode: RootNode = {
    id: recipe.id,
    type: "root",
    data: {
      id: recipe.id,
      name: recipe.name,
      image: recipe.image,
      quantity,
      numberOfRecipes: recipe.recipes.length || 1,
      hasTarget,
    },
    position: { x: 0, y: 0 },
  };
  nodes.push(rootNode);

  const hasMultipleRecipes = recipe.recipes.length > 1;
  if (hasMultipleRecipes) {
    // for each recipe, create option nodes and connect directly to root
    recipe.recipes.forEach((rec, idx) => {
      const options = createOptionNode(rec, idx, quantity);
      nodes.push(...options.nodes);
      edges.push(...options.edges);

      // connect option-variant directly to root
      edges.push({
        id: rootNode.id + "_" + options.nodes[0].id,
        source: rootNode.id,
        target: options.nodes[0].id,
      });
    });
  } else {
    const firstRecipe = recipe.recipes[0];
    // console.log("Single recipe, no option node needed", firstRecipe);

    firstRecipe.materials?.forEach?.((material) => {
      const materialRecipe = getRecipeByName(material.name);
      const isRecipe = Boolean(materialRecipe);
      const materialQuantity = material.quantity || 1;
      // console.log("Material recipe for:", material.name, recipe);

      if (isRecipe) {
        const nodeGroup = createNodeGroup(
          materialRecipe,
          materialQuantity * quantity,
          true,
        );
        if (nodeGroup) {
          nodes.push(...nodeGroup.nodes);
          edges.push(...nodeGroup.edges);

          // connect material recipe root node to current root node
          edges.push({
            id: rootNode.id + "_" + nodeGroup.nodes[0].id,
            source: rootNode.id,
            target: nodeGroup.nodes[0].id,
          });
        }
      } else {
        const materialNodeGroup = createMaterialNode(
          rootNode.id + "m" + material.name,
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
      }
    });
  }

  return { nodes, edges };
}
