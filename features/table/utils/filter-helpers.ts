import type { Column } from "@tanstack/react-table";
import type { TableBodyRowType } from "../types/table-body-row";

export type FilterOption = {
	name: string;
	image?: string | null;
	amount: number;
};

/**
 * Get the unique values for a column, sorted alphabetically. Facet keys may be
 * plain strings/numbers (facilities, skills, health, output quantity) or
 * objects carrying an image (materials) — both shapes are normalized here.
 * @param column The column to get the unique values for.
 * @returns An array of unique values for the column.
 */
export function getUniqueKeys(
	column: Column<TableBodyRowType, unknown>,
): FilterOption[] {
	const rawKeys = column.getFacetedUniqueValues().keys() ?? [];
	const allKeys = Array.from(rawKeys).flatMap((value) =>
		Array.isArray(value) ? value : [value],
	);

	const keys = new Map<string, { image?: string | null; amount: number }>();
	allKeys.forEach((key) => {
		const isObject = typeof key === "object" && key !== null;
		const stringKey = String(isObject ? key.name : key);
		const image = isObject ? key.image : undefined;
		const existing = keys.get(stringKey);
		keys.set(stringKey, {
			image: image ?? existing?.image,
			amount: (existing?.amount ?? 0) + 1,
		});
	});

	return Array.from(keys.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([name, { image, amount }]) => ({ name, image, amount }));
}

/**
 * Sort the values so that the selected values are first, and then sort the rest alphabetically.
 * @param selectedValues The values that are selected.
 * @returns A function that sorts the values.
 */
export function selectedFirst(selectedValues: unknown) {
	if (!Array.isArray(selectedValues)) {
		return () => 0;
	}
	const selected = selectedValues as string[];

	return (a: { name: string }, b: { name: string }) => {
		const aSelected = selected.includes(a.name);
		const bSelected = selected.includes(b.name);

		if (aSelected && !bSelected) return -1;
		if (!aSelected && bSelected) return 1;

		return a.name.localeCompare(b.name);
	};
}

/**
 * Fuzzy match the value against the filter value.
 * @param filterValue The value to match against.
 * @returns A function that returns true if the value matches the filter value.
 */
export function fuzzyMatch(filterValue: string) {
	return (value: { name: string }) => {
		if (typeof value.name !== "string") return false;
		if (!filterValue) return true;

		const lowerValue = value.name.toLowerCase();
		const lowerFilter = filterValue.toLowerCase();

		return lowerValue.includes(lowerFilter);
	};
}
