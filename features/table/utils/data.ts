import itemsJSON from "@/data/items.json";
import type { Item } from "@/Types";
import type { TableBodyRowType } from "../types/table-body-row";

const items = itemsJSON as Item[];

// Build lookup maps for item names and images by ID
const itemNameById = new Map<string, string>();
const itemImageById = new Map<string, string | null>();
for (const item of items) {
	itemNameById.set(item.id, item.name);
	itemImageById.set(item.id, item.image);
}

export const tableData: TableBodyRowType[] = items.flatMap((item) =>
	item.variants.map((variant) => ({
		itemId: item.id,
		name: item.name,

		variantId: variant.id,
		variant: variant.variantName,

		itemType: item.itemType,

		image: variant.image,

		facilities: variant.recipe?.facilities ?? [],
		skills: (item.skills ?? []).filter(
			(s): s is NonNullable<typeof s> => s !== null,
		),

		health: item.health ?? 0,
		outputQuantity: variant.recipe?.quantity ?? 0,

		materialsCount: variant.recipe?.materials.length ?? 0,
		materials:
			variant.recipe?.materials.map((mat) => ({
				itemId: mat.itemId,
				name: itemNameById.get(mat.itemId) ?? mat.itemId,
				image: itemImageById.get(mat.itemId) ?? null,
				quantity: mat.quantity,
			})) ?? [],

		wikiLink: item.wikiLink,
	})),
);
