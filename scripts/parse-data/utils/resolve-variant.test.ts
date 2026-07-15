import { describe, expect, it } from "vitest";
import type { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import { resolveVariant } from "./resolve-variant";

function makeRecipe(overrides: {
	outputImage?: string;
	usesRecipe?: string[];
}): SourceRecipe {
	return {
		uses_facility: ["Smithing Forge"],
		uses_recipe: overrides.usesRecipe,
		output: ["Copper Sword"],
		json: {
			facility: "Smithing Forge",
			materials: [
				{
					name: "Copper Ore",
					quantity: 2,
					link: "",
					qty: 2,
					item: "",
					image: "",
				},
			],
			skills: [],
			outputs: [],
			output: {
				quantity: 1,
				name: "Copper Sword",
				link: "Copper Sword",
				qty: 1,
				item: "Copper Sword",
				image: overrides.outputImage ?? "[[File:Copper Sword.png|30px]]",
			},
		},
	};
}

describe("resolveVariant", () => {
	it("uses the recipe output name as the variant name", () => {
		const result = resolveVariant(makeRecipe({}));
		expect(result.name).toBe("Copper Sword");
	});

	it("extracts a variant name from the output image when present", () => {
		const result = resolveVariant(
			makeRecipe({ outputImage: "[[File:Copper Sword (Ornate).png|30px]]" }),
		);
		expect(result.variantName).toBe("Ornate");
	});

	it("has no variant name when the output image has no parenthesized suffix", () => {
		const result = resolveVariant(makeRecipe({}));
		expect(result.variantName).toBeNull();
	});

	it("resolves the image from the recipe output", () => {
		const result = resolveVariant(makeRecipe({}));
		expect(result.image).toBe("Copper Sword.png");
	});

	it("attaches the resolved recipe", () => {
		const result = resolveVariant(makeRecipe({}));
		expect(result.recipe?.materials).toEqual([
			{ itemId: "copper-ore", quantity: 2 },
		]);
	});

	it("carries uses_recipe through as usesRecipe when present", () => {
		const result = resolveVariant(makeRecipe({ usesRecipe: ["Vestige A"] }));
		expect(result.usesRecipe).toEqual(["Vestige A"]);
	});

	it("uses null for usesRecipe when there is no uses_recipe", () => {
		const result = resolveVariant(makeRecipe({}));
		expect(result.usesRecipe).toBeNull();
	});

	it("produces different ids for different variant names of the same recipe", () => {
		const plain = resolveVariant(makeRecipe({}));
		const ornate = resolveVariant(
			makeRecipe({ outputImage: "[[File:Copper Sword (Ornate).png|30px]]" }),
		);
		expect(plain.id).not.toBe(ornate.id);
	});
});
