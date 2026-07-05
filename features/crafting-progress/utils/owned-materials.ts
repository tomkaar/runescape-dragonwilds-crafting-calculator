import { resolveMaterialsTree } from "@/features/materials-tree/utils/resolve-materials-tree";
import { type SelectedMaterial } from "@/store/selected-material";
import { sourceItemById } from "@/utils/source-item-by-id";
import { type OwnedMaterialEntry } from "../types/owned-material-entry";
import { flattenQuantities } from "./flatten-quantities";

type Params = {
  /** Ids of the items the user is currently tracking. */
  trackedItemIds: string[];
  /** All marked material entries from the store, keyed by tracked item id. */
  allItems: Record<string, SelectedMaterial[]>;
  /** Per-tracked-item quantity multipliers (defaults to 1 when absent). */
  multipliers: Record<string, number>;
};

/**
 * Aggregates marked materials across all tracked items into per-material totals.
 *
 * For each tracked item, the function resolves its material tree (respecting the
 * multiplier), then sums the needed quantity for every material the user has
 * marked — regardless of TODO/DONE state. Materials that appear in multiple
 * tracked items are merged into a single entry with a combined `needed` count.
 *
 * @returns One `OwnedMaterialEntry` per distinct material, with the total
 *   quantity needed and the list of (trackedItemId, nodeId) pairs that
 *   contributed to it.
 */
export function buildOwnedMaterials({
  trackedItemIds,
  allItems,
  multipliers,
}: Params): OwnedMaterialEntry[] {
  const aggregated = new Map<string, OwnedMaterialEntry>();

  for (const trackedItemId of trackedItemIds) {
    const multiplier = multipliers[trackedItemId] ?? 1;
    const tree = resolveMaterialsTree(trackedItemId, multiplier);

    // Build a nodeId → quantity lookup from the resolved tree so we use the
    // multiplied quantity rather than the raw value stored on the entry.
    const quantityMap = new Map(
      flattenQuantities(tree).map((n) => [n.nodeId, n.quantity]),
    );

    for (const entry of allItems[trackedItemId] ?? []) {
      if (!entry.nodeId) continue;
      const material = sourceItemById(entry.itemId);
      if (!material) continue;

      const quantity = quantityMap.get(entry.nodeId) ?? entry.quantity;

      const existing = aggregated.get(entry.itemId);
      if (existing) {
        existing.needed += quantity;
        existing.nodeRefs.push({ trackedItemId, nodeId: entry.nodeId });
      } else {
        aggregated.set(entry.itemId, {
          itemId: entry.itemId,
          name: material.name,
          wikiLink: material.wikiLink,
          image: material.image,
          needed: quantity,
          nodeRefs: [{ trackedItemId, nodeId: entry.nodeId }],
        });
      }
    }
  }

  return Array.from(aggregated.values());
}
