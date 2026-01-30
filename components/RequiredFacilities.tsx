"use client";

import { useSelectedItems } from "@/store/selected-items";

import recipesData from "@/data/recipes.json" assert { type: "json" };
import getFacilityIcon from "@/utils/getFacilityIcon";
import { FacilityType } from "@/data/facilityTypes";
import Link from "next/link";

const recipes = Object.values(recipesData);

export default function RequiredFacilities() {
  const selectedItems = useSelectedItems((state) => state.items);

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

  // Helper function to get recipe for a material by name
  const getRecipeByName = (materialName: string) => {
    return recipes.find(
      (recipeGroup) =>
        recipeGroup.name.toLowerCase() === materialName.toLowerCase(),
    );
  };

  // Calculate all materials needed
  const materials = new Set<string>();
  for (const recipeGroup of selectedRecipes) {
    for (const recipe of recipeGroup!.recipes) {
      for (const material of recipe.materials || []) {
        materials.add(material.name);
      }
    }
  }

  // Collect facilities from selected recipes
  const facilitiesFromRecipes = selectedRecipes.flatMap((recipeGroup) =>
    recipeGroup.recipes.map((recipe) => recipe.facility),
  );

  // Collect facilities needed to craft materials
  const facilitiesFromMaterials = Array.from(materials).flatMap(
    (materialName) => {
      const materialRecipe = getRecipeByName(materialName);
      if (materialRecipe?.recipes) {
        return materialRecipe.recipes.map((recipe) => recipe.facility);
      }
      return [];
    },
  );

  // Combine and deduplicate all facilities
  const requiredFacilities = Array.from(
    new Set([...facilitiesFromRecipes, ...facilitiesFromMaterials]),
  )
    .filter((facility) => facility && facility !== "Build Menu")
    .sort((a, b) => a.localeCompare(b)) as FacilityType[];

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Required facilities</h2>

      <div className="flex flex-row flex-wrap gap-4 mt-4 w-full">
        {requiredFacilities.map((facility) => (
          <Link key={facility} href={{ pathname: `/facility/${facility}` }}>
            <div className="flex flex-row gap-2 items-center p-2 pr-6 bg-neutral-800 rounded-lg">
              <div className="w-10">{getFacilityIcon(facility, 40)}</div>
              <span className="whitespace-nowrap">{facility}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
