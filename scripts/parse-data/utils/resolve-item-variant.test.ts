import { describe, expect, it } from "vitest";
import type { SourceItem } from "@/scripts/fetch-data/types/item";
import { resolveItemVariant } from "./resolve-item-variant";

function makeItem(overrides: Partial<SourceItem["json"]> = {}): SourceItem {
	return {
		page_name: "Iron Ore",
		item_name: "Iron Ore",
		item_type: "Resource",
		item_weight: 1,
		page_name_sub: "",
		json: {
			type: "Resource",
			image: "",
			name: "Iron Ore",
			weight: "1",
			image_raw: "iron_ore.png",
			...overrides,
		},
	};
}

describe("resolveItemVariant", () => {
	it("builds a variant with an id derived from the item name", () => {
		const result = resolveItemVariant(makeItem());
		expect(result.id).toBe("iron-ore");
		expect(result.name).toBe("Iron Ore");
	});

	it("uses the item's raw image", () => {
		const result = resolveItemVariant(makeItem({ image_raw: "iron_ore.png" }));
		expect(result.image).toBe("iron_ore.png");
	});

	it("returns null image when there is no raw image", () => {
		const result = resolveItemVariant(makeItem({ image_raw: "" }));
		expect(result.image).toBeNull();
	});

	it("has no variant name, recipe, or usesRecipe since it isn't derived from a recipe", () => {
		const result = resolveItemVariant(makeItem());
		expect(result.variantName).toBeNull();
		expect(result.recipe).toBeNull();
		expect(result.usesRecipe).toBeNull();
	});
});
