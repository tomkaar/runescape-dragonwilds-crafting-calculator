import { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import { Item } from "@/Types";
import { applyFacilityNameOverride } from "./apply-facility-name-override";

export function resolveFacilities(recipes: SourceRecipe[]): Item["facilities"] {
  // collect all unique facilities from the recipes
  const facilitiesSet = new Set<string>();

  recipes.forEach((recipe) => {
    recipe.uses_facility?.forEach((facility) => {
      if (facility) {
        facilitiesSet.add(applyFacilityNameOverride(facility));
      }
    });
  });

  if (facilitiesSet.size > 0) {
    return Array.from(facilitiesSet) as Item["facilities"];
  }

  return [];
}
