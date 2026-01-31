import { writeFileSync } from "fs";
import path from "path";

async function listSkills() {
  const recipeData = await import("../recipes.json");

  const skillSet = new Set<string>();

  recipeData.default.forEach((recipe) => {
    recipe.uses_skill?.forEach((skill) => {
      skillSet.add(skill);
    });
  });

  const skills = Array.from(skillSet).sort((a, b) => a.localeCompare(b));
  writeFileSync(
    path.join(__dirname, "skills.json"),
    JSON.stringify(skills, null, 2),
  );
  console.log("✓ Skills saved to skills.json");
}

listSkills().catch(console.error);
