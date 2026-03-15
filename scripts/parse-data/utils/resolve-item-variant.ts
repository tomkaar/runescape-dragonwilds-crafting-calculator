import { ItemVariant } from "@/Types";
import { idFromName } from "./id-from-name";
import { SourceItem } from "@/scripts/fetch-data/types/item";

export function resolveItemVariant(item: SourceItem): ItemVariant | null {
  return {
    id: idFromName(item.item_name),
    name: item.item_name,
    image: item.json.image_raw || null,
    variantName: null,
    recipe: null,
    usesRecipe: null,
  };
}
