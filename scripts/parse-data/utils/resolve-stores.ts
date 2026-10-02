import type { SourceStoreline } from "@/scripts/fetch-data/types/storeline";
import type { Item, Store } from "@/Types";

type ItemStores = Pick<Item, "sold_by" | "bought_by">;

export function resolveStores(storelines: SourceStoreline[]): ItemStores {
	const toStore = (storeline: SourceStoreline): Store => ({
		name: storeline.page_name,
		currency: storeline.json.Currency,
		cost: storeline.json.Cost,
	});

	const soldBy = storelines
		.filter((storeline) => storeline.json.Mode === "sell")
		.map(toStore);
	const boughtBy = storelines
		.filter((storeline) => storeline.json.Mode === "buy")
		.map(toStore);

	return {
		...(soldBy.length > 0 && { sold_by: soldBy }),
		...(boughtBy.length > 0 && { bought_by: boughtBy }),
	};
}
