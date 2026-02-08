import { Item, ItemVariant } from "@/Types";
import { Edge } from "@xyflow/react";
import { Node } from "@/components/CraftingTree/nodes";
import { getItemById } from "@/utils/itemById";

type MaterialTreeItemData = {
  id: string;
  nodeId: string;
  item: Item;
  quantity: number;
  variant?: ItemVariant;
  variantNumber?: number;
  facility: string | null;
  isEnd?: boolean;
};

export type MaterialTreeItem =
  | MaterialTreeItemData
  | (MaterialTreeItemData & {
      children: MaterialTreeItem[];
    });

/**
 * Build a hierarchical tree structure from flat nodes and edges
 */
export function buildMaterialsTree(
  nodes: Node[],
  edges: Edge[],
): MaterialTreeItem[] {
  // Create a map of node ID to its children
  const childrenMap = new Map<string, string[]>();
  edges.forEach((edge) => {
    const children = childrenMap.get(edge.source) || [];
    children.push(edge.target);
    childrenMap.set(edge.source, children);
  });

  // Create a map of node ID to node data
  const nodeMap = new Map<string, Node>();
  nodes.forEach((node) => {
    nodeMap.set(node.id, node);
  });

  // Recursive function to build tree
  const buildNode = (nodeId: string): MaterialTreeItem | null => {
    const node = nodeMap.get(nodeId);
    if (!node) return null;

    // Get item data
    const item = getItemById(node.data.id);
    if (!item) return null;

    const quantity = node.data.quantityNeeded || 1;
    const facility = node.data.facility;
    const isEnd = node.data.leafNode || false;

    // Build base node
    const baseNode: MaterialTreeItem = {
      id: node.data.id,
      nodeId: node.id,
      item,
      quantity,
      facility,
      isEnd,
      variantNumber: node.data.isRecipeNumberVariant || undefined,
    };

    // Get children
    const childIds = childrenMap.get(nodeId) || [];
    if (childIds.length > 0) {
      const children = childIds
        .map((childId) => buildNode(childId))
        .filter((child): child is MaterialTreeItem => child !== null);

      if (children.length > 0) {
        return { ...baseNode, children };
      }
    }

    return baseNode;
  };

  // Find root nodes using the initialNode flag
  const rootNodes = nodes
    .filter((node) => node.data.initialNode === true)
    .map((node) => buildNode(node.id))
    .filter((node): node is MaterialTreeItem => node !== null);

  return rootNodes;
}
