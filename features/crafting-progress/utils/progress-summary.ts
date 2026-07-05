import { type OwnedMaterialEntry } from "../types/owned-material-entry";

export type ProgressSummary = {
  readyCount: number;
  totalNeeded: number;
  totalOwned: number;
  percentComplete: number;
};

/** Summarizes overall progress across a set of owned-material rows. */
export function buildProgressSummary(
  ownedRows: OwnedMaterialEntry[],
  owned: Record<string, number>,
): ProgressSummary {
  const readyCount = ownedRows.filter(
    (row) => (owned[row.itemId] ?? 0) >= row.needed,
  ).length;
  const totalNeeded = ownedRows.reduce((sum, row) => sum + row.needed, 0);
  const totalOwned = ownedRows.reduce(
    (sum, row) => sum + Math.min(owned[row.itemId] ?? 0, row.needed),
    0,
  );
  const percentComplete =
    totalNeeded === 0 ? 100 : Math.round((totalOwned / totalNeeded) * 100);

  return { readyCount, totalNeeded, totalOwned, percentComplete };
}
