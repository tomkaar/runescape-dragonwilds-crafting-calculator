import { describe, expect, it } from "vitest";
import { xpForLevel } from "./experience-table";
import { buildLevelProgress } from "./level-progress";

describe("buildLevelProgress", () => {
	it("ignores skills with no stored level entry", () => {
		const result = buildLevelProgress({ Cooking: undefined }, [
			{ skill: "Cooking", experience: 100 },
		]);
		expect(result).toEqual([]);
	});

	it("derives the start level from stored XP set via a level (its XP floor)", () => {
		const result = buildLevelProgress({ Cooking: { xp: xpForLevel(50) } }, []);
		expect(result[0]).toMatchObject({ startLevel: 50, startXp: 40594 });
	});

	it("derives the start level from stored XP set directly (exact XP, not a floor)", () => {
		const result = buildLevelProgress({ Cooking: { xp: 42000 } }, []);
		expect(result[0]).toMatchObject({ startLevel: 50, startXp: 42000 });
	});

	it("stays flat (no level-up) when gained XP doesn't cross the next threshold", () => {
		const result = buildLevelProgress({ Cooking: { xp: 40594 } }, [
			{ skill: "Cooking", experience: 100 },
		]);
		expect(result[0]).toMatchObject({
			startLevel: 50,
			newLevel: 50,
			newXp: 40694,
			gainedXp: 100,
			isMaxed: false,
			nextLevelXp: 44581,
		});
		// 100 / (44581 - 40594) into level 50
		expect(result[0].progressPercent).toBeCloseTo((100 / 3987) * 100, 5);
	});

	it("crosses a single level", () => {
		const result = buildLevelProgress({ Cooking: { xp: 40594 } }, [
			{ skill: "Cooking", experience: 4000 },
		]);
		expect(result[0]).toMatchObject({ startLevel: 50, newLevel: 51 });
	});

	it("crosses multiple levels in one jump", () => {
		const result = buildLevelProgress(
			{ Construction: { xp: xpForLevel(40) } },
			[{ skill: "Construction", experience: 20000 }],
		);
		// L40 floor = 14929; +20000 = 34929, which lands in L48 (33262) before L49 (36747)
		expect(result[0].startLevel).toBe(40);
		expect(result[0].newLevel).toBe(48);
	});

	it("treats a skill with no XP contribution from the plan as unchanged", () => {
		const result = buildLevelProgress({ Farming: { xp: xpForLevel(30) } }, []);
		expect(result[0]).toMatchObject({
			startLevel: 30,
			newLevel: 30,
			gainedXp: 0,
		});
	});

	it("marks level 99 as maxed and keeps accumulating XP past 1,000,000", () => {
		const result = buildLevelProgress({ Artisan: { xp: 1000000 } }, [
			{ skill: "Artisan", experience: 50000 },
		]);
		expect(result[0]).toMatchObject({
			newLevel: 99,
			newXp: 1050000,
			isMaxed: true,
			progressPercent: 100,
			nextLevelXp: null,
		});
	});

	it("reaches maxed exactly when a jump lands on 1,000,000", () => {
		const result = buildLevelProgress({ Runecrafting: { xp: 819200 } }, [
			{ skill: "Runecrafting", experience: 180800 },
		]);
		expect(result[0]).toMatchObject({
			newLevel: 99,
			newXp: 1000000,
			isMaxed: true,
			nextLevelXp: null,
		});
	});
});
