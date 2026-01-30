"use client";

import { useSelectedItems } from "@/store/selected-items";

import recipesData from "@/data/recipes.json" assert { type: "json" };
import Material from "./Material";

const recipes = Object.values(recipesData);

export default function RequiredMaterials() {
  const selectedItems = useSelectedItems((state) => state.items);
  console.log("selectedItems:", selectedItems);

  // Filter recipes to only show selected items with variantCounts > 0
  const selectedRecipes = recipes
    .map((recipeGroup) => {
      // Find the selected item for this recipe group
      const selectedItem = selectedItems.find(
        (item) => item.itemId === recipeGroup.id,
      );

      if (!selectedItem) return null;

      // Filter recipe variants to only include those with variantCounts > 0
      const filteredRecipes = recipeGroup.recipes.filter((recipe) => {
        const count = selectedItem.variantCounts[recipe.id] || 0;
        return count > 0;
      });

      // Only return the recipe group if it has filtered recipes
      if (filteredRecipes.length === 0) return null;

      return {
        ...recipeGroup,
        recipes: filteredRecipes,
      };
    })
    .filter((recipe) => recipe !== null);

  // Calculate total required materials for recipes with images and source tracking
  const materials: Record<
    string,
    {
      quantity: number;
      image: string | undefined;
      usedIn: { recipeName: string; recipeVariant?: string }[];
    }
  > = {};
  for (const recipeGroup of selectedRecipes) {
    for (const recipe of recipeGroup!.recipes) {
      const count = selectedItems.find(
        (item) => item.itemId === recipeGroup!.id,
      )!.variantCounts[recipe.id];

      for (const material of recipe.materials || []) {
        if (!materials[material.name]) {
          materials[material.name] = {
            quantity: 0,
            image: material.image,
            usedIn: [],
          };
        }
        materials[material.name].quantity += (material.quantity || 1) * count;

        // Track which recipe uses this material (avoid duplicates)
        const sourceInfo = {
          recipeName: recipeGroup!.name,
          recipeVariant: recipe.variant,
        };
        if (
          !materials[material.name].usedIn.some(
            (src) =>
              src.recipeName === sourceInfo.recipeName &&
              src.recipeVariant === sourceInfo.recipeVariant,
          )
        ) {
          materials[material.name].usedIn.push(sourceInfo);
        }
      }
    }
  }

  return (
    <div className="space-y-6 bg-neutral-800 rounded-xl p-4">
      <div>
        <h2 className="text-xl font-bold mb-3">Required materials</h2>
        <ul className="space-y-2">
          {Object.entries(materials).map(
            ([materialName, { quantity, image, usedIn }]) => (
              <Material
                key={materialName}
                materialName={materialName}
                quantity={quantity}
                image={image}
                usedIn={usedIn}
              />
            ),
          )}
        </ul>
      </div>
    </div>
  );
}
