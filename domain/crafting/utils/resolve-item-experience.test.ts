import { describe, expect, it } from "vitest";
import type { Recipe } from "@/Types";
import { makeRecipe, makeVariant } from "@/test/crafting-helpers";
import { resolveItemExperience } from "./resolve-item-experience";

function skill(name: string, experience: number): Recipe["skills"] {
	return [{ name: name as Recipe["skills"][number]["name"], experience }];
}

describe("resolveItemExperience", () => {
	it("returns null when no variant has a recipe", () => {
		expect(resolveItemExperience([makeVariant(null)])).toBeNull();
	});

	it("returns null when the recipe grants no skill experience", () => {
		const variant = makeVariant(makeRecipe(1, [], [], []));

		expect(resolveItemExperience([variant])).toBeNull();
	});

	it("returns null when the only recipe grants 0 experience", () => {
		const variant = makeVariant(makeRecipe(1, [], [], skill("Cooking", 0)));

		expect(resolveItemExperience([variant])).toBeNull();
	});

	it("returns a single-value range when only one variant grants experience", () => {
		const variant = makeVariant(makeRecipe(1, [], [], skill("Cooking", 12)));

		expect(resolveItemExperience([variant])).toEqual({
			skill: "Cooking",
			min: 12,
			max: 12,
		});
	});

	it("returns the min and max across variants with different experience", () => {
		const variants = [
			makeVariant(makeRecipe(1, [], [], skill("Construction", 4))),
			makeVariant(makeRecipe(1, [], [], skill("Construction", 6))),
			makeVariant(makeRecipe(1, [], [], skill("Construction", 8))),
		];

		expect(resolveItemExperience(variants)).toEqual({
			skill: "Construction",
			min: 4,
			max: 8,
		});
	});

	it("excludes 0-experience variants from the range instead of pulling the min down to 0", () => {
		const variants = [
			makeVariant(makeRecipe(1, [], [], skill("Construction", 4))),
			makeVariant(makeRecipe(1, [], [], skill("Construction", 6))),
			makeVariant(makeRecipe(1, [], [], skill("Construction", 8))),
			makeVariant(makeRecipe(1, [], [], skill("Construction", 0))),
		];

		expect(resolveItemExperience(variants)).toEqual({
			skill: "Construction",
			min: 4,
			max: 8,
		});
	});

	it("does not normalize by recipe quantity — a batch recipe's raw XP is used as-is", () => {
		const variant = makeVariant(
			makeRecipe(10, [], [], skill("Runecrafting", 50)),
		);

		expect(resolveItemExperience([variant])).toEqual({
			skill: "Runecrafting",
			min: 50,
			max: 50,
		});
	});

	it("ignores variants with no recipe when others in the same item do have one", () => {
		const variants = [
			makeVariant(null),
			makeVariant(makeRecipe(1, [], [], skill("Farming", 5))),
		];

		expect(resolveItemExperience(variants)).toEqual({
			skill: "Farming",
			min: 5,
			max: 5,
		});
	});
});
