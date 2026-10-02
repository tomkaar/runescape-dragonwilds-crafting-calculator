import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { SourceItem } from "./types/item";
import type { SourceRecipe } from "./types/recipe";
import type { SourceStoreline } from "./types/storeline";
import { fetchAllBucketData } from "./utils/fetch-all-bucket-data";

const INFOBOX_ITEM_FIELDS = [
	"page_name",
	"page_name_sub",
	"item_name",
	"item_type",
	"item_weight",
	"item_stacklimit",
	"item_description",
	"perk_name",
	"json",
];
const RECIPE_FIELDS = [
	"uses_material",
	"uses_facility",
	"output",
	"uses_skill",
	"uses_recipe",
	"json",
];
const STORELINE_FIELDS = [
	"page_name",
	"page_name_sub",
	"sold_item",
	"sold_item_json",
];

async function fetchData() {
	const [items, recipes, storelines] = await Promise.all([
		fetchAllBucketData<SourceItem>("infobox_item", INFOBOX_ITEM_FIELDS),
		fetchAllBucketData<SourceRecipe>("recipe", RECIPE_FIELDS),
		fetchAllBucketData<SourceStoreline>("storeline", STORELINE_FIELDS),
	]);

	const dataDir = join(__dirname, "..", "..", "data", "source");
	mkdirSync(dataDir, { recursive: true });

	// Write data files
	writeFileSync(join(dataDir, "items.json"), JSON.stringify(items, null, 2));
	console.log("\n✓ Items saved to data/source/items.json");
	writeFileSync(
		join(dataDir, "recipes.json"),
		JSON.stringify(recipes, null, 2),
	);
	console.log("✓ Recipes saved to data/source/recipes.json");
	writeFileSync(
		join(dataDir, "storelines.json"),
		JSON.stringify(
			storelines.map((storeline) => ({
				...storeline,
				json: JSON.parse(storeline.sold_item_json || "{}"),
			})),
			null,
			2,
		),
	);
	console.log("✓ Storelines saved to data/source/storelines.json");
}

fetchData().catch(console.error);
