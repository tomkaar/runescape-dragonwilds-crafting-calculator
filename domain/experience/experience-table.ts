/**
 * Cumulative XP required for each level, index 0 = level 1.
 * Source: https://dragonwilds.runescape.wiki/w/Experience
 *
 * This is a lookup table rather than a formula on purpose: levels 51-99
 * approximate a linear +144.4 XP/level curve, but patch 0.11.0.3 rebalanced
 * levels 93-99 specifically (including a manual +159 XP jump on 98 -> 99)
 * that no closed-form formula captures.
 */
const EXPERIENCE_TABLE: number[] = [
	0, 33, 70, 111, 156, 206, 261, 322, 389, 463, 545, 636, 736, 847, 969, 1104,
	1253, 1417, 1598, 1798, 2018, 2261, 2529, 2825, 3152, 3512, 3910, 4349, 4833,
	5367, 5957, 6608, 7326, 8118, 8993, 9958, 11023, 12199, 13496, 14929, 16510,
	18255, 20181, 22307, 24654, 27245, 30105, 33262, 36747, 40594, 44581, 48717,
	52997, 57421, 61990, 66702, 71560, 76562, 81708, 86998, 92433, 98012, 103735,
	109603, 115616, 121772, 128073, 134518, 141108, 147842, 154721, 161743,
	168910, 176222, 183678, 191278, 199022, 206911, 214944, 223122, 231444,
	239910, 248521, 257276, 266176, 275219, 284407, 293740, 303217, 312838,
	322604, 332514, 342568, 395129, 447689, 543044, 666881, 819200, 1000000,
];

export const MAX_LEVEL = EXPERIENCE_TABLE.length;

/** Cumulative XP floor for a level, clamped to [1, MAX_LEVEL]. */
export function xpForLevel(level: number): number {
	const clamped = Math.min(Math.max(level, 1), MAX_LEVEL);
	return EXPERIENCE_TABLE[clamped - 1];
}

/** The highest level whose XP floor is <= xp, clamped to [1, MAX_LEVEL]. */
export function levelForXp(xp: number): number {
	let level = 1;
	for (let i = 0; i < EXPERIENCE_TABLE.length; i++) {
		if (EXPERIENCE_TABLE[i] <= xp) level = i + 1;
		else break;
	}
	return level;
}
