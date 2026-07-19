import { describe, expect, it } from "vitest";
import { levelForXp, MAX_LEVEL, xpForLevel } from "./experience-table";

describe("xpForLevel", () => {
	it("returns the verified milestones from the Dragonwilds wiki", () => {
		expect(xpForLevel(1)).toBe(0);
		expect(xpForLevel(50)).toBe(40594);
		expect(xpForLevel(92)).toBe(332514);
		expect(xpForLevel(99)).toBe(1000000);
	});

	it("clamps below level 1 up to level 1", () => {
		expect(xpForLevel(0)).toBe(0);
		expect(xpForLevel(-5)).toBe(0);
	});

	it("clamps above MAX_LEVEL down to MAX_LEVEL", () => {
		expect(xpForLevel(150)).toBe(1000000);
		expect(MAX_LEVEL).toBe(99);
	});
});

describe("levelForXp", () => {
	it("resolves exactly on a level's XP floor", () => {
		expect(levelForXp(40594)).toBe(50);
		expect(levelForXp(332514)).toBe(92);
	});

	it("resolves one XP below a level's floor to the prior level", () => {
		expect(levelForXp(40593)).toBe(49);
	});

	it("resolves the post-patch 93-99 rebalance correctly", () => {
		expect(levelForXp(342568)).toBe(93);
		expect(levelForXp(395128)).toBe(93);
		expect(levelForXp(395129)).toBe(94);
	});

	it("clamps at MAX_LEVEL for XP at or beyond 1,000,000", () => {
		expect(levelForXp(1000000)).toBe(99);
		expect(levelForXp(5000000)).toBe(99);
	});

	it("returns level 1 for 0 XP", () => {
		expect(levelForXp(0)).toBe(1);
	});
});
