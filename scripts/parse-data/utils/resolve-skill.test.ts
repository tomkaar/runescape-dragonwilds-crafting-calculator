import { describe, expect, it } from "vitest";
import type { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import { resolveSkills } from "./resolve-skill";

function makeRecipe(usesSkill?: (string | null)[]): SourceRecipe {
	return {
		uses_facility: [],
		uses_skill: usesSkill as string[] | undefined,
		output: ["Iron Sword"],
		json: {
			facility: "",
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

describe("resolveSkills", () => {
	it("returns an empty array when there are no recipes", () => {
		expect(resolveSkills([])).toEqual([]);
	});

	it("collects skills from a single recipe", () => {
		const result = resolveSkills([makeRecipe(["Smithing"])]);
		expect(result).toEqual(["Smithing"]);
	});

	it("dedupes skills shared across recipes", () => {
		const result = resolveSkills([
			makeRecipe(["Cooking"]),
			makeRecipe(["Cooking"]),
		]);
		expect(result).toEqual(["Cooking"]);
	});

	it("skips null entries in uses_skill", () => {
		const result = resolveSkills([makeRecipe([null, "Farming"])]);
		expect(result).toEqual(["Farming"]);
	});

	it("returns an empty array when a recipe has no uses_skill", () => {
		expect(resolveSkills([makeRecipe(undefined)])).toEqual([]);
	});
});
