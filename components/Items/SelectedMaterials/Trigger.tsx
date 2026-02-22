"use client";

import { cn } from "@/lib/utils";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { ListTodoIcon } from "lucide-react";

type Props = {
  itemId: string;
};

export function SelectedMaterialsTrigger(props: Props) {
  const { itemId } = props;
  const multipliers = useMaterialMultiplier((state) => state.items);
  const multiplier = multipliers[itemId] || 1;

  return (
    <>
      <ListTodoIcon className="w-4 h-4 text-foreground" />
      <div className="text-left flex flex-col">
        <span>Selected Materials</span>
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
