"use client";

import { Loader2 } from "lucide-react";

import { sourceItemById } from "@/utils/source-item-by-id";
import { AccordionPersisted } from "@/components/Items/AccordionPersisted";
import { Button } from "@/components/ui/button";
import { useSelectedMaterial } from "@/store/selected-material";
import { useStoreHydration } from "@/store/useStoreHydration";
import { useTrackedItemIds } from "@/features/crafting-progress/hooks/useTrackedItemIds";
import { Steps } from "@/features/crafting-progress/components/steps";

import { ProgressItemCard } from "./items/ProgressItemCard";
import { ProgressOwnedMaterials } from "./owned/ProgressOwnedMaterials";
import { useRouter } from "next/navigation";

export function ProgressPage() {
  const _hasHydrated = useStoreHydration(useSelectedMaterial);
  const router = useRouter();

  const items = useSelectedMaterial((state) => state.items);

  const trackedItemIds = useTrackedItemIds(items);

  if (!_hasHydrated) {
    return (
      <div className="bg-dark-background h-full flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!trackedItemIds.length) {
    return (
      <div className="bg-dark-background h-full overflow-y-auto p-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          <div className="bg-background rounded-lg border border-accent p-4">
            <h2 className="font-semibold text-sm">Progress tracker</h2>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-md">
              Track crafting progress across every item you&apos;re working
              towards. Search for an item below to add it and get started.
            </p>
            <div className="mt-4 flex flex-row flex-wrap gap-2">
              <div className="flex-1 min-w-48">
                <Button onClick={() => router.push("/item")} variant="outline" className="w-full">
                        <span className="text-muted-foreground">⌘K</span> Search and navigate
                      </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="bg-background rounded-lg border border-accent p-4">
              <span className="font-semibold text-sm">1. Items</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Once added, an item shows up here as a card. Open it, mark
                the materials that you need to collect and set a multiplier if you need more than one.
              </p>
            </div>
            <div className="bg-background rounded-lg border border-accent p-4">
              <span className="font-semibold text-sm">
                2. Collected Materials
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enter how many of each material you already own. Materials
                are automatically marked Done once you have enough to craft the item.
              </p>
            </div>
            <div className="bg-background rounded-lg border border-accent p-4">
              <span className="font-semibold text-sm">3. Next Steps</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                See what&apos;s left to gather in crafting order, from raw
                ingredients up to finished pieces, across all tracked items.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-background h-full flex flex-col overflow-y-auto lg:overflow-hidden lg:flex-row gap-4 p-4">
      <div className="flex-1 min-w-0 lg:overflow-y-auto">
        <div className="bg-background rounded-lg border border-accent p-4 mb-2">
          <h2 className="font-semibold text-sm">Items</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your tracked items. Mark materials as todo and set a multiplier if you need more than one to track your
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
      </div>

      <div className="flex-1 lg:shrink-0 lg:overflow-y-auto flex flex-col gap-4">
        <ProgressOwnedMaterials trackedItemIds={trackedItemIds} />
      </div>
      
      <div className="flex-1 lg:shrink-0 lg:overflow-y-auto">
        <Steps allItems={items} />
      </div>
    </div>
  );
}
