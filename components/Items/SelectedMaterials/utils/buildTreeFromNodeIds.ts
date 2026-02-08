import { Item, ItemVariant } from "@/Types";

import { getItemOrVariantById } from "@/utils/getItemOrVariantById";

export type TreeItem =
  | {
      id: string;
      item: Item;
      quantity: number | null;
      nodeId: string;
      variant?: ItemVariant;
      variantNumber?: number;
    }
  | {
      id: string;
      item: Item;
      quantity: number | null;
      nodeId: string;
      variant?: ItemVariant;
      variantNumber?: number;
      items: TreeItem[];
    };

export function buildTreeFromNodeIds(
  materials: Array<{
    id: string;
    itemId: string;
    quantity: number;
    nodeId?: string;
  }>,
): TreeItem[] {
  const tree: TreeItem[] = [];

  // Create a map of itemId to quantity for selected materials
  const quantityMap = new Map<string, number>();
  materials.forEach((material) => {
    quantityMap.set(material.itemId, material.quantity);
  });

  materials.forEach((material) => {
    if (!material.nodeId) return;

    const splittedIds = material.nodeId.split("_");
    const ids = splittedIds;
    if (ids.length === 0) return;

    let currentLevel = tree;

    ids.forEach((id, index) => {
      // Find if this id already exists at the current level
      let existingNode = currentLevel.find((node) => node.id === id);

      if (!existingNode) {
        // Get the item or variant for this id
        const result = getItemOrVariantById(id);
        if (!result) return;

        // Extract the item - use parent item for variants
        const item = result.type === "item" ? result.data : result.parentItem;

        // Check if this item has a quantity (is selected)
        const quantity = quantityMap.get(id) ?? null;

        // If this is a variant, get the variant info
        let variant: ItemVariant | undefined;
        let variantNumber: number | undefined;
        if (result.type === "variant") {
          variant = result.data;
          // Find the variant number (1-indexed position in parent item's variants array)
          variantNumber =
            result.parentItem.variants.findIndex((v) => v.id === variant!.id) +
            1;
        }

        // Create new node
        const newNode: TreeItem = {
          id,
          item,
          quantity,
          nodeId: material.nodeId!,
          variant,
          variantNumber,
        };
        currentLevel.push(newNode);
        existingNode = newNode;
      }

      // If not the last item, ensure it has items array and traverse deeper
      if (index < ids.length - 1) {
        if (!("items" in existingNode)) {
          // Convert to node with items
          (
            existingNode as {
              id: string;
              item: Item;
              quantity: number | null;
              nodeId: string;
              variant?: ItemVariant;
              variantNumber?: number;
              items: TreeItem[];
            }
          ).items = [];
        }
        currentLevel = (
          existingNode as {
            id: string;
            item: Item;
            quantity: number | null;
            nodeId: string;
            variant?: ItemVariant;
            variantNumber?: number;
            items: TreeItem[];
          }
        ).items;
      }
    });
  });

  return tree;
}
