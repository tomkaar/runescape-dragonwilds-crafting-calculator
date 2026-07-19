import type { RankingInfo } from "@tanstack/match-sorter-utils";
import type { FilterFn as BaseFilterFn } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";

declare module "@tanstack/react-table" {
	interface FilterFns {
		fuzzy: BaseFilterFn<unknown>;
	}
	interface FilterMeta {
		itemRank: RankingInfo;
	}

	interface ColumnMeta<TData extends RowData, TValue> {
		/** Which filter component to render in the sidebar for this column. */
		filterVariant?: "select-multiple" | "range";
		/** Icon shown to the left of the header title in the accordion trigger. */
		headerIcon?: LucideIcon;
		/** Renders a facility icon or the material's item image next to each option (select-multiple only). */
		icon?: "facility" | "material";
		/** Whether to show a "Show All/Show Less" toggle when there are more options than fit by default (select-multiple only). */
		showMoreButton?: boolean;
		/** Short hint shown under the filter title in the sidebar. */
		description?: string;
	}

	interface SortingFns {
		fuzzySort: (rowA: RowData, rowB: RowData, columnId: string) => number;
	}
}
