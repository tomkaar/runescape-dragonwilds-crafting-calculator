"use client";

import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useMaterialOwned } from "@/store/material-owned";
import { useSelectedMaterial } from "@/store/selected-material";

import { buildOwnedMaterials, type OwnedMaterialEntry } from "./buildOwnedMaterials";
import { OwnedMaterialRow } from "./OwnedMaterialRow";

type Props = {
  trackedItemIds: string[];
};

export function ProgressOwnedMaterials({ trackedItemIds }: Props) {
  const allItems = useSelectedMaterial((state) => state.items);
  const multipliers = useMaterialMultiplier((state) => state.items);
  const markAsDoneByNodeId = useSelectedMaterial(
    (state) => state.markAsDoneByNodeId,
  );
  const markAsTodoByNodeId = useSelectedMaterial(
    (state) => state.markAsTodoByNodeId,
  );
  const owned = useMaterialOwned((state) => state.owned);
  const setOwned = useMaterialOwned((state) => state.setOwned);

  const rows = buildOwnedMaterials({ trackedItemIds, allItems, multipliers }).sort(
    (a, b) => a.name.localeCompare(b.name),
  );

  const commit = (entry: OwnedMaterialEntry, qty: number) => {
    setOwned(entry.itemId, qty);
    const done = qty >= entry.needed;
    for (const ref of entry.nodeRefs) {
      if (done) markAsDoneByNodeId(ref.trackedItemId, ref.nodeId);
      else markAsTodoByNodeId(ref.trackedItemId, ref.nodeId);
    }
  };

  return (
    <div className="bg-background rounded-lg border border-accent p-4 flex flex-col gap-3">
      <div>
        <h2 className="font-semibold text-sm">Progress</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Enter how many of each material you currently own to track your
          progress.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Mark materials on the item cards to see them here.
        </p>
      ) : (
        <div className="flex flex-col">
          {rows.map((entry) => (
            <OwnedMaterialRow
              key={entry.itemId}
              entry={entry}
              owned={owned[entry.itemId] ?? 0}
              onCommit={(qty) => commit(entry, qty)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
