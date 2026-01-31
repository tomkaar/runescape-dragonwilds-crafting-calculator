import { RawRecipe } from "@/playground/recipes";
import { Item } from "@/Types";

export function resolveFacilities(recipes: RawRecipe[]): Item["facilities"] {
  // collect all unique facilities from the recipes
  const facilitiesSet = new Set<string>();

  recipes.forEach((recipe) => {
    recipe.uses_facility?.forEach((facility) => {
      if (facility) {
        facilitiesSet.add(facility);
      }
    });
  });

  if (facilitiesSet.size > 0) {
    return Array.from(facilitiesSet) as Item["facilities"];
  }

  return [];
}
