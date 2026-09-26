import { describe, expect, it } from "vitest";
import { makeItem, makeRecipe, makeVariant } from "@/test/crafting-helpers";
import { hasRecipe } from "./has-recipe";

describe("hasRecipe", () => {
	it("returns false when the item has no variants", () => {
		expect(hasRecipe(makeItem("stone"))).toBe(false);
	});

	it("returns false when no variant has a recipe", () => {
		expect(hasRecipe(makeItem("stone", [makeVariant(null)]))).toBe(false);
	});

	it("returns true when at least one variant has a recipe", () => {
		const item = makeItem("wall", [
			makeVariant(null),
			makeVariant(makeRecipe()),
		]);

		expect(hasRecipe(item)).toBe(true);
	});
});
