import itemsData from "@/data/items.json" assert { type: "json" };
import { Item } from "@/Types";
import { cache } from "react";

export const getItemById = cache((itemId: string): Item | undefined => {
  return itemsData.find(
    (item) => item.id.toLowerCase() === itemId.toLowerCase(),
  ) as Item | undefined;
});
