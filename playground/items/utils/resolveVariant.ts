import { ItemVariant } from "@/Types";
import { createHash } from "crypto";
import { extractVariantFromImage } from "../utils/extractVariantFromImage";
import { RawRecipe } from "../../recipes";
import { resolveRecipe } from "./resolveRecipe";

export function resolveVariant(rawRecipe: RawRecipe): ItemVariant | null {
  const recipe = resolveRecipe(rawRecipe);
  const variantName =
    extractVariantFromImage(rawRecipe.json.output.image) || null;

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
