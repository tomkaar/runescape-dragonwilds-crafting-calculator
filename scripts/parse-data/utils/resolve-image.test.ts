import { describe, expect, it, vi } from "vitest";
import type { SourceItem } from "@/scripts/fetch-data/types/item";
import type { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import { resolveImage } from "./resolve-image";

const resolveConfiguredImage = vi.fn();
vi.mock("../image-config", () => ({
	resolveConfiguredImage: (...args: unknown[]) =>
		resolveConfiguredImage(...args),
}));

function makeRecipe(outputImage: string): SourceRecipe {
	return {
		uses_facility: [],
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
				image: outputImage,
			},
		},
	};
}

function makeItem(pageName: string, rawImage: string): SourceItem {
	return {
		page_name: pageName,
		item_name: pageName,
		item_type: "",
		item_weight: 0,
		page_name_sub: "",
		json: {
			type: "",
			image: "",
			name: pageName,
			weight: "0",
			image_raw: rawImage,
		},
	};
}

describe("resolveImage", () => {
	it("prefers a configured override image", () => {
		resolveConfiguredImage.mockReturnValue("override.png");

		const result = resolveImage(
			makeRecipe("[[File:Iron Sword.png|30px]]"),
			[],
			"Iron Sword",
		);

		expect(result).toBe("override.png");
	});

	it("extracts the image filename from the recipe output when no override applies", () => {
		resolveConfiguredImage.mockReturnValue(null);

		const result = resolveImage(
			makeRecipe("[[File:Iron Sword.png|30px]]"),
			[],
			"Iron Sword",
		);

		expect(result).toBe("Iron Sword.png");
	});

	it("falls back to the matching item's raw image when the recipe has none", () => {
		resolveConfiguredImage.mockReturnValue(null);

		const result = resolveImage(
			makeRecipe(""),
			[makeItem("Iron Sword", "iron_sword_raw.png")],
			"Iron Sword",
		);

		expect(result).toBe("iron_sword_raw.png");
	});

	it("returns null when nothing resolves an image", () => {
		resolveConfiguredImage.mockReturnValue(null);

		const result = resolveImage(undefined, [], "Iron Sword");

		expect(result).toBeNull();
	});
});
