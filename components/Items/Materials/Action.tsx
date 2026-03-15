"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useSelectedMaterial } from "@/store/selected-material";
import { Eraser } from "lucide-react";

type Props = {
  itemId: string;
};

export function MaterialsAction({ itemId }: Props) {
  const multipliers = useMaterialMultiplier((state) => state.items);
  const setMultiplier = useMaterialMultiplier((state) => state.setMultiplier);
  const multiplier = multipliers[itemId] || 1;

  const clearMarkedMaterials = useSelectedMaterial(
    (state) => state.clearMarkedMaterials,
  );
  const handleClearMarkedMaterials = () => {
    clearMarkedMaterials(itemId);
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        id="input-multiplier"
        type="number"
        autoComplete="off"
        min={1}
        max={1000}
        className="flex-1 w-20"
        value={multiplier}
        onChange={(e) => setMultiplier(itemId, parseInt(e.target.value))}
      />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Eraser className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear marked materials?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear all marked materials? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearMarkedMaterials}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
