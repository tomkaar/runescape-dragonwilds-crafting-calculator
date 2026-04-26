"use client";

import { memo } from "react";

import { getItemById } from "@/utils/itemById";
import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";

import { type StepEntry } from "./types";
import { StepRow } from "./StepRow";

type Props = {
  trackedItemIds: string[];
  sorted: StepEntry[];
  multipliers: Record<string, number>;
  compact?: boolean;
};

export const StepGroupedList = memo(function StepGroupedList({
  trackedItemIds,
  sorted,
  multipliers,
  compact = false,
}: Props) {
  return (
    <>
      {trackedItemIds.map((trackedItemId) => {
        const item = getItemById(trackedItemId);
        const multiplier = multipliers[trackedItemId] || 1;
        const itemSteps = sorted.filter((s) => s.trackedItemId === trackedItemId);
        if (itemSteps.length === 0) return null;
        return (
          <div key={trackedItemId} className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              {item?.image && (
                <img
                  src={createImageUrlPath(item.image)}
                  alt={item.name}
                  width={14}
                  height={14}
                  className="shrink-0"
                />
              )}
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {item?.name} ×{multiplier}
              </span>
            </div>
            {itemSteps.map((s) => (
              <StepRow key={`${s.trackedItemId}-${s.nodeId}`} step={s} compact={compact} />
            ))}
          </div>
        );
      })}
    </>
  );
});
