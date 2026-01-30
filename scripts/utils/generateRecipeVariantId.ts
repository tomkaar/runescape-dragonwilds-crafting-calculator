import { createHash } from "crypto";
import { RecipeMaterial } from "./types";

export function generateRecipeVariantId(materials?: RecipeMaterial[]): string {
  if (!materials || materials.length === 0) {
    return "no_materials";
  }

  // Sort materials by name
  const sortedMaterials = [...materials].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  // Create string: quantity_materialName_quantity_materialName
  const materialsString = sortedMaterials
    .map((m) => `${m.quantity}_${m.name.replace(/\s/g, "_").substring(0, 6)}`)
    .join("_")
    .toLowerCase();

  // Hash the string to get a shorter unique ID
  const hash = createHash("sha256")
    .update(materialsString)
    .digest("hex")
    .substring(0, 12); // Take first 12 characters for shorter ID

  return hash;
}
