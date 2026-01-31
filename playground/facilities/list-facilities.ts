import { writeFileSync } from "fs";
import path from "path";

async function listFacilities() {
  const recipeData = await import("../recipes.json");

  const facilitySet = new Set<string>();

  recipeData.default.forEach((recipe) => {
    recipe.uses_facility?.forEach((facility) => {
      facilitySet.add(facility);
    });
  });

  const facilities = Array.from(facilitySet).sort((a, b) => a.localeCompare(b));

  writeFileSync(
    path.join(__dirname, "facilities.json"),
    JSON.stringify(facilities, null, 2),
  );
  console.log("✓ Facility types saved to facilities.json");
}

listFacilities().catch(console.error);
