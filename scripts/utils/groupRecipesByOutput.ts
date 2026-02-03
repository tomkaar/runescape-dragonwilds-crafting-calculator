import extractVariantFromImage from "./extractVariantFromImage";
import { Recipe } from "./types";
import { generateRecipeVariantId } from "./generateRecipeVariantId";
import { createImageUrl } from "./createImageUrl";

export default function groupRecipesByOutput(recipes: Recipe[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped: Record<string, any> = {};

  recipes.forEach((recipe) => {
    if (!recipe.json || !recipe.json.output) return;

    const output = recipe.json.output;
    const baseName = output.name;
    const variant = extractVariantFromImage(output.image);
    const imageUrl = createImageUrl(output.image);

    // Create unique ID for the recipe variant based on materials
    const recipeVariantId = generateRecipeVariantId(recipe.json.materials);

    // Create group ID based on item name
    const groupId = baseName
      .replaceAll("'", "")
      .replaceAll("°", "")
      .replaceAll(" ", "_")
      .toLowerCase();

    // Initialize group if it doesn't exist
    if (!grouped[groupId]) {
      grouped[groupId] = {
        id: groupId,
        name: baseName,
        image: imageUrl || undefined,
        variant: variant || undefined,
        recipes: [],
      };
    }

    // Create variant object
    const recipeVariant = {
      id: recipeVariantId,
      name: variant ? `${baseName} (${variant})` : baseName,
      variant: variant || undefined,
      facility: recipe.json.facility,
      materials: recipe.json.materials?.map((material) => ({
        name: material.name,
        quantity:
          typeof material.quantity === "string"
            ? parseInt(material.quantity, 10)
            : material.quantity,
        link: material.link,
        image: createImageUrl(material.image) || undefined,
      })),
      skills: recipe.json.skills,
      output: {
        quantity:
          typeof output.quantity === "string"
            ? parseInt(output.quantity, 10)
            : output.quantity,
        name: output.name,
        link: output.link,
      },
    };

    grouped[groupId].recipes.push(recipeVariant);
  });

  return grouped;
}
