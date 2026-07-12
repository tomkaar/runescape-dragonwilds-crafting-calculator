import type { RankingInfo } from "@tanstack/match-sorter-utils";
import type { FilterFn as BaseFilterFn } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
	interface FilterFns {
		fuzzy: BaseFilterFn<unknown>;
	}
	interface FilterMeta {
		itemRank: RankingInfo;
	}

	interface SortingFns {
		fuzzySort: (rowA: RowData, rowB: RowData, columnId: string) => number;
	}
}
