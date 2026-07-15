import { describe, expect, it, vi } from "vitest";
import type { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import { resolveConfiguredImage } from "./image-config";

vi.mock("./overrides/items.image.overrides", () => ({
	itemImageOverrides: [
		{ itemName: "Iron Ore", image: "iron_ore_override.png" },
	],
}));

vi.mock("./overrides/recipes.image.overrides", () => ({
	recipeImageOverrides: [
		{ output: "Wall", usesMaterial: ["Stone"], image: "stone_wall.png" },
		{ output: "Wall", usesMaterial: ["Wood"], image: "wood_wall.png" },
		{ output: "Torch", image: "torch.png" },
	],
}));

function makeRecipe(
	outputName: string,
	materials: string[],
	usesMaterial?: string[],
): SourceRecipe {
	return {
		uses_facility: [],
		uses_material: usesMaterial,
		output: [outputName],
		json: {
			facility: "",
			materials: materials.map((name) => ({
				name,
				quantity: 1,
				link: "",
				qty: 1,
				item: "",
				image: "",
			})),
			skills: [],
			outputs: [],
			output: {
				quantity: 1,
				name: outputName,
				link: "",
				qty: 1,
				item: "",
				image: "",
			},
		},
	};
}

describe("resolveConfiguredImage", () => {
	it("returns null when neither a recipe nor an item name is given", () => {
		expect(resolveConfiguredImage()).toBeNull();
	});

	it("matches an item override by name when there is no recipe", () => {
		expect(resolveConfiguredImage(undefined, "Iron Ore")).toBe(
			"iron_ore_override.png",
		);
	});

	it("is case-insensitive when matching item overrides", () => {
		expect(resolveConfiguredImage(undefined, "iron ore")).toBe(
			"iron_ore_override.png",
		);
	});

	it("returns null when the item name has no override and there is no recipe", () => {
		expect(resolveConfiguredImage(undefined, "Copper Ore")).toBeNull();
	});

	it("matches a recipe override with no material constraint", () => {
		const recipe = makeRecipe("Torch", ["Stick"]);
		expect(resolveConfiguredImage(recipe)).toBe("torch.png");
	});

	it("matches a recipe override by output and required materials", () => {
		const recipe = makeRecipe("Wall", ["Stone"], ["Stone"]);
		expect(resolveConfiguredImage(recipe)).toBe("stone_wall.png");
	});

	it("picks the override matching a different material set for the same output", () => {
		const recipe = makeRecipe("Wall", ["Wood"], ["Wood"]);
		expect(resolveConfiguredImage(recipe)).toBe("wood_wall.png");
	});

	it("falls back to the item override when no recipe override matches the materials", () => {
		const recipe = makeRecipe("Wall", ["Clay"], ["Clay"]);
		expect(resolveConfiguredImage(recipe, "Iron Ore")).toBe(
			"iron_ore_override.png",
		);
	});

	it("returns null when nothing matches", () => {
		const recipe = makeRecipe("Fence", ["Wood"], ["Wood"]);
		expect(resolveConfiguredImage(recipe)).toBeNull();
	});

	it("falls back to uses_material when computing the material set", () => {
		const recipe = makeRecipe("Wall", [], ["Stone"]);
		expect(resolveConfiguredImage(recipe)).toBe("stone_wall.png");
	});

	it("returns null when the recipe has no output name", () => {
		const recipe = makeRecipe("", ["Stone"]);
		recipe.json.output.name = "";
		recipe.output = [];
		expect(resolveConfiguredImage(recipe)).toBeNull();
	});
});
