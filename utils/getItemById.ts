import itemsData from "@/data/items.json" assert { type: "json" };
import { Item } from "@/Types";

export function getItemByNameOrId(materialName: string): Item | undefined {
  return itemsData.find(
    (item) => item.id.toLowerCase() === materialName.toLowerCase(),
  ) as Item | undefined;
}
