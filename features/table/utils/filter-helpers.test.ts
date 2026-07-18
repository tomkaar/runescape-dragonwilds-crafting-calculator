import type { Column } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import type { TableBodyRowType } from "../types/table-body-row";
import { getUniqueKeys } from "./filter-helpers";

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
});
