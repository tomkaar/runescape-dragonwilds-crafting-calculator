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
import { useEffect, useState } from "react";

type Props = {
  itemId: string;
};

export function MaterialsAction({ itemId }: Props) {
  const multipliers = useMaterialMultiplier((state) => state.items);
  const setMultiplier = useMaterialMultiplier((state) => state.setMultiplier);
  const multiplier = multipliers[itemId] || 1;

  const [inputValue, setInputValue] = useState(String(multiplier));

  // Keep local state in sync when the store value changes externally
  useEffect(() => {
    setInputValue(String(multiplier));
  }, [multiplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 1000) {
      setMultiplier(itemId, parsed);
    }
  };

  const handleBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed < 1) {
      setInputValue(String(multiplier));
    }
  };

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
        className="flex-1 w-20"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
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
