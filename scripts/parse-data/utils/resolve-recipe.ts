import { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import { Facility, Material, Recipe } from "@/Types";
import { createHash } from "crypto";
import { idFromName } from "./id-from-name";

export function resolveRecipe(rawRecipe: SourceRecipe): Recipe {
  const materials: Material[] = rawRecipe.json.materials
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((mat) => ({
      itemId: idFromName(mat.name),
      quantity:
        typeof mat.quantity === "string"
          ? parseFloat(mat.quantity) || 1
          : mat.quantity || 1,
    }));

  const facility = rawRecipe.json.facility as (typeof Facility)[number];

  const returnRecipe: Recipe = {
    id: createRecipeId(facility, materials),
    facility,
    materials,
    quantity:
      typeof rawRecipe.json.output.quantity === "string"
        ? parseInt(rawRecipe.json.output.quantity)
        : 1,
  };

  return returnRecipe;
}

function createRecipeId(facility: string, materials: Material[]): string {
  const materialsString = materials
    .map((mat) => `${mat.quantity}_${mat.itemId}`)
    .join("_");
  const materialsHash = createHash("sha256")
    .update(materialsString)
    .digest("hex")
    .substring(0, 12);

  return createHash("sha256")
    .update(`${materialsHash}_${facility}`)
    .digest("hex")
    .substring(0, 12);
}
