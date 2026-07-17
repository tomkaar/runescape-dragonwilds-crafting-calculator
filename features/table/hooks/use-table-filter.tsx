import type {
	ColumnFiltersState,
	SortingState,
	Updater,
} from "@tanstack/react-table";
import { functionalUpdate } from "@tanstack/react-table";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";
import { ColumnId } from "../types/column-id";

const FILTERABLE_COLUMN_IDS = [
	ColumnId.Facilities,
	ColumnId.Skills,
	ColumnId.Materials,
	ColumnId.Health,
	ColumnId.OutputQuantity,
];

// The item table only lives on this route. The item detail view opens as a
// modal on top of it via an intercepting route (e.g. /item/refined-obsidian).
// useSearchParams() is global to the whole document URL, not scoped to a
// parallel-route slot, so once that intercepting route is active it changes
// what useSearchParams() returns for *every* component on the page - including
// this table, which is still mounted behind the modal and never navigated
// anywhere itself. Without the isListRoute guard below, opening the modal
// would make the filters read as empty and appear to reset.
const LIST_PATHNAME = "/item";

/**
 * Custom hook to manage table filtering and sorting state.
 *
 * The URL is the single source of truth: there is no local React state for
 * `globalFilter` / `sorting` / `columnFilters`, they're derived fresh from
 * `useSearchParams()` on every render. This is what makes the table react
 * to URL changes that happen outside of it too (e.g. a facility link
 * elsewhere in the app navigating to /item?facilities=X while this table is
 * already mounted) - there's no separate state to fall out of sync with the
 * URL, because there's no separate state at all.
 *
 * The one wrinkle is the intercepted item-detail modal (see LIST_PATHNAME
 * above): while it's open the document URL points at the modal's route, not
 * this one, so search params are read from it "live" only while pathname is
 * actually /item, and otherwise held at the last value seen on /item.
 */
export default function useTableFilter() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isListRoute = pathname === LIST_PATHNAME;

	// Mutating a ref during render (rather than in a useEffect) is
	// intentional: it lets the freeze take effect in the very same render
	// that notices we've left /item, instead of one render later after an
	// effect fires - avoiding a flash of "reset" filters when the modal opens.
	const lastListSearchParams = useRef(searchParams);
	if (isListRoute) {
		lastListSearchParams.current = searchParams;
	}
	const effectiveSearchParams = isListRoute
		? searchParams
		: lastListSearchParams.current;

	// State is always parsed fresh from effectiveSearchParams - never cached
	// in useState - so there's nothing here that can drift out of sync with
	// the URL.
	const globalFilter = useMemo(
		() => effectiveSearchParams.get("q") || "",
		[effectiveSearchParams],
	);
	const sorting = useMemo(
		() => parseSortState(effectiveSearchParams.get("sort")),
		[effectiveSearchParams],
	);
	const columnFilters = useMemo(
		() => parseColumnFilters(effectiveSearchParams),
		[effectiveSearchParams],
	);

	// The setters below all read `window.location.search` directly (not the
	// `effectiveSearchParams`/`searchParams` values above) so that several
	// setters firing back-to-back in the same tick - e.g. the "Reset" button
	// clearing both column filters and the global filter - each build on top
	// of the previous one's write instead of a stale pre-render snapshot.
	const setGlobalFilter = useCallback((updater: Updater<string>) => {
		const params = new URLSearchParams(window.location.search);
		const value = functionalUpdate(updater, params.get("q") || "");

		if (value) {
			params.set("q", value);
		} else {
			params.delete("q");
		}

		writeSearchParams(params);
	}, []);

	const setSorting = useCallback((updater: Updater<SortingState>) => {
		const params = new URLSearchParams(window.location.search);
		const value = functionalUpdate(updater, parseSortState(params.get("sort")));

		if (value.length > 0) {
			const sort = value[0];
			params.set("sort", `${sort.id}.${sort.desc ? "desc" : "asc"}`);
		} else {
			params.delete("sort");
		}

		writeSearchParams(params);
	}, []);

	const setColumnFilters = useCallback(
		(updater: Updater<ColumnFiltersState>) => {
			const params = new URLSearchParams(window.location.search);
			const value = functionalUpdate(updater, parseColumnFilters(params));

			for (const id of FILTERABLE_COLUMN_IDS) {
				params.delete(id);
			}
			for (const filter of value) {
				params.set(filter.id, serializeFilterValue(filter.value));
			}

			writeSearchParams(params);
		},
		[],
	);

	return {
		globalFilter,
		setGlobalFilter,
		sorting,
		setSorting,
		columnFilters,
		setColumnFilters,
	};
}

// Uses the raw History API instead of next/navigation's router.replace() to
// update the URL without triggering a Next.js navigation/re-fetch - this is
// client-side-only filter state being mirrored to the URL for shareable
// links, not an actual page navigation. Next's router still picks up the
// change and updates useSearchParams() for every subscriber (that's what
// keeps this hook's own read side above in sync).
function writeSearchParams(params: URLSearchParams) {
	const search = params.toString();
	window.history.pushState(
		null,
		"",
		search ? `?${search}` : window.location.pathname,
	);
}

function serializeFilterValue(value: unknown) {
	return Array.isArray(value) ? value.join(",") : String(value);
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
