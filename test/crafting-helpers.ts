import type { Item, ItemVariant, Recipe } from "@/Types";

/** Minimal Item fixture. Name defaults to a value derived from id so tests can assert it without storing a separate constant; pass name to override when a test needs a specific display name. */
export function makeItem(
	id: string,
	variants: ItemVariant[] = [],
	name: string = `${id}-name`,
): Item {
	return { id, name, image: null, variants, facilities: [] };
}

/** Minimal ItemVariant fixture. Pass a Recipe to simulate a craftable variant; null gives a raw-material leaf. */
export function makeVariant(recipe: Recipe | null = null): ItemVariant {
	return {
		id: "v1",
		name: "Variant",
		image: null,
		variantName: null,
		recipe,
		usesRecipe: null,
	};
}

/** Minimal Recipe fixture. quantity controls how many the recipe produces per craft, which drives multiplier and excess-item logic. */
export function makeRecipe(
	quantity = 1,
	materials: Recipe["materials"] = [],
	facilities: Recipe["facilities"] = [],
	skills: Recipe["skills"] = [],
	id = "r1",
): Recipe {
	return { id, facilities, quantity, materials, skills };
}
