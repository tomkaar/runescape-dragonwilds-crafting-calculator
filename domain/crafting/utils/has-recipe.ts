import type { Item } from "@/Types";

/** Whether any variant of the item can be crafted. Items without a recipe (raw materials, drops) have no crafting tree to track. */
export function hasRecipe(item: Pick<Item, "variants">): boolean {
	return item.variants.some((variant) => variant.recipe !== null);
}
