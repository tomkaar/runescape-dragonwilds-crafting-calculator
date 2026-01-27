/* eslint-disable @typescript-eslint/no-explicit-any */

import { join } from "path";
import { mkdirSync, writeFileSync } from "fs";

const LIMIT = 500;

const BASE_URL = "https://dragonwilds.runescape.wiki/api.php";
const ACTION = "action=bucket";
const FORMAT = "format=json";

const INFOBOX_ITEM_SELECT_QUERY =
  "%27page_name%27,%27page_name_sub%27,%27item_name%27,%27item_type%27,%27item_repair%27,%27item_weight%27,%27item_stacklimit%27,%27item_description%27,%27perk_name%27,%27json%27";
const RECIPE_SELECT_QUERY =
  "%27uses_material%27,%27uses_facility%27,%27output%27,%27uses_skill%27,%27json%27,%27uses_recipe%27,%27json%27";

async function fetchAllBucketData(bucketName: string, selectQuery: string) {
  let offset = 0;
  let allData: any[] = [];
  let hasMore = true;

  while (hasMore) {
    const query = `select(${selectQuery}).limit(${LIMIT}).offset(${offset})`;
    const url = `${BASE_URL}?${ACTION}&query=bucket(%27${bucketName}%27).${query}.run()&${FORMAT}`;

    console.log(`Fetching ${bucketName} with offset ${offset}...`);

    const response = await fetch(url);
    const data = await response.json();

    const items = data.bucket.map((b: any) => ({
      ...b,
      json: b.json ? JSON.parse(b.json) : undefined,
    }));

    allData = [...allData, ...items];

    // If we got exactly LIMIT items, there might be more
    if (items.length === LIMIT) {
      offset += LIMIT;
      hasMore = true;
    } else {
      hasMore = false;
    }
  }

  console.log(`Total ${bucketName} fetched: ${allData.length}`);
  return allData;
}

async function scrapeData() {
  const [items, recipe]: [InfoboxItem[], Recipe[]] = await Promise.all([
    fetchAllBucketData("infobox_item", INFOBOX_ITEM_SELECT_QUERY),
    fetchAllBucketData("recipe", RECIPE_SELECT_QUERY),
  ]);

  const dataDir = join(__dirname, "..", "data");
  mkdirSync(dataDir, { recursive: true });

  // Write data files
  writeFileSync(join(dataDir, "items.json"), JSON.stringify(items, null, 2));
  writeFileSync(join(dataDir, "recipes.json"), JSON.stringify(recipe, null, 2));
}

scrapeData().catch(console.error);
