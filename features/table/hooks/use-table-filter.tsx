import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ColumnId } from "../types/column-id";

/**
 * Custom hook to manage table filtering and sorting state based on URL search parameters.
 * It initializes the state from the URL and updates the URL whenever the state changes.
 * Returns the current global filter, sorting state, and column filters along with their respective setters.
 */
export default function useTableFilter() {
	const searchParams = useSearchParams();

	const [globalFilter, setGlobalFilter] = useState<string>(
		() => searchParams.get("q") || "",
	);
	const [sorting, setSorting] = useState<SortingState>(() =>
		parseSortState(searchParams.get("sort")),
	);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
		parseColumnFilters(searchParams),
	);

	useEffect(() => {
		const url = buildSearchParams(sorting, globalFilter, columnFilters);
		window.history.replaceState(null, "", url);
	}, [sorting, globalFilter, columnFilters]);

	return {
		globalFilter,
		setGlobalFilter,
		sorting,
		setSorting,
		columnFilters,
		setColumnFilters,
	};
}

/**
 * Utility function to split a comma-separated string into an array and filter out empty values.
 */
function splitAndFilter(value: string | null) {
	return (value || "").split(",").filter(Boolean);
}

/**
 * Parses a comma-separated "min,max" string into a numeric range tuple.
 */
function parseRangeFilter(value: string | null): [number, number] | undefined {
	if (!value) return undefined;

	const [minStr, maxStr] = value.split(",");
	const min = Number(minStr);
	const max = Number(maxStr);

	if (Number.isNaN(min) || Number.isNaN(max)) return undefined;
	return [min, max];
}

/**
 * Parses the sort state from a string value in the format "columnId.direction"
 */
function parseSortState(value: string | null): SortingState {
	if (!value) return [];

	const dotIndex = value.lastIndexOf(".") ?? -1;
	if (dotIndex === -1) return [];

	const id = value.substring(0, dotIndex);
	const dir = value.substring(dotIndex + 1);

	return [{ id, desc: dir === "desc" }];
}

/**
 * Parses the column filters from the search parameters.
 * Returns an array of column filter objects that can be used with the table state.
 */
function parseColumnFilters(searchParams: URLSearchParams) {
	const columnFilters: ColumnFiltersState = [];

	const facilities = splitAndFilter(searchParams.get(ColumnId.Facilities));
	const skills = splitAndFilter(searchParams.get(ColumnId.Skills));
	const materials = splitAndFilter(searchParams.get(ColumnId.Materials));
	const health = parseRangeFilter(searchParams.get(ColumnId.Health));
	const outputQuantity = parseRangeFilter(
		searchParams.get(ColumnId.OutputQuantity),
	);

	if (facilities.length > 0) {
		columnFilters.push({ id: ColumnId.Facilities, value: facilities });
	}
	if (skills.length > 0) {
		columnFilters.push({ id: ColumnId.Skills, value: skills });
	}
	if (materials.length > 0) {
		columnFilters.push({ id: ColumnId.Materials, value: materials });
	}
	if (health) {
		columnFilters.push({ id: ColumnId.Health, value: health });
	}
	if (outputQuantity) {
		columnFilters.push({ id: ColumnId.OutputQuantity, value: outputQuantity });
	}

	return columnFilters;
}

function buildSearchParams(
	sorting: SortingState,
	globalFilter: string,
	columnFilters: ColumnFiltersState,
) {
	// Implement the logic to build the search params URL based on the sorting, globalFilter, and columnFilters
	const params = new URLSearchParams();

	if (globalFilter) {
		params.set("q", globalFilter);
	}

	if (sorting.length > 0) {
		const sort = sorting[0];
		params.set("sort", `${sort.id}.${sort.desc ? "desc" : "asc"}`);
	}

	columnFilters.forEach((filter) => {
		params.set(filter.id, (filter.value as string[]).join(","));
	});

	const str = params.toString();
	return str ? `?${str}` : window.location.pathname;
}
