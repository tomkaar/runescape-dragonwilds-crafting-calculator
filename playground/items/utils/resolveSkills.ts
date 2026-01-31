import { RawRecipe } from "@/playground/recipes";
import { Item } from "@/Types";

export function resolveSkills(recipes: RawRecipe[]): Item["skills"] {
  // collect all unique skills from the recipes
  const skillsSet = new Set<string>();

  recipes.forEach((recipe) => {
    recipe.uses_skill?.forEach((skill) => {
      if (skill) {
        skillsSet.add(skill);
      }
    });
  });

  if (skillsSet.size > 0) {
    return Array.from(skillsSet) as Item["skills"];
  }

  return [];
}
