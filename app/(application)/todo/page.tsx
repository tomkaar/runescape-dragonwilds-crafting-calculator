"use client";

import { useSelectedMaterial } from "@/store/selected-material";

export default function TodoPage() {
  const rawRecipes = useSelectedMaterial((state) => state.items);
  const recipes = Object.entries(rawRecipes).filter(
    ([, value]) => Object.keys(value).length > 0,
  );
  console.log(recipes);
  return (
    <div>
      <div>Recipes</div>
      <div>Total</div>
    </div>
  );
}
