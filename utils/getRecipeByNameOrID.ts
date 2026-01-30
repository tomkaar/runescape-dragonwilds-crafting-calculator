import { GroupedRecipes } from "@/data/recipes";
import recipesData from "@/data/recipes.json" assert { type: "json" };

const recipes = Object.values(recipesData as unknown as GroupedRecipes);

export function getRecipeByNameOrId(materialName: string) {
  return recipes.find(
    (recipeGroup) =>
      recipeGroup.name.toLowerCase() === materialName.toLowerCase() ||
      recipeGroup.id.toLowerCase() === materialName.toLowerCase(),
  );
}
