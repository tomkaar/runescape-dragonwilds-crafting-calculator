import type { Item, ItemVariant, Recipe } from "@/Types";

/** Minimal Item fixture. Name is derived from id so tests can assert it without storing a separate constant. */
export function makeItem(id: string, variants: ItemVariant[] = []): Item {
    return { id, name: `${id}-name`, image: null, variants, facilities: [] };
}

/** Minimal ItemVariant fixture. Pass a Recipe to simulate a craftable variant; null gives a raw-material leaf. */
export function makeVariant(recipe: Recipe | null = null): ItemVariant {
    return { id: "v1", name: "Variant", image: null, variantName: null, recipe, usesRecipe: null };
}

/** Minimal Recipe fixture. quantity controls how many the recipe produces per craft, which drives multiplier and excess-item logic. */
export function makeRecipe(quantity = 1, materials: Recipe["materials"] = [], facilities: Recipe["facilities"] = []): Recipe {
    return { id: "r1", facilities, quantity, materials };
}
