"use client";

import { useSelectedMaterial } from "@/store/selected-material";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { useTodoCheckedItems } from "@/store/todo-checked-items";
import { CheckboxDescription } from "./components/Checkbox";

export function AllMaterialsContent() {
  const checkedItems = useTodoCheckedItems((state) => state.items);
  const multiplier = useMaterialMultiplier((state) => state.items);
  const rawRecipes = useSelectedMaterial((state) => state.items);
  const recipes = Object.entries(rawRecipes)
    .map(([recipeId, value]) => {
      const todoMaterials = value.filter((item) => item.state === "TODO");
      return [recipeId, todoMaterials] as [
        string,
        { itemId: string; quantity: number }[],
      ];
    })
    .filter(([, value]) => Object.keys(value).length > 0);

  const totalUniqueMaterialsWithQuantity = recipes.reduce<
    Record<string, number>
  >((acc, cur) => {
    const [itemId, materials] = cur;

    materials.forEach((mat) => {
      const materialId = mat.itemId;
      const baseQuantity = mat.quantity;
      const materialMultiplier = multiplier[itemId] || 1;
      const totalQuantity = baseQuantity * materialMultiplier;

      if (acc[materialId]) {
        acc[materialId] += totalQuantity;
      } else {
        acc[materialId] = totalQuantity;
      }
    });
    return acc;
  }, {});

  return (
    <div className="h-full w-full">
      <div className="h-full px-4 mb-4 overflow-scroll">
        <p className="mb-4 text-sm text-neutral-200 max-w-80">
          All materials needed for the selected recipes, with total quantities
          adjusted by multipliers.
        </p>

        <div className="mt-4">
          {Object.entries(totalUniqueMaterialsWithQuantity).map(
            ([materialId, totalQuantity]) => (
              <CheckboxDescription
                key={materialId + totalQuantity}
                id={materialId}
                quantity={totalQuantity}
                defaultChecked={checkedItems.includes(materialId)}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}
