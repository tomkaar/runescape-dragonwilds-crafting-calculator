import { getItemByNameOrId } from "@/utils/getItemById";
import { MaterialNode, Nodes, RecipeVariantNode, RootNode } from "./types";
import { Edge } from "@xyflow/react";

/**
 * Resolve an item and all its dependencies recursively.
 * Will return null if item is not found.
 * Will return a tree structure representing the crafting tree.
 */
export function resolveCraftingTree(
  initialItemId: string,
  itemId: string,
  quantity = 1,
  start = true,
  parentNodeId: string | null = null,
) {
  const item = getItemByNameOrId(itemId);
  if (item === undefined) return null;

  const nodes: Nodes[] = [];
  const edges: Edge[] = [];

  const hasMultipleVariants = item.variants.length > 1;

  // Build the node ID with parent prefix if provided
  const nodeId = parentNodeId ? `${parentNodeId}_${item.id}` : item.id;

  const rootNode: RootNode = {
    type: "root",
    id: nodeId,
    data: {
      initialItemId: initialItemId,
      name: item.name,
      label: item.name,
      id: item.id,
      image: item.image || null,
      quantity,
      facility: hasMultipleVariants
        ? null
        : item.variants[0]?.recipe?.facility || null,
      numberOfRecipes: item.variants.length,
      start,
    },
    position: { x: 0, y: 0 },
  };
  nodes.push(rootNode);

  if (hasMultipleVariants) {
    item.variants.forEach((variant) => {
      const variantNode: RecipeVariantNode = {
        type: "recipeVariant",
        id: nodeId + "_" + variant.id,
        data: {
          initialItemId: initialItemId,
          id: variant.id,
          name: variant.name,
          label: variant.name,
          optionNumber: item.variants.indexOf(variant) + 1,
          facility: variant.recipe?.facility || null,
        },
        position: { x: 0, y: 100 },
      };
      nodes.push(variantNode);
      edges.push({
        id: rootNode.id + "_" + variantNode.id,
        source: rootNode.id,
        target: variantNode.id,
      });

      // for each material in this variant, resolve further
      variant.recipe?.materials.forEach(({ itemId, quantity: materialQty }) => {
        const material = resolveMaterialNode(
          initialItemId,
          variantNode.id,
          itemId,
          quantity * materialQty,
        );
        if (material) {
          nodes.push(...material.nodes);
          edges.push(...material.edges);
        }
      });
    });
  } else {
    const variant = item.variants[0];
    const recipe = variant.recipe;

    const hasMaterials = recipe && recipe.materials.length > 0;
    if (!hasMaterials) {
      return { nodes, edges };
    }

    recipe?.materials.forEach(({ itemId, quantity: materialQty }) => {
      const material = resolveMaterialNode(
        initialItemId,
        nodeId,
        itemId,
        quantity * materialQty,
      );
      if (material) {
        nodes.push(...material.nodes);
        edges.push(...material.edges);
      }
    });
  }

  return { nodes, edges };
}

function resolveMaterialNode(
  initialItemId: string,
  previousItemId: string,
  itemId: string,
  quantity = 1,
) {
  const item = getItemByNameOrId(itemId);
  if (item === undefined) return null;

  const nodes: Nodes[] = [];
  const edges: Edge[] = [];

  const hasMultipleVariants = item.variants.length > 1;
  if (hasMultipleVariants) {
    const res = resolveCraftingTree(
      initialItemId,
      item.id,
      quantity,
      false,
      previousItemId,
    );
    if (res) {
      nodes.push(...res.nodes);
      edges.push(...res.edges);
      // Connect the previous node to the root of this subtree
      // The root node ID is now previousItemId_itemId due to the parentNodeId parameter
      const rootNodeId = previousItemId + "_" + item.id;
      edges.push({
        id: previousItemId + "_" + rootNodeId,
        source: previousItemId,
        target: rootNodeId,
      });
    }
    return { nodes, edges };
  }

  // Check if this is a leaf node (no recipe or no materials)
  const variant = item.variants[0];
  const recipe = variant.recipe;
  const isLeafNode = !recipe || recipe.materials.length === 0;

  const materialNode: MaterialNode = {
    type: "material",
    id: previousItemId + "_" + item.id,
    data: {
      initialItemId,
      id: item.id,
      name: item.name,
      label: item.name,
      image: item.image || null,
      quantity,
      facility: variant?.recipe?.facility || null,
      end: isLeafNode,
    },
    position: { x: 0, y: 100 },
  };
  const edge: Edge = {
    id: previousItemId + "_" + materialNode.id,
    source: previousItemId,
    target: materialNode.id,
  };
  edges.push(edge);
  nodes.push(materialNode);

  // If this material has a recipe, resolve its materials recursively
  if (recipe && recipe.materials.length > 0) {
    recipe.materials.forEach(
      ({ itemId: subItemId, quantity: subMaterialQty }) => {
        const subMaterial = resolveMaterialNode(
          initialItemId,
          materialNode.id,
          subItemId,
          quantity * subMaterialQty,
        );
        if (subMaterial) {
          nodes.push(...subMaterial.nodes);
          edges.push(...subMaterial.edges);
        }
      },
    );
  }

  return { nodes, edges };
}
