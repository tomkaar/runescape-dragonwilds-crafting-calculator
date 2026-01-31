import { RawItem } from "../../items";
import { ItemVariant } from "@/Types";
import { itemIdFromName } from "./itemIdFromName";

export function resolveItemVariant(item: RawItem): ItemVariant | null {
  return {
    id: itemIdFromName(item.item_name),
    name: item.item_name,
    variantName: null,
    recipe: null,
  };
}
