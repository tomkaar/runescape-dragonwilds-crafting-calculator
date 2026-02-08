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
import { useSelectedMaterial } from "@/store/selected-material";
import { Button } from "../../ui/button";

type Props = {
  itemId: string;
};

export function RequiredMaterialsAction({ itemId }: Props) {
  const clearMarkedMaterials = useSelectedMaterial(
    (state) => state.clearMarkedMaterials,
  );
  const handleClearMarkedMaterials = () => {
    clearMarkedMaterials(itemId);
  };

  return (
    <div className="ml-auto">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Clear selection</Button>
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
