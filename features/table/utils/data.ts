import itemsJSON from "@/data/items.json";
import { idFromName } from "@/scripts/parse-data/utils/id-from-name";
import type { Item, Store } from "@/Types";
import type {
	TableBodyRowCurrency,
	TableBodyRowType,
} from "../types/table-body-row";

const items = itemsJSON as Item[];

// Build lookup maps for item names and images by ID
const itemNameById = new Map<string, string>();
const itemImageById = new Map<string, string | null>();
for (const item of items) {
	itemNameById.set(item.id, item.name);
	itemImageById.set(item.id, item.image);
}

/**
 * Picks the store with the lowest (or highest) cost and resolves its currency image.
 */
function resolvePrice(
	stores: Store[] | undefined,
	pick: "min" | "max",
): { price?: number; currency?: TableBodyRowCurrency } {
	if (!stores?.length) return {};

	const store = stores.reduce((best, store) =>
		(pick === "min" ? store.cost < best.cost : store.cost > best.cost)
			? store
			: best,
	);

	return {
		price: store.cost,
		currency: {
			name: store.currency,
			image: itemImageById.get(idFromName(store.currency)) ?? null,
		},
	};
}

export const tableData: TableBodyRowType[] = items.flatMap((item) => {
	const buy = resolvePrice(item.sold_by, "min");
	const sell = resolvePrice(item.bought_by, "max");

	return item.variants.map((variant) => ({
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
		hydration: item.hydration,
		sustenance: item.sustenance,
		outputQuantity: variant.recipe?.quantity ?? 0,

		buyPrice: buy.price,
		buyCurrency: buy.currency,
		sellPrice: sell.price,
		sellCurrency: sell.currency,

		materialsCount: variant.recipe?.materials.length ?? 0,
		materials:
			variant.recipe?.materials.map((mat) => ({
				itemId: mat.itemId,
				name: itemNameById.get(mat.itemId) ?? mat.itemId,
				image: itemImageById.get(mat.itemId) ?? null,
				quantity: mat.quantity,
			})) ?? [],

		wikiLink: item.wikiLink,
	}));
});
