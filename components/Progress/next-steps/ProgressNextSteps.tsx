"use client";

import { AlignJustify, AlignLeft, LayoutList, List } from "lucide-react";

import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useProgressUiState } from "@/store/progress-ui-state";
import { useSelectedMaterial } from "@/store/selected-material";
import { Button } from "@/components/ui/button";

import { buildSteps } from "./buildSteps";
import { StepRow } from "./StepRow";
import { StepGroupedList } from "./StepGroupedList";

type Props = {
  trackedItemIds: string[];
};

export function ProgressNextSteps({ trackedItemIds }: Props) {
  const grouped = useProgressUiState((state) => state.grouped);
  const setGrouped = useProgressUiState((state) => state.setGrouped);
  const compact = useProgressUiState((state) => state.compact);
  const setCompact = useProgressUiState((state) => state.setCompact);
  const allItems = useSelectedMaterial((state) => state.items);
  const multipliers = useMaterialMultiplier((state) => state.items);

  const steps = buildSteps({ trackedItemIds, allItems, multipliers });

  const sorted = steps.sort((a, b) => {
    if (a.state !== b.state) return a.state === "TODO" ? -1 : 1;
    return b.depth - a.depth;
  });

  const todoSteps = sorted.filter((s) => s.state === "TODO");
  const doneSteps = sorted.filter((s) => s.state === "DONE");

  return (
    <div className="bg-background rounded-lg border border-accent p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-sm">Progress</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            What to work on next to craft your tracked items.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCompact(!compact)}
          >
            {compact ? (
              <AlignJustify className="size-4" />
            ) : (
              <AlignLeft className="size-4" />
            )}
            <span className="hidden md:inline lg:hidden xl:inline">
              {compact ? "Descriptive" : "Compact"}
            </span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGrouped(!grouped)}
          >
            {grouped ? (
              <List className="size-4" />
            ) : (
              <LayoutList className="size-4" />
            )}
            <span className="hidden md:inline lg:hidden xl:inline">
              {grouped ? "Full list" : "Grouped"}
            </span>
          </Button>
        </div>
      </div>

      {steps.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Mark materials on the item cards to see next steps here.
        </p>
      ) : grouped ? (
        <div className="flex flex-col gap-3">
          <StepGroupedList
            trackedItemIds={trackedItemIds}
            sorted={sorted}
            multipliers={multipliers}
            compact={compact}
          />
        </div>
      ) : (
        <div className="flex flex-col">
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
        </div>
      )}
    </div>
  );
}
