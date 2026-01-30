"use client";

import { useSelectedItems } from "@/store/selected-items";
import RecipeCard from "./RecipeCard/RecipeCard";

export default function SelectedRecipes() {
  const recipeIds = useSelectedItems((state) => state.items);

  return (
    <div className="grid gap-4">
      {recipeIds.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          id={recipe.id}
          itemId={recipe.itemId}
          variantCounts={recipe.variantCounts}
        />
      ))}
    </div>
  );
}
