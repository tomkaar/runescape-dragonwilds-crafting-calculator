"use client";

import { MultiplierAndClearInput } from "@/components/Items/Materials/components/MultiplierAndClearInput";
import { RequiredMaterialsContent } from "@/components/Items/Materials/components/Tree";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMaterialMultiplier } from "@/store/material-multiplier";

export function AccordionMaterials({ itemId }: { itemId: string }) {
  const multipliers = useMaterialMultiplier((state) => state.items);
  const multiplier = multipliers[itemId] || 1;

  return (
    <AccordionItem
      value="materials"
      className="bg-neutral-900 rounded-lg border border-accent"
    >
      <AccordionTrigger className="cursor-pointer text-white px-4">
        <div className="flex flex-col">
          Recipe (x{multiplier})
          <span className="text-xs text-neutral-300">
            The materials required to craft this item.
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 text-white flex flex-col gap-4 pt-1">
        <MultiplierAndClearInput itemId={itemId} />
        <RequiredMaterialsContent itemId={itemId} />
      </AccordionContent>
    </AccordionItem>
  );
}
