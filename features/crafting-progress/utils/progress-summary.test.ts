import { describe, expect, it } from "vitest";

import type { OwnedMaterialEntry } from "../types/owned-material-entry";
import { buildProgressSummary } from "./progress-summary";

function makeRow(
	itemId: string,
	adjustedValue: number,
	total: number = adjustedValue,
): OwnedMaterialEntry {
	return {
		itemId,
		name: `${itemId}-name`,
		image: null,
		total,
		adjustedValue,
		nodeRefs: [],
	};
}

describe("buildProgressSummary", () => {
	it("returns 100% complete when there are no rows", () => {
		expect(buildProgressSummary([], {})).toEqual({
			readyCount: 0,
			totalNeeded: 0,
			totalOwned: 0,
			percentComplete: 100,
		});
	});

	it("treats missing owned quantities as zero", () => {
		const rows = [makeRow("iron-ore", 10)];
		expect(buildProgressSummary(rows, {})).toEqual({
			readyCount: 0,
			totalNeeded: 10,
			totalOwned: 0,
			percentComplete: 0,
		});
	});

	it("counts a row as ready once owned meets or exceeds the adjusted value", () => {
		const rows = [makeRow("iron-ore", 10)];
		expect(buildProgressSummary(rows, { "iron-ore": 10 }).readyCount).toBe(1);
		expect(buildProgressSummary(rows, { "iron-ore": 9 }).readyCount).toBe(0);
	});

	it("clamps totalOwned contribution per row to that row's adjusted value", () => {
		const rows = [makeRow("iron-ore", 10)];
		const summary = buildProgressSummary(rows, { "iron-ore": 50 });
		expect(summary.totalOwned).toBe(10);
		expect(summary.percentComplete).toBe(100);
	});

	it("aggregates across multiple rows", () => {
		const rows = [makeRow("iron-ore", 10), makeRow("wood", 20)];
		const summary = buildProgressSummary(rows, { "iron-ore": 10, wood: 5 });
		expect(summary).toEqual({
			readyCount: 1,
			totalNeeded: 30,
			totalOwned: 15,
			percentComplete: 50,
		});
	});

	it("rounds percentComplete to the nearest integer", () => {
		const rows = [makeRow("iron-ore", 3)];
		const summary = buildProgressSummary(rows, { "iron-ore": 1 });
		expect(summary.percentComplete).toBe(33);
	});

	it("uses the adjusted value rather than the total", () => {
		const rows = [makeRow("iron-ore", 4, 8)];
		expect(buildProgressSummary(rows, { "iron-ore": 4 })).toEqual({
			readyCount: 1,
			totalNeeded: 4,
			totalOwned: 4,
			percentComplete: 100,
		});
	});

	it("counts a row with an adjusted value of 0 as ready", () => {
		const rows = [makeRow("iron-ore", 0, 8), makeRow("wood", 10)];
		expect(buildProgressSummary(rows, {})).toEqual({
			readyCount: 1,
			totalNeeded: 10,
			totalOwned: 0,
			percentComplete: 0,
		});
	});
});
