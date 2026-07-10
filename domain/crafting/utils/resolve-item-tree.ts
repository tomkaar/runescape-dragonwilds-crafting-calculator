import { sourceItemById } from "@/utils/source-item-by-id";
import { cache } from "react";
import { type ResolvedItem } from "../types/resolved-item";

/**
 * Recursively resolves the crafting tree for a given item, returning a hierarchical structure of ResolvedItems.
 * Each ResolvedItem contains the item, variant, quantities, facilities, and its children.
 * @param itemId The ID of the item to resolve.
 * @param quantityNeeded The quantity of the item needed.
 * @param isRoot Indicates if this is the root call (used for excess item calculation).
 * @returns An array of ResolvedItems representing the crafting tree for the given item.
 */
function resolveItemTreeInternal(
  itemId: string,
  quantityNeeded: number,
  isRoot: boolean,
): ResolvedItem[] {
  const item = sourceItemById(itemId);
  if (!item || item.variants.length === 0) return [];

  const multipleVariants = item.variants.length > 1;

  return item.variants.map((variant, idx) => {
    const recipeWillCreateQuantity = variant.recipe?.quantity || 1;
    const recipeMultiplier = Math.ceil(quantityNeeded / recipeWillCreateQuantity);
    const quantityRecieved = recipeMultiplier * recipeWillCreateQuantity;

    const children: ResolvedItem[] = [];
    for (const mat of variant.recipe?.materials ?? []) {
      const subItems = resolveItemTreeInternal(
        mat.itemId,
        mat.quantity * recipeMultiplier,
        false,
      );
      children.push(...subItems);
    }

    return {
      item,
      variant,
      variantIndex: multipleVariants ? idx : null,
      quantityNeeded,
      quantityRecieved,
      hasExcessItems: !isRoot && quantityRecieved > quantityNeeded,
      facilities: variant.recipe?.facilities ?? [],
      isLeaf: children.length === 0,
      children,
    };
  });
}

/**
 * Resolves the crafting tree for a given item, returning a hierarchical structure of ResolvedItems.
 * Each ResolvedItem contains the item, variant, quantities, facilities, and its children.
 * @param itemId The ID of the item to resolve.
 * @param quantityNeeded The quantity of the item needed. Defaults to 1.
 * @returns An array of ResolvedItems representing the crafting tree for the given item.
 */
export const resolveItemTree = cache(
  (itemId: string, quantityNeeded = 1): ResolvedItem[] =>
    resolveItemTreeInternal(itemId, quantityNeeded, true),
);
