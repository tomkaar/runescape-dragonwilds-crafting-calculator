"use client";

import { useMemo } from "react";

import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionPersisted } from "@/components/Items/AccordionPersisted";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useMaterialOwned } from "@/store/material-owned";
import { useSelectedMaterial } from "@/store/selected-material";

import { buildOwnedMaterials } from "@/features/crafting-progress/utils/owned-materials";

type Props = {
  trackedItemIds: string[];
};

export function ProgressSummary({ trackedItemIds }: Props) {
  const allItems = useSelectedMaterial((state) => state.items);
  const multipliers = useMaterialMultiplier((state) => state.items);
  const owned = useMaterialOwned((state) => state.owned);

  const rows = buildOwnedMaterials({ trackedItemIds, allItems, multipliers })
    .map((entry) => {
      const ownedQty = owned[entry.itemId] ?? 0;
      return {
        ...entry,
        owned: ownedQty,
        remaining: Math.max(0, entry.needed - ownedQty),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const readyCount = rows.filter((row) => row.remaining === 0).length;
  const totalNeeded = rows.reduce((sum, row) => sum + row.needed, 0);
  const totalOwned = rows.reduce(
    (sum, row) => sum + Math.min(row.owned, row.needed),
    0,
  );
  const percentComplete =
    totalNeeded === 0 ? 100 : Math.round((totalOwned / totalNeeded) * 100);

  return (
    <AccordionPersisted>
      <AccordionItem
        value="progress-summary"
        className="bg-background rounded-lg border border-accent"
      >
        <AccordionTrigger className="text-foreground px-4">
          <div className="flex flex-col text-left">
            <span className="font-semibold text-sm">Summary</span>
            <span className="text-xs text-muted-foreground font-normal mt-0.5">
              What you still need to gather, after subtracting what you own.
            </span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 text-foreground flex flex-col gap-4 pt-4">
          {rows.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Mark materials on the item cards to see your shortfall here.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {readyCount} / {rows.length} materials ready
                  </span>
                  <span className="font-semibold">{percentComplete}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-accent overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                {rows.map((row) => (
                  <div
                    key={row.itemId}
                    className={`flex flex-row items-center gap-2 py-1.5 text-sm${
                      row.remaining === 0 ? " opacity-40" : ""
                    }`}
                  >
                    {row.image && (
                      <img
                        src={createImageUrlPath(row.image)}
                        alt={row.name}
                        width={24}
                        height={24}
                        className="shrink-0 size-6"
                      />
                    )}
                    <span
                      className={`flex-1${row.remaining === 0 ? " line-through" : ""}`}
                    >
                      {row.name}
                    </span>
                    <span className="font-semibold">
                      {row.remaining === 0 ? "Ready" : `${row.remaining}× needed`}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </AccordionPersisted>
  );
}
