import * as fs from "fs";
import { join } from "path";
// import groupRecipesByOutput from "../utils/groupRecipesByOutput";
import { SourceRecipe } from "../fetch-data/types/recipe";
import { SourceItem } from "../fetch-data/types/item";
import listItems from "./utils/list-items";

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

  const recipes = JSON.parse(loadedRecipes) as unknown as SourceRecipe[];
  const items = JSON.parse(loadedItems) as unknown as SourceItem[];

  console.log(`Loaded recipes from data/source/recipes.json`);
  console.log(`Loaded items from data/source/items.json`);

  const listedItems = listItems(recipes, items);

  fs.writeFileSync(
    join(dataDir, "items.json"),
    JSON.stringify(listedItems, null, 2),
  );
  console.log(`Created file: data/items.json`);
}

parseData().catch(console.error);
