import { cache } from "react";

const url = new URL(
  "https://api.github.com/repos/tomkaar/runescape-dragonwilds-crafting-calculator/actions/workflows/update-data.yml/runs",
);
url.searchParams.set("status", "completed");
url.searchParams.set("per_page", "1");

export const lastSynced = cache(async function lastSynced(): Promise<
  string | null
> {
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.workflow_runs[0].updated_at as string;
  } catch (error) {
    console.error("Error fetching last synced date:", error);
    return null;
  }
});
