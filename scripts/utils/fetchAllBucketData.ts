/* eslint-disable @typescript-eslint/no-explicit-any */

const LIMIT = 500;

const BASE_URL = "https://dragonwilds.runescape.wiki/api.php";
const ACTION = "action=bucket";
const FORMAT = "format=json";

export default async function fetchAllBucketData(
  bucketName: string,
  selectQuery: string,
): Promise<any[]> {
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
