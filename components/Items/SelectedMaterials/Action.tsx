"use client";

import { Input } from "@/components/ui/input";
import { useMaterialMultiplier } from "@/store/material-multiplier";

type Props = {
  itemId: string;
};

export function SelectedMaterialsAction({ itemId }: Props) {
  const multipliers = useMaterialMultiplier((state) => state.items);
  const setMultiplier = useMaterialMultiplier((state) => state.setMultiplier);

  const multiplier = multipliers[itemId] || 1;

  return (
    <Input
      id="input-multiplier"
      type="number"
      autoComplete="off"
      min={1}
      max={1000}
      className="max-w-20"
      value={multiplier}
      onChange={(e) => setMultiplier(itemId, parseInt(e.target.value))}
    />
  );
}
