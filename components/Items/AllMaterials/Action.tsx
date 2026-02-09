"use client";

import { Button } from "@/components/ui/button";
import { useSelectedMaterial } from "@/store/selected-material";

export function AllMaterialsAction() {
  const items = useSelectedMaterial((state) => state.items);
  const resetAllToTodo = useSelectedMaterial((state) => state.resetAllToTodo);

  const handleReset = () => {
    Object.keys(items).forEach((itemIdKey) => {
      resetAllToTodo(itemIdKey);
    });
  };

  return (
    <Button variant="outline" onClick={handleReset}>
      Clear
    </Button>
  );
}
