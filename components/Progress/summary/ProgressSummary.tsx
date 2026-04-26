"use client";

import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useSelectedMaterial } from "@/store/selected-material";

import { buildSummary } from "./buildSummary";
import { SummaryEntryRow } from "./SummaryEntryRow";

type Props = {
  trackedItemIds: string[];
};

export function ProgressSummary({ trackedItemIds }: Props) {
  const allItems = useSelectedMaterial((state) => state.items);
  const multipliers = useMaterialMultiplier((state) => state.items);

  const { todoEntries, doneEntries } = buildSummary({
    trackedItemIds,
    allItems,
    multipliers,
  });

  return (
    <div className="bg-background rounded-lg border border-accent p-4 flex flex-col gap-3">
      <div>
        <h2 className="font-semibold text-sm">Summary</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          A summary of your progress based on the materials you&apos;ve marked
          on the item cards.
        </p>
      </div>

      {todoEntries.length === 0 && doneEntries.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Mark materials on the item cards to see a summary here.
        </p>
      ) : (
        <div className="flex flex-col">
          {todoEntries.map((e) => (
            <SummaryEntryRow key={e.itemId} entry={e} />
          ))}
          {doneEntries.length > 0 && todoEntries.length > 0 && (
            <div className="my-1 border-t border-border" />
          )}
          {doneEntries.map((e) => (
            <SummaryEntryRow key={e.itemId} entry={e} done />
          ))}
        </div>
      )}
    </div>
  );
}
