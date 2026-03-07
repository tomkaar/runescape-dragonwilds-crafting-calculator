import { FilterFn as BaseFilterFn } from "@tanstack/react-table";
import { RankingInfo } from "@tanstack/match-sorter-utils";

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
