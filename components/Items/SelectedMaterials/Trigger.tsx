"use client";

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
      <ListTodoIcon className="w-4 h-4 text-neutral-600" />
      <div className="text-left flex flex-col">
        <span>Selected Materials</span>
        <span className="font-semibold text-xs text-yellow-400">
          Multiplier: x{multiplier}
        </span>
      </div>
    </>
  );
}
