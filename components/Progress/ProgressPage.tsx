"use client";

import { useMemo } from "react";

import { Loader2 } from "lucide-react";

import { sourceItemById } from "@/utils/source-item-by-id";
import { AccordionPersisted } from "@/components/Items/AccordionPersisted";
import { useSelectedMaterial } from "@/store/selected-material";
import { useStoreHydration } from "@/store/useStoreHydration";

import { ProgressEmptyState } from "./ProgressEmptyState";
import { ProgressItemCard } from "./items/ProgressItemCard";
import { ProgressOwnedMaterials } from "./owned/ProgressOwnedMaterials";
import { ProgressSteps } from "./steps/ProgressSteps";

export function ProgressPage() {
  const _hasHydrated = useStoreHydration(useSelectedMaterial);

  const items = useSelectedMaterial((state) => state.items);

  const trackedItemIds = useMemo(
    () =>
      Object.keys(items).sort((a, b) => {
        const nameA = sourceItemById(a)?.name ?? a;
        const nameB = sourceItemById(b)?.name ?? b;
        return nameA.localeCompare(nameB);
      }),
    [items],
  );

  if (!_hasHydrated) {
    return (
      <div className="bg-dark-background h-full flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="bg-dark-background h-full flex flex-col overflow-y-auto lg:overflow-hidden lg:flex-row gap-4 p-4">
      <div className="flex-1 min-w-0 lg:overflow-y-auto">
        <div className="bg-background rounded-lg border border-accent p-4 mb-2">
          <h2 className="font-semibold text-sm">Items</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your tracked items. Mark materials as todo and done to track your
            progress. They will be added to the progress summary and next steps.
          </p>
        </div>

        <AccordionPersisted className="flex flex-col gap-2">
          {trackedItemIds.map((itemId) => {
            const item = sourceItemById(itemId);
            if (!item) return null;
            return (
              <ProgressItemCard key={itemId} itemId={itemId} item={item} />
            );
          })}
        </AccordionPersisted>

        {trackedItemIds.length === 0 && (
          <div className="bg-background rounded-lg border border-accent p-4 mb-2">
            <ProgressEmptyState />
          </div>
        )}
      </div>

      <div className="flex-1 lg:shrink-0 lg:overflow-y-auto flex flex-col gap-4">
        <ProgressOwnedMaterials trackedItemIds={trackedItemIds} />
      </div>
      
      <div className="flex-1 lg:shrink-0 lg:overflow-y-auto">
        <ProgressSteps trackedItemIds={trackedItemIds} />
      </div>
    </div>
  );
}
