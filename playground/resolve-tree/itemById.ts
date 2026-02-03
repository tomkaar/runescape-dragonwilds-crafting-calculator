import itemsData from "./test-items.json" assert { type: "json" };
import { Item } from "@/Types";

export function getItemById(itemId: string): Item | undefined {
  return itemsData.find(
    (item) => item.id.toLowerCase() === itemId.toLowerCase(),
  ) as Item | undefined;
}
