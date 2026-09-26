type Params = {
	/** When true, every tracked item is included regardless of `selectedIds`. */
	isAll: boolean;
	/** Item ids the user picked in the filter (may contain untracked ids). */
	selectedIds: string[];
	/** Ids of the items the user is currently tracking, in display order. */
	trackedItemIds: string[];
};

/**
 * Resolves the item filter against the currently tracked items.
 *
 * @returns The tracked item ids included by the filter, in tracked order.
 */
export function filterItemIds({
	isAll,
	selectedIds,
	trackedItemIds,
}: Params): string[] {
	if (isAll) return trackedItemIds;
	return trackedItemIds.filter((id) => selectedIds.includes(id));
}
