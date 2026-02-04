import { join } from "path";
import { mkdirSync, writeFileSync } from "fs";
import fetchAllBucketData from "./utils/fetchAllBucketData";
import { SourceRecipe } from "./types/recipe";
import { SourceItem } from "./types/item";

const INFOBOX_ITEM_SELECT_QUERY =
  "%27page_name%27,%27page_name_sub%27,%27item_name%27,%27item_type%27,%27item_repair%27,%27item_weight%27,%27item_stacklimit%27,%27item_description%27,%27perk_name%27,%27json%27";
const RECIPE_SELECT_QUERY =
  "%27uses_material%27,%27uses_facility%27,%27output%27,%27uses_skill%27,%27json%27,%27uses_recipe%27,%27json%27";

async function fetchData() {
  const [items, recipe] = await Promise.all([
    fetchAllBucketData<SourceRecipe[]>(
      "infobox_item",
      INFOBOX_ITEM_SELECT_QUERY,
    ),
    fetchAllBucketData<SourceItem[]>("recipe", RECIPE_SELECT_QUERY),
  ]);

  const dataDir = join(__dirname, "..", "..", "data", "source");
  mkdirSync(dataDir, { recursive: true });

  // Write data files
  writeFileSync(join(dataDir, "items.json"), JSON.stringify(items, null, 2));
  console.log("\n✓ Items saved to data/items.json");
  writeFileSync(join(dataDir, "recipes.json"), JSON.stringify(recipe, null, 2));
  console.log("✓ Recipes saved to data/recipes.json");
}

fetchData().catch(console.error);
