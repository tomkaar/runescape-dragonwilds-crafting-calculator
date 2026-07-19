import type { ItemVariant, RecipeSkill } from "@/Types";

export type ItemExperience = {
	skill: RecipeSkill["name"];
	min: number;
	max: number;
};

/**
 * Resolves the skill experience gained from crafting an item itself, using
 * each variant's own recipe only — never the recipes of its ingredients.
 * Variants that grant 0 experience are excluded (mirrors how
 * computeExperienceSummary already treats 0 as "nothing to report" rather
 * than a real amount), and a variant with no recipe or no skill contributes
 * nothing. Recipes never grant XP in more than one skill in current data, so
 * only the first skill entry per recipe is used.
 */
export function resolveItemExperience(
	variants: ItemVariant[],
): ItemExperience | null {
	const amounts = variants
		.map((variant) => variant.recipe?.skills[0])
		.filter((skill): skill is RecipeSkill => !!skill && skill.experience > 0);

	if (amounts.length === 0) return null;

	const experiences = amounts.map((skill) => skill.experience);

	return {
		skill: amounts[0].name,
		min: Math.min(...experiences),
		max: Math.max(...experiences),
	};
}
