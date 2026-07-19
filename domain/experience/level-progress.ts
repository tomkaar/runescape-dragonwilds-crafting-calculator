import { levelForXp, MAX_LEVEL, xpForLevel } from "./experience-table";

/**
 * A skill's current standing is just its XP - level is never stored
 * separately. Entering a level sets this to that level's XP floor; entering
 * exact XP sets it directly. Either input can be used on its own, and the
 * other always re-derives from whatever XP ends up here.
 */
export type SkillLevelEntry = {
	xp: number;
};

export type LevelProgressEntry = {
	skill: string;
	startLevel: number;
	startXp: number;
	newLevel: number;
	newXp: number;
	gainedXp: number;
	isMaxed: boolean;
	progressPercent: number;
	/** Cumulative XP required for newLevel + 1; null when isMaxed (no next level). */
	nextLevelXp: number | null;
};

/**
 * Combines each skill's stored level/XP with the XP a crafting plan would
 * grant it, producing the before/after level state the UI renders.
 *
 * `newXp` is intentionally never clamped at the level-99 XP floor - a maxed
 * skill keeps accumulating real XP in-game, and this mirrors that. Only the
 * derived *level* clamps at MAX_LEVEL, since there's no level past it.
 */
export function buildLevelProgress(
	levels: Record<string, SkillLevelEntry | undefined>,
	totals: { skill: string; experience: number }[],
): LevelProgressEntry[] {
	const gainedBySkill = new Map(totals.map((t) => [t.skill, t.experience]));

	return Object.entries(levels)
		.filter((entry): entry is [string, SkillLevelEntry] => !!entry[1])
		.map(([skill, entry]) => {
			const startXp = entry.xp;
			const gainedXp = gainedBySkill.get(skill) ?? 0;
			const newXp = startXp + gainedXp;
			const newLevel = levelForXp(newXp);
			const isMaxed = newLevel === MAX_LEVEL;

			const levelFloor = xpForLevel(newLevel);
			const levelSpan = xpForLevel(newLevel + 1) - levelFloor;
			const progressPercent = isMaxed
				? 100
				: Math.min(100, ((newXp - levelFloor) / levelSpan) * 100);

			return {
				skill,
				startLevel: levelForXp(startXp),
				startXp,
				newLevel,
				newXp,
				gainedXp,
				isMaxed,
				progressPercent,
				nextLevelXp: isMaxed ? null : xpForLevel(newLevel + 1),
			};
		});
}
