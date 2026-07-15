import { describe, expect, it } from "vitest";
import type { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import { resolveFacilities } from "./resolve-facility";

function makeRecipe(usesFacility: (string | null)[]): SourceRecipe {
	return {
		uses_facility: usesFacility as string[],
		output: ["Iron Sword"],
		json: {
			facility: usesFacility[0] ?? "",
			materials: [],
			skills: [],
			outputs: [],
			output: {
				quantity: 1,
				name: "Iron Sword",
				link: "",
				qty: 1,
				item: "",
				image: "",
			},
		},
	};
}

describe("resolveFacilities", () => {
	it("returns an empty array when there are no recipes", () => {
		expect(resolveFacilities([])).toEqual([]);
	});

	it("collects facilities from a single recipe", () => {
		const result = resolveFacilities([makeRecipe(["Smithing Forge"])]);
		expect(result).toEqual(["Smithing Forge"]);
	});

	it("dedupes facilities shared across recipes", () => {
		const result = resolveFacilities([
			makeRecipe(["Smithing Forge"]),
			makeRecipe(["Smithing Forge"]),
		]);
		expect(result).toEqual(["Smithing Forge"]);
	});

	it("applies facility name overrides", () => {
		const result = resolveFacilities([makeRecipe(["Anvil"])]);
		expect(result).toEqual(["Smithing Anvil"]);
	});

	it("skips null entries in uses_facility", () => {
		const result = resolveFacilities([makeRecipe([null, "Furnace"])]);
		expect(result).toEqual(["Furnace"]);
	});
});
