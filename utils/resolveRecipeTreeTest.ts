import { RecipeVariant } from "@/data/recipes";
import { getRecipeById } from "./getRecipeById";

export interface ItemNode {
  id: string;
  type: "item";
  data: {
    name: string;
    image?: string;
    quantity: number;
  };
  position: { x: number; y: number };
}

export interface ItemOptionsNode {
  id: string;
  type: "itemOptions";
  data: {
    name: string;
    image?: string;
    options: {
      id: string;
      variantName?: string;
      facility?: string;
    }[];
  };
  position: { x: number; y: number };
}

export type FlowNode = ItemNode | ItemOptionsNode;

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  data?: {
    facility?: string;
  };
}

export interface ResolveRecipeTreeResult {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

interface ResolveContext {
  nodes: Map<string, FlowNode>;
  edges: Map<string, FlowEdge>;
  nodeIdCounter: number;
  edgeIdCounter: number;
  processedMaterials: Set<string>;
  currentDepth: number;
  maxDepth: number;
}

/**
 * Generates a unique node ID based on material name and optional variant
 */
function generateNodeId(
  context: ResolveContext,
  name: string,
  variant?: string,
): string {
  const base = variant ? `${name}-${variant}` : name;
  return `${base}-${context.nodeIdCounter++}`;
}

/**
 * Generates a unique edge ID
 */
function generateEdgeId(context: ResolveContext): string {
  return `edge-${context.edgeIdCounter++}`;
}

/**
 * Resolves a single recipe variant recursively
 */
function resolveRecipeVariant(
  context: ResolveContext,
  recipe: RecipeVariant,
  parentNodeId: string,
  quantity: number = 1,
): void {
  if (context.currentDepth >= context.maxDepth) {
    return;
  }

  if (!recipe.materials || recipe.materials.length === 0) {
    return;
  }

  context.currentDepth++;

  for (const material of recipe.materials) {
    const materialQuantity = material.quantity * quantity;
    const subRecipes = getRecipeById(material.name);

    if (subRecipes && subRecipes.recipes.length > 0) {
      // Material can be crafted - check if multiple recipes exist
      if (subRecipes.recipes.length === 1) {
        // Single recipe - create item node and resolve recursively
        const nodeId = generateNodeId(
          context,
          material.name,
          subRecipes.recipes[0].variant,
        );

        const itemNode: ItemNode = {
          id: nodeId,
          type: "item",
          data: {
            name: material.name,
            image: material.image,
            quantity: materialQuantity,
          },
          position: { x: 0, y: 0 }, // Position will be calculated later
        };

        context.nodes.set(nodeId, itemNode);

        // Create edge from this node to parent
        const edgeId = generateEdgeId(context);
        const edge: FlowEdge = {
          id: edgeId,
          source: nodeId,
          target: parentNodeId,
          label: recipe.facility,
          data: {
            facility: recipe.facility,
          },
        };

        context.edges.set(edgeId, edge);

        // Recursively resolve this recipe
        resolveRecipeVariant(
          context,
          subRecipes.recipes[0],
          nodeId,
          materialQuantity,
        );
      } else {
        // Multiple recipes - create options node
        const optionsNodeId = generateNodeId(context, material.name, "options");

        const optionsNode: ItemOptionsNode = {
          id: optionsNodeId,
          type: "itemOptions",
          data: {
            name: material.name,
            image: material.image || subRecipes.image,
            options: subRecipes.recipes.map((r) => ({
              id: r.id,
              variantName: r.variant,
              facility: r.facility,
            })),
          },
          position: { x: 0, y: 0 }, // Position will be calculated later
        };

        context.nodes.set(optionsNodeId, optionsNode);

        // Create edge from options node to parent
        const edgeId = generateEdgeId(context);
        const edge: FlowEdge = {
          id: edgeId,
          source: optionsNodeId,
          target: parentNodeId,
          label: recipe.facility,
          data: {
            facility: recipe.facility,
          },
        };

        context.edges.set(edgeId, edge);

        // For options nodes, we could resolve all paths or let user choose
        // For now, we'll resolve the first option as default
        resolveRecipeVariant(
          context,
          subRecipes.recipes[0],
          optionsNodeId,
          materialQuantity,
        );
      }
    } else {
      // Base material (no recipe) - create item node
      const nodeId = generateNodeId(context, material.name);

      const itemNode: ItemNode = {
        id: nodeId,
        type: "item",
        data: {
          name: material.name,
          image: material.image,
          quantity: materialQuantity,
        },
        position: { x: 0, y: 0 }, // Position will be calculated later
      };

      context.nodes.set(nodeId, itemNode);

      // Create edge from this node to parent
      const edgeId = generateEdgeId(context);
      const edge: FlowEdge = {
        id: edgeId,
        source: nodeId,
        target: parentNodeId,
        label: recipe.facility,
        data: {
          facility: recipe.facility,
        },
      };

      context.edges.set(edgeId, edge);
    }
  }

  context.currentDepth--;
}

/**
 * Deeply resolves a recipe and returns nodes and edges for React Flow
 *
 * @param itemName - The name of the item to resolve
 * @param variantId - Optional specific variant/recipe ID to resolve
 * @param maxDepth - Maximum recursion depth (default: 10)
 * @returns Object containing nodes and edges arrays for React Flow
 */
export function resolveRecipeTree(
  itemName: string,
  variantId?: string,
  maxDepth: number = 10,
): ResolveRecipeTreeResult {
  const recipeGroup = getRecipeById(itemName);

  if (!recipeGroup) {
    // No recipe found - return single item node
    const rootNode: ItemNode = {
      id: "root",
      type: "item",
      data: {
        name: itemName,
        quantity: 1,
      },
      position: { x: 0, y: 0 },
    };

    return {
      nodes: [rootNode],
      edges: [],
    };
  }

  // Find the specific recipe variant or use the first one
  let recipe: RecipeVariant | undefined;
  if (variantId) {
    recipe = recipeGroup.recipes.find((r) => r.id === variantId);
  }
  if (!recipe) {
    recipe = recipeGroup.recipes[0];
  }

  if (!recipe) {
    // Shouldn't happen, but handle it
    const rootNode: ItemNode = {
      id: "root",
      type: "item",
      data: {
        name: itemName,
        image: recipeGroup.image,
        quantity: 1,
      },
      position: { x: 0, y: 0 },
    };

    return {
      nodes: [rootNode],
      edges: [],
    };
  }

  // Create context for resolution
  const context: ResolveContext = {
    nodes: new Map(),
    edges: new Map(),
    nodeIdCounter: 0,
    edgeIdCounter: 0,
    processedMaterials: new Set(),
    currentDepth: 0,
    maxDepth,
  };

  // Create root node (the item being crafted)
  const rootNode: ItemNode = {
    id: "root",
    type: "item",
    data: {
      name: recipe.name,
      image: recipeGroup.image,
      quantity: recipe.output.quantity,
    },
    position: { x: 0, y: 0 },
  };

  context.nodes.set("root", rootNode);

  // Resolve the recipe tree
  resolveRecipeVariant(context, recipe, "root");

  return {
    nodes: Array.from(context.nodes.values()),
    edges: Array.from(context.edges.values()),
  };
}
