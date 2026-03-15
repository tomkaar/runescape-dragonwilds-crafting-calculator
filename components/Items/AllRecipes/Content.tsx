"use client";

import { useSelectedMaterial } from "@/store/selected-material";
import { getItemById } from "@/utils/itemById";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { Card } from "./components/Card";

export function AllRecipesContent() {
  const multiplier = useMaterialMultiplier((state) => state.items);
  const rawRecipes = useSelectedMaterial((state) => state.items);
  const recipes = Object.entries(rawRecipes).filter(([, value]) =>
    value.some((m) => m.state === "TODO"),
  );

  const modifiedRecipes = recipes.map(([itemId, materials]) => {
    const item = getItemById(itemId);
    if (!item)
      return {
        item: null,
        materials: [],
      };

    const todoMaterials = materials.filter((m) => m.state === "TODO");

    // Combine duplicate materials by summing their quantities
    const combinedMaterials = todoMaterials.reduce(
      (acc, item) => {
        const existing = acc.find((m) => m.itemId === item.itemId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          acc.push({ itemId: item.itemId, quantity: item.quantity });
        }
        return acc;
      },
      [] as { itemId: string; quantity: number }[],
    );

    return {
      itemId,
      item,
      materials: combinedMaterials.map((item) => ({
        material: getItemById(item.itemId),
        quantity: item.quantity,
      })),
    };
  });

  return (
    <div className="h-full w-full">
      <div className="h-full px-4 mb-4 overflow-scroll">
        <p className="mb-2 text-sm text-neutral-200">
          All recipes with marked materials.
        </p>

        <div className="flex flex-col">
          {modifiedRecipes.map(({ item, materials }) => (
            <Card
              key={item?.id + "_" + materials.length}
              item={item}
              materials={materials}
              multiplier={multiplier[item?.id || ""] || 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
