import { useMemo } from "react";

import type { SelectedMaterial } from "@/store/selected-material";
import { sourceItemById } from "@/utils/source-item-by-id";

/** Derives the tracked item ids from the selected-material store, sorted by item name. */
export function useTrackedItemIds(
	allItems: Record<string, SelectedMaterial[]>,
): string[] {
	return useMemo(
		() =>
			Object.keys(allItems).sort((a, b) => {
				const nameA = sourceItemById(a)?.name ?? a;
				const nameB = sourceItemById(b)?.name ?? b;
				return nameA.localeCompare(nameB);
			}),
		[allItems],
	);
}
