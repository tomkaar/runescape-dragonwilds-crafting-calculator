import { FilterFn } from "@tanstack/react-table";
import { ItemTableRow } from "./columns";
import { rankItem } from "@tanstack/match-sorter-utils";

export const fuzzyFilter: FilterFn<ItemTableRow> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({ itemRank });

  return itemRank.passed;
};

import { compareItems } from "@tanstack/match-sorter-utils";
import { SortingFn } from "@tanstack/react-table";

export const fuzzySort: SortingFn<ItemTableRow> = (rowA, rowB, columnId) => {
  const metaA = rowA.columnFiltersMeta[columnId]?.itemRank;
  const metaB = rowB.columnFiltersMeta[columnId]?.itemRank;

  if (metaA && metaB) {
    return compareItems(metaA, metaB);
  }

  return 0;
};
