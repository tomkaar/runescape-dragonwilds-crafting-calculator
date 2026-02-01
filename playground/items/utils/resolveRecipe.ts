import { RawRecipe as RawRecipe } from "../../recipes";
import { Facility, Material, Recipe } from "@/Types";
import { itemIdFromName } from "./itemIdFromName";
import { createHash } from "crypto";

export function resolveRecipe(rawRecipe: RawRecipe): Recipe {
  const materials: Material[] = rawRecipe.json.materials
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((mat) => ({
      itemId: itemIdFromName(mat.name),
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
