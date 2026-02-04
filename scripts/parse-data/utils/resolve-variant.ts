import { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import { ItemVariant } from "@/Types";
import { createHash } from "crypto";
import variantFromImage from "./variant-from-image";
import { resolveRecipe } from "./resolve-recipe";

export function resolveVariant(rawRecipe: SourceRecipe): ItemVariant | null {
  const recipe = resolveRecipe(rawRecipe);
  const variantName = variantFromImage(rawRecipe.json.output.image) || null;

  const variantIdParts: Record<string, string> = {
    recipeId: recipe.id,
    variantName: variantName || "default",
  };
  const variantIdString = Object.values(variantIdParts).join("|");
  const variantId = createHash("sha256")
    .update(variantIdString)
    .digest("hex")
    .substring(0, 12);

  return {
    id: variantId,
    name: rawRecipe.json.output.name,
    variantName,
    recipe,
  };
}
