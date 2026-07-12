import itemsData from "@/data/items.json" with { type: "json" };
import type { Item } from "@/Types";
import type { UsedInItem } from "../types/used-in-item";

const items = itemsData as Item[];

/**
 * Maps a material's itemId to the items that use it, built once at module load
 * so getUsedIn can look it up instead of rescanning every item on each call.
 */
function buildUsedInIndex(items: Item[]): Map<string, UsedInItem[]> {
	const index = new Map<string, UsedInItem[]>();

	for (const item of items) {
		const materialIds = new Set<string>();
		for (const variant of item.variants) {
			for (const material of variant.recipe?.materials ?? []) {
				materialIds.add(material.itemId);
			}
		}

		if (materialIds.size === 0) continue;

		const entry: UsedInItem = {
			id: item.id,
			name: item.name,
			image: item.image,
		};
		for (const materialId of materialIds) {
			const usedIn = index.get(materialId);
			if (usedIn) {
				usedIn.push(entry);
			} else {
				index.set(materialId, [entry]);
			}
		}
	}

	return index;
}

const usedInIndex = buildUsedInIndex(items);

export function getUsedIn(itemId: string): UsedInItem[] {
	return usedInIndex.get(itemId) ?? [];
}
