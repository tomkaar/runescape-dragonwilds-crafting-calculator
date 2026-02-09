"use client";

import { useSelectedMaterial } from "@/store/selected-material";
import { getItemById } from "@/utils/itemById";
import { useMaterialMultiplier } from "@/store/material-multiplier";
import { Card } from "./components/Card";

export function AllRecipesContent() {
  const multiplier = useMaterialMultiplier((state) => state.items);
  const rawRecipes = useSelectedMaterial((state) => state.items);
  const recipes = Object.entries(rawRecipes).filter(
    ([, value]) => Object.keys(value).length > 0,
  );

  const modifiedRecipes = recipes.map(([itemId, materials]) => {
    const item = getItemById(itemId);
    if (!item)
      return {
        item: null,
        materials: [],
      };

    // Combine duplicate materials by summing their quantities
    const combinedMaterials = materials.reduce(
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
        <p className="mb-4 text-sm text-neutral-200 max-w-68">
          All recipes that have selected materials, grouped by recipe.
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
