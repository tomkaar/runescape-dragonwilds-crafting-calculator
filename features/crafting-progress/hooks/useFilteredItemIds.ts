import { useMemo } from "react";

import { useItemFilter } from "@/store/item-filter";
import { filterItemIds } from "../utils/filter-item-ids";

/** Narrows the tracked item ids down to the ones selected in the item filter. */
export function useFilteredItemIds(trackedItemIds: string[]): string[] {
	const isAll = useItemFilter((state) => state.isAll);
	const selectedIds = useItemFilter((state) => state.selectedIds);

	return useMemo(
		() => filterItemIds({ isAll, selectedIds, trackedItemIds }),
		[isAll, selectedIds, trackedItemIds],
	);
}
