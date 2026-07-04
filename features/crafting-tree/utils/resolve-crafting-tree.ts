import { sourceItemById } from "@/utils/source-item-by-id";

import { type Node } from "../schemas/Node";
import { type Edge } from "../schemas/Edge";

import { cache } from "react";

type Args = {
    /**
     * The item ID to resolve the crafting tree for
     */
    itemId: string;
    /**
     * The quantity of the item to resolve the crafting tree for,
     * used for scaling the quantities of materials in the tree
     */
    prevQuantity?: number;
    /**
     * When recursing, the previous item ID, used for building unique node IDs
     */
    prevItemId?: string;
    /**
     * Indicates if this is the starting point of the tree resolution
     */
    initialNode?: boolean;
    /**
     * The initial item ID for the tree
     */
    initialItemId?: string;
};

type ResolveCraftingTreeResult = {
    nodes: Node[];
    edges: Edge[];
};

/**
 * Resolves the crafting tree for a given item ID, returning the nodes and edges of the tree.
 * Memoized per React request so multiple components resolving the same item share one result.
 * 
 * @param args - The arguments for resolving the crafting tree.
 * @returns An object containing the nodes and edges of the crafting tree.
 */
export const resolveCraftingTree = cache((args: Args): ResolveCraftingTreeResult => {
  const { initialItemId = args.itemId } = args;
  let { initialNode = true } = args;

  const item = sourceItemById(args.itemId);
  if (!item) return { nodes: [], edges: [] }

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const multipleVariants = item.variants.length > 1;
  // Node IDs encode the parent chain (prevItemId_itemId) so the same item appearing
  // in two different branches of the tree gets distinct node IDs.
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
        facilities: [],
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
    // The selector node is the entry point for this item; the individual variant
    // nodes that follow are not the root of the tree even if this item is.
    initialNode = false;
  }

  for (let idx = 0; idx < item.variants.length; idx++) {
    const variant = item.variants[idx];
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

    // ceil ensures we always produce enough; may overshoot and leave excess items.
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
        image: variant.image || null,
        numberOfRecipies: null,
        isRecipeNumberVariant: multipleVariants ? idx + 1 : null,
        facilities: variant.recipe?.facilities ?? [],
        quantityNeeded: previousRecipipeRequiresQuantity,
        quantityRecieved: resultQuantity,
        // The root item is the craft target — excess never applies to it, only to
        // intermediate sub-components whose recipes overshoot the required quantity.
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

    const materials = variant.recipe?.materials ?? [];
    for (const matArgs of materials) {
      const material = sourceItemById(matArgs.itemId);
      // Materials with no variants have no resolvable recipe paths; skip silently.
      if (!material || material.variants.length === 0) continue;
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
  }

  return { nodes, edges };
});

