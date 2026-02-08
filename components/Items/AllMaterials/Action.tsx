"use client";

import { Button } from "@/components/ui/button";
import { useTodoCheckedItems } from "@/store/todo-checked-items";

export function AllMaterialsAction() {
  const clear = useTodoCheckedItems((state) => state.clear);

  return (
    <Button variant="outline" onClick={clear}>
      Clear
    </Button>
  );
}
