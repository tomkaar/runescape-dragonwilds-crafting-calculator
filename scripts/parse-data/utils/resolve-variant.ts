import { createHash } from "node:crypto";
import type { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import type { ItemVariant } from "@/Types";
import { resolveImage } from "./resolve-image";
import { resolveRecipe } from "./resolve-recipe";
import variantFromImage from "./variant-from-image";

export function resolveVariant(rawRecipe: SourceRecipe): ItemVariant {
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
		image: resolveImage(rawRecipe, [], rawRecipe.json.output.name),
		variantName,
		recipe,
		usesRecipe: rawRecipe.uses_recipe?.length ? rawRecipe.uses_recipe : null,
	};
}
