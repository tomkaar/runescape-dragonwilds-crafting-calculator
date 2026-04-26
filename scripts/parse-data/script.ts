import * as fs from "fs";
import { join } from "path";
import { SourceRecipe } from "../fetch-data/types/recipe";
import { SourceItem } from "../fetch-data/types/item";
import listItems from "./utils/list-items";
import { applyFacilityNameOverride } from "./utils/apply-facility-name-override";
import { idFromName } from "./utils/id-from-name";

async function parseData() {
  const dataDir = join(__dirname, "..", "..", "data");
  const dataSourceDir = join(__dirname, "..", "..", "data", "source");

  const loadedRecipes = fs.readFileSync(
    join(dataSourceDir, "recipes.json"),
    "utf-8",
  );
  const loadedItems = fs.readFileSync(
    join(dataSourceDir, "items.json"),
    "utf-8",
  );

  if (!loadedRecipes || !loadedItems) {
    throw new Error("Failed to load data files. Have you run fetch-data?");
  }

  const recipes = (JSON.parse(loadedRecipes) as unknown as SourceRecipe[]).map(
    normalizeRecipe,
  );
  const items = (JSON.parse(loadedItems) as unknown as SourceItem[]).map(
    normalizeItem,
  );

  console.log(`Loaded recipes from data/source/recipes.json`);
  console.log(`Loaded items from data/source/items.json`);

  const listedItems = listItems(recipes, items);

  fs.writeFileSync(
    join(dataDir, "items.json"),
    JSON.stringify(listedItems, null, 2),
  );
  console.log(`Created file: data/items.json`);

  // Collect all unique facilities from every recipe
  const facilitiesSet = new Set<string>();
  recipes.forEach((recipe) => {
    recipe.uses_facility?.forEach((facility) => {
      if (facility) {
        facilitiesSet.add(applyFacilityNameOverride(facility));
      }
    });
  });

  const facilities = Array.from(facilitiesSet)
    .sort()
    .map((name) => ({ id: idFromName(name), name }));

  fs.writeFileSync(
    join(dataDir, "facilities.json"),
    JSON.stringify(facilities, null, 2),
  );
  console.log(
    `Created file: data/facilities.json (${facilities.length} facilities)`,
  );
}

parseData().catch(console.error);

function normalizeName(name: string): string {
  return name.replace(/\s+/g, " ").trim();
}

function normalizeRecipe(recipe: SourceRecipe): SourceRecipe {
  return {
    ...recipe,
    output: recipe.output.map(normalizeName),
    uses_material: recipe.uses_material?.map(normalizeName),
    json: {
      ...recipe.json,
      output: {
        ...recipe.json.output,
        name: normalizeName(recipe.json.output.name),
        link: normalizeName(recipe.json.output.link),
        item: normalizeName(recipe.json.output.item),
      },
      materials: recipe.json.materials.map((mat) => ({
        ...mat,
        name: normalizeName(mat.name),
        link: normalizeName(mat.link),
        item: normalizeName(mat.item),
      })),
    },
  };
}

function normalizeItem(item: SourceItem): SourceItem {
  return {
    ...item,
    page_name: normalizeName(item.page_name),
    item_name: normalizeName(item.item_name),
  };
}
