import { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import { itemImageOverrides } from "./overrides/items.image.overrides";
import { recipeImageOverrides } from "./overrides/recipes.image.overrides";

/**
 * Resolves the appropriate image for a given recipe or item based on configured overrides.
 */
export function resolveConfiguredImage(
  recipe?: SourceRecipe,
  itemName?: string,
): string | null {
  if (!recipe) {
    if (!itemName) {
      return null;
    }

    const matchedItemOverride = itemImageOverrides.find(
      (override) => normalize(override.itemName) === normalize(itemName),
    );
    return matchedItemOverride?.image || null;
  }

  const outputName = recipe.json.output.name || recipe.output?.[0];
  if (!outputName) {
    return null;
  }

  const recipeMaterials = getRecipeMaterials(recipe);

  for (const override of recipeImageOverrides) {
    if (normalize(override.output) !== normalize(outputName)) {
      continue;
    }

    if (!override.usesMaterial || override.usesMaterial.length === 0) {
      return override.image;
    }

    if (equalStringSets(recipeMaterials, override.usesMaterial)) {
      return override.image;
    }
  }

  if (itemName) {
    const matchedItemOverride = itemImageOverrides.find(
      (override) => normalize(override.itemName) === normalize(itemName),
    );
    if (matchedItemOverride) {
      return matchedItemOverride.image;
    }
  }

  return null;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function equalStringSets(left: string[], right: string[]): boolean {
  const leftSet = [...new Set(left.map(normalize))].sort();
  const rightSet = [...new Set(right.map(normalize))].sort();

  if (leftSet.length !== rightSet.length) {
    return false;
  }

  return leftSet.every((value, index) => value === rightSet[index]);
}

function getRecipeMaterials(recipe: SourceRecipe): string[] {
  if (recipe.uses_material && recipe.uses_material.length > 0) {
    return recipe.uses_material;
  }

  return recipe.json.materials.map((material) => material.name);
}
