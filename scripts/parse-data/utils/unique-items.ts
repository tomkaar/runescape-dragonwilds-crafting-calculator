import { SourceItem } from "@/scripts/fetch-data/types/item";
import { SourceRecipe } from "@/scripts/fetch-data/types/recipe";

export function getUniqueItems(recipes: SourceRecipe[], items: SourceItem[]) {
  const uniqueItems = new Set<string>();

  recipes.forEach((item) => {
    item.output.forEach((output) => {
      uniqueItems.add(output);
    });
  });

  items.forEach((item) => {
    // if (["Consumable", "Vestige"].includes(item.item_type)) {
    //   return;
    // }
    uniqueItems.add(item.page_name);
  });

  return uniqueItems;
}
