import itemsData from "@/data/items.json" assert { type: "json" };
import { Item, ItemVariant } from "@/Types";
import { cache } from "react";

type ItemOrVariant =
  | { type: "item"; data: Item }
  | { type: "variant"; data: ItemVariant; parentItem: Item };

/**
 * Get an item or variant by ID.
 * First tries to find an item by ID, then searches for a variant by ID.
 * @param id - The ID to search for (can be an item ID or variant ID)
 * @returns An object with type "item" or "variant" and the corresponding data, or undefined if not found
 */
export const getItemOrVariantById = cache(
  (id: string): ItemOrVariant | undefined => {
    const items = itemsData as Item[];

    // First, try to find as an item
    const item = items.find((item) => item.id === id);
    if (item) {
      return { type: "item", data: item };
    }

    // If not found as item, search for variant
    for (const item of items) {
      const variant = item.variants.find((v) => v.id === id);
      if (variant) {
        return { type: "variant", data: variant, parentItem: item };
      }
    }

    return undefined;
  },
);
