import { writeFileSync } from "fs";
import { join } from "path";

const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

const metadata = { lastUpdated: today };

writeFileSync(
  join(process.cwd(), "data/last-updated.json"),
  JSON.stringify(metadata, null, 2) + "\n",
);

console.log(`Generated last-updated.json: ${today}`);
