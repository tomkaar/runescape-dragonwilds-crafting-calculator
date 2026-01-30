import { join } from "path";
import { mkdirSync, writeFileSync } from "fs";
import groupRecipesByOutput from "./utils/groupRecipesByOutput";
import { InfoboxItem, Recipe } from "./utils/types";
import fetchAllBucketData from "./utils/fetchAllBucketData";

const INFOBOX_ITEM_SELECT_QUERY =
  "%27page_name%27,%27page_name_sub%27,%27item_name%27,%27item_type%27,%27item_repair%27,%27item_weight%27,%27item_stacklimit%27,%27item_description%27,%27perk_name%27,%27json%27";
const RECIPE_SELECT_QUERY =
  "%27uses_material%27,%27uses_facility%27,%27output%27,%27uses_skill%27,%27json%27,%27uses_recipe%27,%27json%27";

async function scrapeItem() {
  const [items, recipe]: [InfoboxItem[], Recipe[]] = await Promise.all([
    fetchAllBucketData("infobox_item", INFOBOX_ITEM_SELECT_QUERY),
    fetchAllBucketData("recipe", RECIPE_SELECT_QUERY),
  ]);

  const dataDir = join(__dirname, "..", "data");
  mkdirSync(dataDir, { recursive: true });

  // Write data files
  writeFileSync(join(dataDir, "items.json"), JSON.stringify(items, null, 2));
  writeFileSync(join(dataDir, "recipes.json"), JSON.stringify(recipe, null, 2));

  // Group recipes by output name with variants
  const groupedRecipes = groupRecipesByOutput(recipe);
  writeFileSync(
    join(__dirname, "..", "data", "recipes.json"),
    JSON.stringify(groupedRecipes, null, 2),
  );
  console.log("✓ Grouped recipes saved to data/recipes.json");

  // Write facility types
  const facilityTypes = Array.from(
    new Set(
      recipe
        .map((r) => r.json?.facility)
        .filter((f): f is string => typeof f === "string"),
    ),
  ).sort();
  writeFileSync(
    join(__dirname, "..", "data", "facilityTypes.json"),
    JSON.stringify(facilityTypes, null, 2),
  );
  console.log("✓ Facility types saved to data/facilityTypes.json");
}

scrapeItem().catch(console.error);
