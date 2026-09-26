import type { Column } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import type { TableBodyRowType } from "../types/table-body-row";
import { fuzzyMatch, getUniqueKeys, selectedFirst } from "./filter-helpers";

function makeColumn(
	facetedUniqueValues: Map<unknown, number>,
): Column<TableBodyRowType, unknown> {
	return {
		getFacetedUniqueValues: () => facetedUniqueValues,
	} as unknown as Column<TableBodyRowType, unknown>;
}

describe("getUniqueKeys", () => {
	it("counts scalar facet values by their real per-value count", () => {
		// Scalar columns (e.g. itemType) are deduped by tanstack itself, so the
		// facet map's count *is* the number of rows with that value.
		const column = makeColumn(
			new Map([
				["Bow", 12],
				["Armour", 45],
			]),
		);

		expect(getUniqueKeys(column)).toEqual([
			{ name: "Armour", image: undefined, amount: 45 },
			{ name: "Bow", image: undefined, amount: 12 },
		]);
	});

	it("sums array facet values across per-row arrays", () => {
		// Array columns (e.g. facilities) are never deduped by tanstack - each
		// row's array is its own facet entry with count 1 - so the real count
		// per name comes from flattening every row's array.
		const column = makeColumn(
			new Map<unknown, number>([
				[["Furnace", "Sawmill"], 1],
				[["Furnace"], 1],
			]),
		);

		expect(getUniqueKeys(column)).toEqual([
			{ name: "Furnace", image: undefined, amount: 2 },
			{ name: "Sawmill", image: undefined, amount: 1 },
		]);
	});

	it("normalizes object facet values carrying an image", () => {
		const column = makeColumn(
			new Map<unknown, number>([
				[[{ name: "Iron Ore", image: "iron-ore.png" }], 1],
				[[{ name: "Iron Ore", image: null }], 1],
			]),
		);

		expect(getUniqueKeys(column)).toEqual([
			{ name: "Iron Ore", image: "iron-ore.png", amount: 2 },
		]);
	});

	it("returns an empty array when there are no facets", () => {
		expect(getUniqueKeys(makeColumn(new Map()))).toEqual([]);
	});

	it("excludes null and undefined facet values (e.g. rows with no variant)", () => {
		const column = makeColumn(
			new Map<unknown, number>([
				["Cabin", 80],
				[null, 1551],
				[undefined, 3],
			]),
		);

		expect(getUniqueKeys(column)).toEqual([
			{ name: "Cabin", image: undefined, amount: 80 },
		]);
	});

	it("excludes null and undefined entries inside array facet values", () => {
		const column = makeColumn(
			new Map<unknown, number>([[["Furnace", null, undefined], 1]]),
		);

		expect(getUniqueKeys(column)).toEqual([
			{ name: "Furnace", image: undefined, amount: 1 },
		]);
	});

	it("returns an empty array when the column has no faceted values", () => {
		const column = {
			getFacetedUniqueValues: () => undefined,
		} as unknown as Column<TableBodyRowType, unknown>;

		expect(getUniqueKeys(column)).toEqual([]);
	});

	it("stringifies numeric facet values", () => {
		const column = makeColumn(
			new Map<unknown, number>([
				[2, 4],
				[1, 7],
			]),
		);

		expect(getUniqueKeys(column)).toEqual([
			{ name: "1", image: undefined, amount: 7 },
			{ name: "2", image: undefined, amount: 4 },
		]);
	});

	it("picks up an image from a later facet when earlier ones have none", () => {
		const column = makeColumn(
			new Map<unknown, number>([
				[[{ name: "Logs", image: null }], 1],
				[[{ name: "Logs", image: "logs.png" }], 1],
			]),
		);

		expect(getUniqueKeys(column)).toEqual([
			{ name: "Logs", image: "logs.png", amount: 2 },
		]);
	});
});

describe("selectedFirst", () => {
	const options = [
		{ name: "Charlie" },
		{ name: "alpha" },
		{ name: "Delta" },
		{ name: "Bravo" },
	];

	it("puts selected values first, each group sorted alphabetically", () => {
		const sorted = [...options].sort(selectedFirst(["Delta", "Bravo"]));

		expect(sorted.map((o) => o.name)).toEqual([
			"Bravo",
			"Delta",
			"alpha",
			"Charlie",
		]);
	});

	it("ranks a selected value before an unselected one in either argument order", () => {
		const compare = selectedFirst(["Bravo"]);

		expect(compare({ name: "Bravo" }, { name: "alpha" })).toBe(-1);
		expect(compare({ name: "alpha" }, { name: "Bravo" })).toBe(1);
	});

	it("sorts alphabetically when nothing is selected", () => {
		const sorted = [...options].sort(selectedFirst([]));

		expect(sorted.map((o) => o.name)).toEqual([
			"alpha",
			"Bravo",
			"Charlie",
			"Delta",
		]);
	});

	it.each([
		undefined,
		null,
		"Bravo",
		{ name: "Bravo" },
	])("keeps the original order when selected values are not an array (%j)", (selectedValues) => {
		const sorted = [...options].sort(selectedFirst(selectedValues));

		expect(sorted).toEqual(options);
	});
});

describe("fuzzyMatch", () => {
	it("matches case-insensitively on a substring", () => {
		const match = fuzzyMatch("ORE");

		expect(match({ name: "Iron Ore" })).toBe(true);
		expect(match({ name: "Core Shard" })).toBe(true);
		expect(match({ name: "Logs" })).toBe(false);
	});

	it("matches everything when the filter is empty", () => {
		expect(fuzzyMatch("")({ name: "Logs" })).toBe(true);
	});

	it("never matches a non-string name", () => {
		const value = { name: 42 } as unknown as { name: string };

		expect(fuzzyMatch("")(value)).toBe(false);
		expect(fuzzyMatch("42")(value)).toBe(false);
	});
});
