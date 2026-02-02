import { Item, ItemVariant } from "@/Types";
import { Edge } from "@xyflow/react";
import { getItemOrVariantById } from "@/utils/getItemOrVariantById";
import { Nodes } from "../CraftingTree/types";

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
  nodes: Nodes[],
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
  const nodeMap = new Map<string, Nodes>();
  nodes.forEach((node) => {
    nodeMap.set(node.id, node);
  });

  // Recursive function to build tree
  const buildNode = (nodeId: string): MaterialTreeItem | null => {
    const node = nodeMap.get(nodeId);
    if (!node) return null;

    // Get item or variant info
    const result = getItemOrVariantById(node.data.id);
    if (!result) return null;

    const item = result.type === "item" ? result.data : result.parentItem;
    let variant: ItemVariant | undefined;
    let variantNumber: number | undefined;

    if (result.type === "variant") {
      variant = result.data;
      variantNumber =
        result.parentItem.variants.findIndex((v) => v.id === variant!.id) + 1;
    }

    // Build base node
    const baseNode: MaterialTreeItem = {
      id: node.data.id,
      nodeId: node.id,
      item,
      quantity: node.data.quantity! || 1,
      variant,
      variantNumber,
      facility: node.data.facility,
      isEnd: node.type === "material" && node.data.end,
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

  // Find root nodes (nodes that are not targets of any edge)
  const targetIds = new Set(edges.map((e) => e.target));
  const rootNodes = nodes
    .filter((node) => !targetIds.has(node.id))
    .map((node) => buildNode(node.id))
    .filter((node): node is MaterialTreeItem => node !== null);

  return rootNodes;
}
