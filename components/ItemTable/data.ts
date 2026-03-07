import itemsJSON from "@/data/items.json";
import { Item } from "@/Types";
import type { ItemTableRow } from "./columns";

const items = itemsJSON as Item[];

// Build lookup maps for item names and images by ID
const itemNameById = new Map<string, string>();
const itemImageById = new Map<string, string | null>();
for (const item of items) {
  itemNameById.set(item.id, item.name);
  itemImageById.set(item.id, item.image);
}

export const tableData: ItemTableRow[] = items.flatMap((item) =>
  item.variants.map((variant) => ({
    itemId: item.id,
    itemName: item.name,

    variantId: variant.id,
    variantName: variant.variantName,

    image: variant.image,

    facility: variant.recipe?.facility ?? null,
    skills: (item.skills ?? []).filter(
      (s): s is NonNullable<typeof s> => s !== null,
    ),

    outputQuantity: variant.recipe?.quantity ?? 0,

    materialCount: variant.recipe?.materials.length ?? 0,
    materials:
      variant.recipe?.materials.map((mat) => ({
        itemId: mat.itemId,
        itemName: itemNameById.get(mat.itemId) ?? mat.itemId,
        itemImage: itemImageById.get(mat.itemId) ?? null,
        quantity: mat.quantity,
      })) ?? [],

    wikiLink: item.wikiLink,
  })),
);
