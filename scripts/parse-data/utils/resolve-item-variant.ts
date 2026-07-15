import type { SourceItem } from "@/scripts/fetch-data/types/item";
import type { ItemVariant } from "@/Types";
import { idFromName } from "./id-from-name";

export function resolveItemVariant(item: SourceItem): ItemVariant {
	return {
		id: idFromName(item.item_name),
		name: item.item_name,
		image: item.json.image_raw || null,
		variantName: null,
		recipe: null,
		usesRecipe: null,
	};
}
