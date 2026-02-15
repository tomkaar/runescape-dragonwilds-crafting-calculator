import { getItemById } from "@/utils/itemById";
import { type Node } from "./nodes";
import { type Edge } from "./edges";
import { cache } from "react";

type Args = {
  itemId: string;
  prevQuantity?: number;
  // When recursing, the previous item ID, used for building unique node IDs
  prevItemId?: string;
  // Indicates if this is the starting point of the tree resolution
  initialNode?: boolean;
  // The initial item ID for the tree
  initialItemId?: string;
};

export const resolveCraftingTree = cache((args: Args) => {
  const { initialItemId = args.itemId } = args;
  let { initialNode = true } = args;

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const item = getItemById(args.itemId);

  if (!item) {
    return { nodes, edges };
  }

  // console.group("Item found:", item.name);
  const multipleVariants = item.variants.length > 1;
  const variantNodeId = [args.prevItemId || null, item.id]
    .filter((part) => part !== null)
    .join("_");

  if (multipleVariants) {
    const variantNode: Node = {
      type: "node",
      id: variantNodeId,
      data: {
        id: item.id,
        label: item.name,
        image: item.image || null,
        numberOfRecipies: item.variants.length,
        isRecipeNumberVariant: null,
        facility: !!item.variants.length
          ? null
          : (item.facilities[0] as unknown as string | null),
        quantityNeeded: args.prevQuantity || 1,
        quantityRecieved: 0,
        hasExcessItems: false,
        initialItemId,
        initialNode: initialNode,
        leafNode: null,
      },
      position: { x: 0, y: 0 },
    };
    const variantEdge: Edge = {
      type: "edge",
      id: variantNodeId,
      source: args.prevItemId || "root",
      target: variantNodeId,
      data: {
        highlighted: false,
      },
    };
    nodes.push(variantNode);
    edges.push(variantEdge);
    initialNode = false; // Multiple variants mean this can't be the initial node
  }

  item.variants.map((variant, idx) => {
    // Create a unique ID for the node, incorporating previous item ID if available
    // also handle multiple variants by appending variant index if necessary
    const itemId = [
      args.prevItemId || null,
      item.id,
      multipleVariants ? `v${idx}` : null,
    ]
      .filter((part) => part !== null)
      .join("_");

    const previousRecipipeRequiresQuantity = args.prevQuantity || 1;
    const recipeWillCreateQuantity = variant.recipe?.quantity || 1;
    const prevAndRecipeMatch =
      previousRecipipeRequiresQuantity === recipeWillCreateQuantity;

    // How many times do we need to run the recipe to satisfy the previous quantity?
    let recipeMultiplier = 1;
    if (!prevAndRecipeMatch) {
      recipeMultiplier = Math.ceil(
        previousRecipipeRequiresQuantity / recipeWillCreateQuantity,
      );
    }

    const resultQuantity = recipeMultiplier * recipeWillCreateQuantity;

    const node: Node = {
      type: "node",
      id: itemId,
      data: {
        id: item.id,
        label: item.name,
        image: item.image || null,
        numberOfRecipies: null,
        isRecipeNumberVariant: multipleVariants ? idx + 1 : null,
        facility: variant.recipe?.facility as unknown as string | null,
        quantityNeeded: initialNode
          ? variant.recipe?.quantity || 1
          : previousRecipipeRequiresQuantity,
        quantityRecieved: resultQuantity,
        hasExcessItems:
          !initialNode &&
          resultQuantity > 0 &&
          resultQuantity > previousRecipipeRequiresQuantity,
        initialItemId,
        initialNode,
        leafNode: !variant.recipe || false,
      },
      position: { x: 0, y: 0 },
    };
    let edgeSource = args.prevItemId || "root";
    if (multipleVariants) {
      edgeSource = variantNodeId;
    }
    const edge: Edge = {
      type: "edge",
      id: itemId,
      source: edgeSource,
      target: itemId,
      data: {
        highlighted: multipleVariants ? true : false,
      },
    };
    nodes.push(node);
    edges.push(edge);

    variant.recipe?.materials.forEach((matArgs) => {
      const material = getItemById(matArgs.itemId);
      if (!material) return;
      if (material.variants.length > 0) {
        const subTree = resolveCraftingTree({
          itemId: material.id,
          prevQuantity: matArgs.quantity * recipeMultiplier,
          prevItemId: itemId,
          initialNode: false,
          initialItemId,
        });
        nodes.push(...subTree.nodes);
        edges.push(...subTree.edges);
      }
    });
  });

  return { nodes, edges };
});
