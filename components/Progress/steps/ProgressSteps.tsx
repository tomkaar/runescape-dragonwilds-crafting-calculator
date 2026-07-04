"use client";

import { useMemo } from "react";

import { createImageUrlPath } from "@/scripts/parse-data/utils/image-url";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { AccordionPersisted } from "@/components/Items/AccordionPersisted";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useMaterialOwned } from "@/store/material-owned";
import { useSelectedMaterial } from "@/store/selected-material";
import { useStepsFilter } from "@/store/steps-filter";
import { sourceItemById } from "@/utils/source-item-by-id";

import { buildSteps } from "./buildSteps";

type Props = {
  trackedItemIds: string[];
};

export function ProgressSteps({ trackedItemIds }: Props) {
  const allItems = useSelectedMaterial((state) => state.items);
  const multipliers = useMaterialMultiplier((state) => state.items);
  const owned = useMaterialOwned((state) => state.owned);
  const { isAll, selectedIds, selectAll, toggleItem } = useStepsFilter();

  const filteredItemIds = useMemo(
    () =>
      isAll
        ? trackedItemIds
        : selectedIds.filter((id) => trackedItemIds.includes(id)),
    [isAll, selectedIds, trackedItemIds],
  );

  const steps = useMemo(
    () => buildSteps({ filteredItemIds, allItems, multipliers, owned }),
    [filteredItemIds, allItems, multipliers, owned],
  );

  return (
    <AccordionPersisted>
      <AccordionItem
        value="progress-steps"
        className="bg-background rounded-lg border border-accent"
      >
        <AccordionTrigger className="text-foreground px-4">
          <div className="flex flex-col text-left">
            <span className="font-semibold text-sm">Next Steps</span>
            <span className="text-xs text-muted-foreground font-normal mt-0.5">
              Materials in crafting order — from raw ingredients up to finished
              pieces.
            </span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4 text-foreground flex flex-col gap-4 pt-4">
          {trackedItemIds.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              <Button
                size="sm"
                variant={isAll ? "default" : "outline"}
                onClick={selectAll}
                className="h-7 text-xs"
              >
                All
              </Button>
              {trackedItemIds.map((id) => {
                const item = sourceItemById(id);
                if (!item) return null;
                const isSelected = isAll || selectedIds.includes(id);
                return (
                  <Button
                    key={id}
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => toggleItem(id, trackedItemIds)}
                    className="h-7 text-xs gap-1.5"
                  >
                    {item.image && (
                      <img
                        src={createImageUrlPath(item.image)}
                        alt={item.name}
                        width={14}
                        height={14}
                        className="shrink-0"
                      />
                    )}
                    {item.name}
                  </Button>
                );
              })}
            </div>
          )}

          {filteredItemIds.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Select items above to see their next steps.
            </p>
          ) : steps.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Mark materials as todo on the item cards to see your next steps
              here.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-accent">
              {steps.map((step) => (
                <div
                  key={step.itemId}
                  className="flex flex-col gap-0.5 py-2 text-sm first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-2">
                    {step.image && (
                      <img
                        src={createImageUrlPath(step.image)}
                        alt={step.name}
                        width={20}
                        height={20}
                        className="shrink-0 size-5"
                      />
                    )}
                    <span className="font-semibold">
                      {step.quantity}× {step.name}
                    </span>
                  </div>
                  {step.parents.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 pl-7 text-xs text-muted-foreground">
                      <span>Used for:</span>
                      {step.parents.map((p, i) => (
                        <span key={p.itemId} className="flex items-center gap-1">
                          {p.image && (
                            <img
                              src={createImageUrlPath(p.image)}
                              alt={p.name}
                              width={14}
                              height={14}
                              className="shrink-0"
                            />
                          )}
                          {p.quantity}× {p.name}
                          {i < step.parents.length - 1 && ","}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 pl-7 text-xs text-muted-foreground">
                    <span>Used for</span>
                    {step.usedFor.map((u, i) => (
                      <span key={u.itemId} className="flex items-center gap-1">
                        {u.image && (
                          <img
                            src={createImageUrlPath(u.image)}
                            alt={u.name}
                            width={14}
                            height={14}
                            className="shrink-0"
                          />
                        )}
                        {u.name}
                        {i < step.usedFor.length - 1 && " and"}
                      </span>
                    ))}
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </AccordionPersisted>
  );
}
