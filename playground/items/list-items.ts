import { Item, ItemVariant } from "@/Types";
import { writeFileSync } from "fs";
import path from "path";
import { createImageUrlPath, extractImageFilename } from "./utils/image";
import { resolveVariant as resolveRecipeVariant } from "./utils/resolveVariant";
import { itemIdFromName } from "./utils/itemIdFromName";
import { resolveItemVariant } from "./utils/resolveItemVariant";

async function listItems() {
  const { default: recipeData } = await import("../recipes.json");
  const { default: itemsData } = await import("../items.json");

  /**
   * Collect unique item names
   */
  const uniqueItems = new Set<string>();

  recipeData.forEach((item) => {
    item.output.forEach((output) => {
      uniqueItems.add(output);
    });
  });

  itemsData.forEach((item) => {
    // if (["Consumable", "Vestige"].includes(item.item_type)) {
    //   return;
    // }
    uniqueItems.add(item.page_name);
  });

  /**
   * Build items with variants and recipes
   */

  const finishedItems: Item[] = [];

  uniqueItems.forEach((itemName) => {
    const rawRecipes = recipeData.filter((item) =>
      item.output.includes(itemName),
    );
    const rawItems = itemsData.filter((item) => item.page_name === itemName);

    /**
     * Resolve variants for item
     */
    const variants: ItemVariant[] = [];
    rawRecipes.forEach((recipeVariant) => {
      const parsedVariant = resolveRecipeVariant(recipeVariant);
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

    const itemToBePushed: Item = {
      id: itemIdFromName(itemName),
      name: itemName,
      image: resolveImage(rawRecipes[0], rawItems, itemName),
      variants: variants,
    };
    finishedItems.push(itemToBePushed);
  });

  /**
   * Save items to items.json
   */

  writeFileSync(
    path.join(__dirname, "items.json"),
    JSON.stringify(finishedItems, null, 2),
  );
  console.log("✓ Items saved to items.json");
}

listItems().catch(console.error);

/**
 * Resolve image for item, with fallback to items data if not found in recipe
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveImage(firstRecipe: any, items: any[], itemName: string) {
  let image = extractImageFilename(firstRecipe?.json.output.image || "");
  if (image === null) {
    image = items.find((i) => i.page_name === itemName)?.json.image_raw || null;
  }
  if (image) {
    image = createImageUrlPath(image || "");
  } else {
    console.warn("No image found for item after fallback:", itemName);
  }
  return image;
}
