import { describe, expect, it } from "vitest";

import { filterItemIds } from "./filter-item-ids";

describe("filterItemIds", () => {
	it("returns all tracked ids when isAll is true", () => {
		expect(
			filterItemIds({
				isAll: true,
				selectedIds: [],
				trackedItemIds: ["axe", "bow", "sword"],
			}),
		).toEqual(["axe", "bow", "sword"]);
	});

	it("ignores selectedIds when isAll is true", () => {
		expect(
			filterItemIds({
				isAll: true,
				selectedIds: ["bow"],
				trackedItemIds: ["axe", "bow", "sword"],
			}),
		).toEqual(["axe", "bow", "sword"]);
	});

	it("returns only the selected ids when isAll is false", () => {
		expect(
			filterItemIds({
				isAll: false,
				selectedIds: ["axe", "sword"],
				trackedItemIds: ["axe", "bow", "sword"],
			}),
		).toEqual(["axe", "sword"]);
	});

	it("drops selected ids that are no longer tracked", () => {
		expect(
			filterItemIds({
				isAll: false,
				selectedIds: ["axe", "shield"],
				trackedItemIds: ["axe", "bow"],
			}),
		).toEqual(["axe"]);
	});

	it("preserves the tracked order rather than the selection order", () => {
		expect(
			filterItemIds({
				isAll: false,
				selectedIds: ["sword", "axe"],
				trackedItemIds: ["axe", "bow", "sword"],
			}),
		).toEqual(["axe", "sword"]);
	});

	it("returns an empty array when nothing is selected", () => {
		expect(
			filterItemIds({
				isAll: false,
				selectedIds: [],
				trackedItemIds: ["axe", "bow"],
			}),
		).toEqual([]);
	});

	it("returns an empty array when nothing is tracked", () => {
		expect(
			filterItemIds({
				isAll: true,
				selectedIds: [],
				trackedItemIds: [],
			}),
		).toEqual([]);
	});
});
