import recipesData from "@/data/recipes.json" assert { type: "json" };

const recipes = Object.values(recipesData);

export function getRecipeByName(materialName: string) {
  return recipes.find(
    (recipeGroup) =>
      recipeGroup.name.toLowerCase() === materialName.toLowerCase(),
  );
}
