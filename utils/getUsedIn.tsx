import itemsData from "@/data/items.json" assert { type: "json" };
import { Item } from "@/Types";

const items = itemsData as Item[];

export function getUsedIn(
  itemId: string,
): { id: string; name: string; image: string | null }[] {
  const usedIn: { id: string; name: string; image: string | null }[] = [];

  for (const item of items) {
    // Check all variants of this item
    const isUsedInThisItem = item.variants.some((variant) =>
      variant.recipe?.materials.some((material) => material.itemId === itemId),
    );

    if (isUsedInThisItem) {
      usedIn.push({
        id: item.id,
        name: item.name,
        image: item.image,
      });
    }
  }

  return usedIn;
}
