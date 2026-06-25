import { SourceRecipe } from "@/scripts/fetch-data/types/recipe";
import { Facility, Material, Recipe } from "@/Types";
import { createHash } from "crypto";
import { applyFacilityNameOverride } from "./apply-facility-name-override";
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

  const facility = applyFacilityNameOverride(
    rawRecipe.json.facility,
  ) as (typeof Facility)[number];

  const quantity =
    typeof rawRecipe.json.output.quantity === "string"
      ? parseInt(rawRecipe.json.output.quantity)
      : 1;

  const outputItemId = idFromName(
    rawRecipe.json.output.item || rawRecipe.json.output.name,
  );

  const returnRecipe: Recipe = {
    id: createRecipeId(outputItemId, quantity, materials),
    facilities: facility ? [facility] : [],
    materials,
    quantity,
  };

  return returnRecipe;
}

function createRecipeId(
  outputItemId: string,
  quantity: number,
  materials: Material[],
): string {
  const materialsString = materials
    .map((mat) => `${mat.quantity}_${mat.itemId}`)
    .join("_");
  const materialsHash = createHash("sha256")
    .update(materialsString)
    .digest("hex")
    .substring(0, 12);

  return createHash("sha256")
    .update(`${outputItemId}_${quantity}_${materialsHash}`)
    .digest("hex")
    .substring(0, 12);
}
