"use client";

import { cn } from "@/lib/utils";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { ListTree } from "lucide-react";

type Props = {
  itemId: string;
};

export function MaterialsTrigger({ itemId }: Props) {
  const multipliers = useMaterialMultiplier((state) => state.items);
  const multiplier = multipliers[itemId] || 1;

  return (
    <>
      <ListTree className="w-4 h-4 text-foreground" />
      <div className="text-left flex flex-col">
        <span>Materials</span>
        <span
          className={cn(
            "relative -mt-1 font-semibold text-xs text-neutral-400",
            multiplier > 1 && "text-title",
          )}
        >
          Multiplier: x{multiplier}
        </span>
      </div>
    </>
  );
}
