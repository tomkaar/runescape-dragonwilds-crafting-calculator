"use client";

import Link from "next/link";
import { AlignJustify, AlignLeft, ArrowRight } from "lucide-react";

import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useProgressUiState } from "@/store/progress-ui-state";
import { useSelectedMaterial } from "@/store/selected-material";
import { useStoreHydration } from "@/store/useStoreHydration";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { buildSteps } from "@/components/Progress/next-steps/buildSteps";
import { StepRow } from "@/components/Progress/next-steps/StepRow";

export function AccordionNextSteps({ itemId }: { itemId: string }) {
  const _hasHydrated = useStoreHydration(useSelectedMaterial);
  const allItems = useSelectedMaterial((state) => state.items);
  const multipliers = useMaterialMultiplier((state) => state.items);
  const compact = useProgressUiState((state) => state.itemCompact);
  const setCompact = useProgressUiState((state) => state.setItemCompact);

  if (!_hasHydrated || !allItems[itemId]?.length) return null;

  const steps = buildSteps({ trackedItemIds: [itemId], allItems, multipliers });

  const sorted = steps.sort((a, b) => {
    if (a.state !== b.state) return a.state === "TODO" ? -1 : 1;
    return b.depth - a.depth;
  });

  if (sorted.length === 0) return null;

  const todoSteps = sorted.filter((s) => s.state === "TODO");
  const doneSteps = sorted.filter((s) => s.state === "DONE");

  return (
    <AccordionItem
      value="next-steps"
      className="bg-background rounded-lg border border-accent"
    >
      <AccordionTrigger className="text-foreground px-4">
        <div className="flex flex-col">
          Progress
          <span className="text-xs text-muted-foreground font-normal">
            What to work on next to craft this item
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 text-foreground flex flex-col pt-1">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/progress">
              <ArrowRight className="size-4" />
              All progress
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={() => setCompact(!compact)}
          >
            {compact ? (
              <AlignJustify className="size-4" />
            ) : (
              <AlignLeft className="size-4" />
            )}
            {compact ? "Descriptive" : "Compact"}
          </Button>
        </div>

        {todoSteps.map((s) => (
          <StepRow
            key={`${s.trackedItemId}-${s.nodeId}`}
            step={s}
            compact={compact}
          />
        ))}
        {doneSteps.length > 0 && todoSteps.length > 0 && (
          <div className="my-1 border-t border-border" />
        )}
        {doneSteps.map((s) => (
          <StepRow
            key={`${s.trackedItemId}-${s.nodeId}`}
            step={s}
            compact={compact}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
