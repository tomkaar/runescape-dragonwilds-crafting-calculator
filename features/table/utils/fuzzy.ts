import { compareItems, rankItem } from "@tanstack/match-sorter-utils";
import type { FilterFn, SortingFn } from "@tanstack/react-table";
import type { TableBodyRowType } from "../types/table-body-row";

export const fuzzyFilter: FilterFn<TableBodyRowType> = (
	row,
	columnId,
	value,
	addMeta,
) => {
	const itemRank = rankItem(row.getValue(columnId), value);

	addMeta({ itemRank });

	return itemRank.passed;
};

export const fuzzySort: SortingFn<TableBodyRowType> = (
	rowA,
	rowB,
	columnId,
) => {
	const metaA = rowA.columnFiltersMeta[columnId]?.itemRank;
	const metaB = rowB.columnFiltersMeta[columnId]?.itemRank;

	if (metaA && metaB) {
		return compareItems(metaA, metaB);
	}

	return 0;
};
