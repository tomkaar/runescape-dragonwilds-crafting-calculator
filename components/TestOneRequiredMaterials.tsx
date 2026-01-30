"use client";

import { useSelectedItems } from "@/store/selected-items";

import recipesData from "@/data/recipes.json" assert { type: "json" };

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

  // Calculate total required materials for recipes
  const materials: Record<string, number> = {};
  for (const recipeGroup of selectedRecipes) {
    for (const recipe of recipeGroup!.recipes) {
      const count = selectedItems.find(
        (item) => item.itemId === recipeGroup!.id,
      )!.variantCounts[recipe.id];

      for (const material of recipe.materials || []) {
        if (!materials[material.name]) {
          materials[material.name] = 0;
        }
        materials[material.name] += (material.quantity || 1) * count;
      }
    }
  }

  // Helper function to get recipe for a material by name
  const getRecipeByName = (materialName: string) => {
    return recipes.find(
      (recipeGroup) =>
        recipeGroup.name.toLowerCase() === materialName.toLowerCase(),
    );
  };

  // Calculate base materials recursively
  // This function drills down through all recipe layers until it reaches base materials
  // Example: Clay Vessel → Clay Vessel (Unfired) → Clay (base material)
  const calculateBaseMaterials = (
    materialName: string,
    quantity: number,
    depth = 0,
  ): Record<string, number> => {
    // Prevent infinite recursion
    if (depth > 20) {
      console.warn(`Max recursion depth reached for ${materialName}`);
      return { [materialName]: quantity };
    }

    const baseMaterials: Record<string, number> = {};
    const recipeGroup = getRecipeByName(materialName);

    // If not craftable or no recipe found, it's a base material
    if (
      !recipeGroup ||
      !recipeGroup.recipes ||
      recipeGroup.recipes.length === 0
    ) {
      baseMaterials[materialName] = quantity;
      return baseMaterials;
    }

    // Use the first recipe variant (could be enhanced to let user choose)
    const recipe = recipeGroup.recipes[0];
    if (!recipe.materials || recipe.materials.length === 0) {
      baseMaterials[materialName] = quantity;
      return baseMaterials;
    }

    // Recursively calculate base materials for each ingredient
    for (const material of recipe.materials) {
      const materialQuantity = (material.quantity || 1) * quantity;
      const subMaterials = calculateBaseMaterials(
        material.name,
        materialQuantity,
        depth + 1,
      );

      // Aggregate the base materials
      for (const [name, qty] of Object.entries(subMaterials)) {
        if (!baseMaterials[name]) {
          baseMaterials[name] = 0;
        }
        baseMaterials[name] += qty;
      }
    }

    return baseMaterials;
  };

  // Create deeply nested materials structure for List 1
  type MaterialWithRecipe = {
    name: string;
    quantity: number;
    isCraftable: boolean;
    recipeVariants?: {
      variantName?: string;
      materials: MaterialWithRecipe[];
    }[];
  };

  // Recursive function to build deeply nested material tree
  const buildNestedMaterialTree = (
    materialName: string,
    quantity: number,
    depth = 0,
  ): MaterialWithRecipe => {
    // Prevent infinite recursion
    if (depth > 20) {
      console.warn(`Max recursion depth reached for ${materialName}`);
      return {
        name: materialName,
        quantity,
        isCraftable: false,
      };
    }

    const recipeGroup = getRecipeByName(materialName);
    const craftable = !!recipeGroup;

    if (
      !craftable ||
      !recipeGroup.recipes ||
      recipeGroup.recipes.length === 0
    ) {
      // Base material - no recipe
      return {
        name: materialName,
        quantity,
        isCraftable: false,
      };
    }

    // Has recipes - build tree for all recipe variants
    const recipeVariants = recipeGroup.recipes
      .filter((recipe) => recipe.materials && recipe.materials.length > 0)
      .map((recipe) => ({
        variantName: recipe.variant,
        materials: recipe.materials.map((mat) =>
          buildNestedMaterialTree(
            mat.name,
            (mat.quantity || 1) * quantity,
            depth + 1,
          ),
        ),
      }));

    // If no valid recipe variants, it's a base material
    if (recipeVariants.length === 0) {
      return {
        name: materialName,
        quantity,
        isCraftable: false,
      };
    }

    return {
      name: materialName,
      quantity,
      isCraftable: true,
      recipeVariants,
    };
  };

  const nestedMaterials: MaterialWithRecipe[] = Object.entries(materials).map(
    ([materialName, quantity]) =>
      buildNestedMaterialTree(materialName, quantity),
  );

  // Calculate all base materials for List 2
  const allBaseMaterials: Record<string, number> = {};
  for (const [materialName, quantity] of Object.entries(materials)) {
    const baseMats = calculateBaseMaterials(materialName, quantity);
    for (const [name, qty] of Object.entries(baseMats)) {
      if (!allBaseMaterials[name]) {
        allBaseMaterials[name] = 0;
      }
      allBaseMaterials[name] += qty;
    }
  }

  // Calculate all materials (craftable + base) for List 3
  const collectAllMaterials = (
    materialName: string,
    quantity: number,
    depth = 0,
  ): Record<string, number> => {
    // Prevent infinite recursion
    if (depth > 20) {
      console.warn(`Max recursion depth reached for ${materialName}`);
      return { [materialName]: quantity };
    }

    const allMats: Record<string, number> = {};

    // Always include the current material
    allMats[materialName] = quantity;

    const recipeGroup = getRecipeByName(materialName);

    // If it has a recipe, also collect all materials from the recipe
    if (
      recipeGroup &&
      recipeGroup.recipes &&
      recipeGroup.recipes.length > 0 &&
      recipeGroup.recipes[0].materials &&
      recipeGroup.recipes[0].materials.length > 0
    ) {
      const recipe = recipeGroup.recipes[0];

      for (const material of recipe.materials) {
        const materialQuantity = (material.quantity || 1) * quantity;
        const subMaterials = collectAllMaterials(
          material.name,
          materialQuantity,
          depth + 1,
        );

        for (const [name, qty] of Object.entries(subMaterials)) {
          if (!allMats[name]) {
            allMats[name] = 0;
          }
          allMats[name] += qty;
        }
      }
    }

    return allMats;
  };

  const allMaterialsFlat: Record<string, number> = {};
  for (const [materialName, quantity] of Object.entries(materials)) {
    const allMats = collectAllMaterials(materialName, quantity);
    for (const [name, qty] of Object.entries(allMats)) {
      if (!allMaterialsFlat[name]) {
        allMaterialsFlat[name] = 0;
      }
      allMaterialsFlat[name] += qty;
    }
  }

  // Recursive component to render nested materials
  const renderNestedMaterial = (material: MaterialWithRecipe, depth = 0) => {
    return (
      <li key={`${material.name}-${depth}-${material.quantity}`}>
        <div>
          <strong>{material.name}</strong>: {material.quantity}
          {material.isCraftable &&
            material.recipeVariants &&
            material.recipeVariants.length > 0 && (
              <div className="mt-1">
                {material.recipeVariants.map((variant, variantIdx) => (
                  <div key={`variant-${variantIdx}`} className="mt-1">
                    {material.recipeVariants!.length > 1 && (
                      <div className="text-xs font-semibold text-gray-500">
                        Option {variantIdx + 1}
                        {variant.variantName && ` (${variant.variantName})`}:
                      </div>
                    )}
                    <ul className="list-circle pl-6 text-sm">
                      {variant.materials.map((subMat) =>
                        renderNestedMaterial(subMat, depth + 1),
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            )}
        </div>
      </li>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-3">
          List 1: Materials with Recipes (Deeply Nested)
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          {nestedMaterials.map((material) => renderNestedMaterial(material))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">List 2: All Base Materials</h2>
        <ul className="list-disc pl-5">
          {Object.entries(allBaseMaterials)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([material, quantity]) => (
              <li key={material}>
                {material}: {quantity}
              </li>
            ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">List 3: All Materials (Flat)</h2>
        <ul className="list-disc pl-5">
          {Object.entries(allMaterialsFlat)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([material, quantity]) => (
              <li key={material}>
                {material}: {quantity}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
