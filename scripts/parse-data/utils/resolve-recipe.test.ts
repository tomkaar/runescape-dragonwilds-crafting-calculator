import { describe, expect, it } from "vitest";
import type { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import { resolveRecipe } from "./resolve-recipe";

function makeRecipe(overrides: {
	facility?: string;
	materials?: { name: string; quantity: string | number }[];
	outputItem?: string;
	outputName?: string;
	outputQuantity?: string | number;
}): SourceRecipe {
	const materials = overrides.materials ?? [];
	return {
		uses_facility: overrides.facility ? [overrides.facility] : [],
		output: [overrides.outputName ?? "Iron Sword"],
		json: {
			facility: overrides.facility ?? "Smithing Forge",
			materials: materials.map((mat) => ({
				name: mat.name,
				quantity: mat.quantity,
				link: mat.name,
				qty: mat.quantity,
				item: mat.name,
				image: "",
			})),
			skills: [],
			outputs: [],
			output: {
				quantity: overrides.outputQuantity ?? 1,
				name: overrides.outputName ?? "Iron Sword",
				link: overrides.outputName ?? "Iron Sword",
				qty: overrides.outputQuantity ?? 1,
				item: overrides.outputItem ?? overrides.outputName ?? "Iron Sword",
				image: "",
			},
		},
	};
}

describe("resolveRecipe", () => {
	it("uses a numeric output quantity as-is", () => {
		const result = resolveRecipe(makeRecipe({ outputQuantity: 3 }));
		expect(result.quantity).toBe(3);
	});

	it("parses a string output quantity", () => {
		const result = resolveRecipe(makeRecipe({ outputQuantity: "5" }));
		expect(result.quantity).toBe(5);
	});

	it("defaults to 1 when the output quantity is zero", () => {
		const result = resolveRecipe(makeRecipe({ outputQuantity: 0 }));
		expect(result.quantity).toBe(1);
	});

	it("defaults to 1 when the string output quantity doesn't parse", () => {
		const result = resolveRecipe(
			makeRecipe({ outputQuantity: "not-a-number" }),
		);
		expect(result.quantity).toBe(1);
	});

	it("maps materials to ids and quantities, sorted by name", () => {
		const result = resolveRecipe(
			makeRecipe({
				materials: [
					{ name: "Wood", quantity: 2 },
					{ name: "Iron Ore", quantity: "3" },
				],
			}),
		);

		expect(result.materials).toEqual([
			{ itemId: "iron-ore", quantity: 3 },
			{ itemId: "wood", quantity: 2 },
		]);
	});

	it("defaults a material's quantity to 1 when zero or unparsable", () => {
		const result = resolveRecipe(
			makeRecipe({ materials: [{ name: "Wood", quantity: "abc" }] }),
		);
		expect(result.materials[0].quantity).toBe(1);
	});

	it("applies facility name overrides and wraps the facility in an array", () => {
		const result = resolveRecipe(makeRecipe({ facility: "Anvil" }));
		expect(result.facilities).toEqual(["Smithing Anvil"]);
	});

	it("returns an empty facilities array when there is no facility", () => {
		const result = resolveRecipe(makeRecipe({ facility: "" }));
		expect(result.facilities).toEqual([]);
	});

	it("produces a stable id for the same inputs", () => {
		const recipe = makeRecipe({ outputName: "Iron Sword", outputQuantity: 1 });
		expect(resolveRecipe(recipe).id).toBe(resolveRecipe(recipe).id);
	});

	it("produces a different id when the output quantity differs", () => {
		const a = resolveRecipe(makeRecipe({ outputQuantity: 1 }));
		const b = resolveRecipe(makeRecipe({ outputQuantity: 2 }));
		expect(a.id).not.toBe(b.id);
	});
});
