import { cache } from "react";
import itemsData from "@/data/items.json" with { type: "json" };
import type { Item } from "@/Types";

export const sourceItemById = cache((itemId: string): Item | undefined => {
	const item = itemsData.find(
		(item) => item.id.toLowerCase() === itemId.toLowerCase(),
	);

	return item;
});
