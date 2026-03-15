import { Item, ItemVariant } from "@/Types";

import { type SourceItem } from "@/scripts/fetch-data/types/item";
import { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import { getUniqueItems } from "./unique-items";
import { resolveImage } from "./resolve-image";
import { resolveFacilities } from "./resolve-facility";
import { resolveSkills } from "./resolve-skill";
import { idFromName } from "./id-from-name";
import { resolveItemVariant } from "./resolve-item-variant";
import { resolveVariant } from "./resolve-variant";

export default function listItems(
  recipes: SourceRecipe[],
  items: SourceItem[],
) {
  const uniqueItems = getUniqueItems(recipes, items);
  console.log(`Found ${uniqueItems.size} unique items`);

  /**
   * Build items with variants and recipes
   */
  const finishedItems: Item[] = [];

  uniqueItems.forEach((itemName) => {
    const rawRecipes = recipes.filter((item) => item.output.includes(itemName));
    const rawItems = items.filter((item) => item.page_name === itemName);

    /**
     * Resolve variants for item
     */
    const variants: ItemVariant[] = [];
    rawRecipes.forEach((recipeVariant) => {
      const parsedVariant = resolveVariant(recipeVariant);
      if (parsedVariant) {
        variants.push(parsedVariant);
      }
    });

    if (variants.length === 0) {
      rawItems.forEach((itemVariant) => {
        const parsedVariant = resolveItemVariant(itemVariant);
        if (parsedVariant) {
          variants.push(parsedVariant);
        }
      });
    }

    const finishedItem: Item = {
      id: idFromName(itemName),
      name: itemName,
      image: resolveImage(rawRecipes[0], rawItems, itemName),
      variants: variants,
      skills: resolveSkills(rawRecipes),
      facilities: resolveFacilities(rawRecipes),
      wikiLink:
        rawRecipes[0]?.json.output.link.replaceAll(" ", "_") ||
        rawItems[0]?.page_name.replaceAll(" ", "_") ||
        undefined,
      weight: rawItems[0]?.item_weight ?? undefined,
    };
    finishedItems.push(finishedItem);
  });

  return finishedItems;
}
