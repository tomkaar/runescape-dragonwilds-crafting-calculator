import { describe, expect, it } from "vitest";
import type { SourceItem } from "@/scripts/fetch-data/types/item";
import type { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import { getUniqueItems } from "./unique-items";

function makeRecipe(outputs: string[]): SourceRecipe {
	return {
		uses_facility: [],
		output: outputs,
		json: {
			facility: "",
			materials: [],
			skills: [],
			outputs: [],
			output: {
				quantity: 1,
				name: outputs[0] ?? "",
				link: "",
				qty: 1,
				item: "",
				image: "",
			},
		},
	};
}

function makeItem(pageName: string): SourceItem {
	return {
		page_name: pageName,
		item_name: pageName,
		item_type: "",
		item_weight: 0,
		page_name_sub: "",
		json: { type: "", image: "", name: pageName, weight: "0", image_raw: "" },
	};
}

describe("getUniqueItems", () => {
	it("collects recipe outputs and item page names", () => {
		const result = getUniqueItems(
			[makeRecipe(["Iron Sword"])],
			[makeItem("Iron Ore")],
		);
		expect(result).toEqual(new Set(["Iron Sword", "Iron Ore"]));
	});

	it("dedupes names shared between recipes and items", () => {
		const result = getUniqueItems(
			[makeRecipe(["Iron Sword"])],
			[makeItem("Iron Sword")],
		);
		expect(result).toEqual(new Set(["Iron Sword"]));
	});

	it("includes every output when a recipe has multiple outputs", () => {
		const result = getUniqueItems(
			[makeRecipe(["Iron Sword", "Iron Shield"])],
			[],
		);
		expect(result).toEqual(new Set(["Iron Sword", "Iron Shield"]));
	});

	it("returns an empty set for no recipes or items", () => {
		expect(getUniqueItems([], [])).toEqual(new Set());
	});
});
