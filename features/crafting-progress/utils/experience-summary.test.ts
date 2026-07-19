/** biome-ignore-all lint/style/noNonNullAssertion: <ok for tests> */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeItem, makeRecipe, makeVariant } from "@/test/crafting-helpers";
import type { StepEntry } from "./build-steps";

vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>();
	return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock("@/utils/source-item-by-id", () => ({
	sourceItemById: vi.fn(),
}));

import { sourceItemById } from "@/utils/source-item-by-id";
import { buildSteps } from "./build-steps";
import {
	buildExperienceSummary,
	computeExperienceSummary,
	computeRootExperienceSummary,
} from "./experience-summary";

const mockSourceItemById = vi.mocked(sourceItemById);

function registerItems(items: Record<string, ReturnType<typeof makeItem>>) {
	mockSourceItemById.mockImplementation((id: string) => items[id]);
}

beforeEach(() => {
	mockSourceItemById.mockReset();
});

describe("computeExperienceSummary", () => {
	function stepEntry(
		overrides: Partial<StepEntry> & Pick<StepEntry, "itemId" | "quantity">,
	): StepEntry {
		return {
			name: overrides.itemId,
			image: null,
			parents: [],
			usedFor: [],
			depth: 0,
			hasChildren: false,
			coverageWarnings: [],
			recipeContributions: [],
			facilities: [],
			...overrides,
		};
	}

	it("sums experience for the same skill across multiple steps", () => {
		const steps = [
			stepEntry({
				itemId: "a",
				quantity: 5,
				recipeContributions: [
					{
						skills: [{ name: "Construction", experience: 8 }],
						recipeQuantity: 1,
						remainingQuantity: 5,
					},
				],
			}),
			stepEntry({
				itemId: "b",
				quantity: 2,
				recipeContributions: [
					{
						skills: [{ name: "Construction", experience: 10 }],
						recipeQuantity: 1,
						remainingQuantity: 2,
					},
				],
			}),
		];
		expect(computeExperienceSummary(steps)).toEqual({
			totals: [{ skill: "Construction", experience: 60 }],
			ambiguousItemNames: [],
		});
	});

	it("rounds up to whole craft actions before applying experience", () => {
		const steps = [
			stepEntry({
				itemId: "a",
				quantity: 10,
				recipeContributions: [
					{
						skills: [{ name: "Cooking", experience: 5 }],
						recipeQuantity: 4,
						remainingQuantity: 10,
					},
				],
			}),
		];
		// ceil(10 / 4) = 3 craft actions * 5xp = 15
		expect(computeExperienceSummary(steps)).toEqual({
			totals: [{ skill: "Cooking", experience: 15 }],
			ambiguousItemNames: [],
		});
	});

	it("ignores contributions from recipes that grant no skills", () => {
		const steps = [
			stepEntry({
				itemId: "a",
				quantity: 5,
				recipeContributions: [
					{ skills: [], recipeQuantity: 1, remainingQuantity: 5 },
				],
			}),
		];
		expect(computeExperienceSummary(steps)).toEqual({
			totals: [],
			ambiguousItemNames: [],
		});
	});

	it("sorts skills by descending experience", () => {
		const steps = [
			stepEntry({
				itemId: "a",
				quantity: 1,
				recipeContributions: [
					{
						skills: [{ name: "Farming", experience: 5 }],
						recipeQuantity: 1,
						remainingQuantity: 1,
					},
				],
			}),
			stepEntry({
				itemId: "b",
				quantity: 1,
				recipeContributions: [
					{
						skills: [{ name: "Cooking", experience: 50 }],
						recipeQuantity: 1,
						remainingQuantity: 1,
					},
				],
			}),
		];
		expect(computeExperienceSummary(steps).totals.map((s) => s.skill)).toEqual([
			"Cooking",
			"Farming",
		]);
	});

	it("flags a step's item name as ambiguous when more than one recipe contributed to it", () => {
		const steps = [
			stepEntry({
				itemId: "a",
				name: "Refined Obsidian",
				quantity: 5,
				recipeContributions: [
					{
						skills: [{ name: "Artisan", experience: 8 }],
						recipeQuantity: 1,
						remainingQuantity: 2,
					},
					{
						skills: [{ name: "Artisan", experience: 12 }],
						recipeQuantity: 1,
						remainingQuantity: 3,
					},
				],
			}),
		];
		expect(computeExperienceSummary(steps).ambiguousItemNames).toEqual([
			"Refined Obsidian",
		]);
	});

	it("rolls up the recipe contributions buildSteps attaches to each step", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(makeRecipe(1, [{ itemId: "leaf", quantity: 20 }])),
			]),
			leaf: makeItem("leaf", [
				makeVariant(
					makeRecipe(4, [], [], [{ name: "Cooking", experience: 5 }]),
				),
			]),
		});

		const steps = buildSteps({
			filteredItemIds: ["root"],
			allItems: {
				root: [
					{
						id: "m1",
						itemId: "leaf",
						quantity: 20,
						nodeId: "root_leaf",
						state: "TODO",
					},
				],
			},
			multipliers: { root: 1 },
			owned: { leaf: 12 },
		});

		// remaining leaf = 8, ceil(8 / 4) = 2 craft actions * 5xp = 10
		expect(computeExperienceSummary(steps)).toEqual({
			totals: [{ skill: "Cooking", experience: 10 }],
			ambiguousItemNames: [],
		});
	});
});

describe("computeRootExperienceSummary", () => {
	it("attributes experience to the tracked item's own recipe, not just its materials", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(
					makeRecipe(
						1,
						[{ itemId: "leaf", quantity: 5 }],
						[],
						[{ name: "Construction", experience: 8 }],
					),
				),
			]),
			leaf: makeItem("leaf", [makeVariant(null)]),
		});

		const result = computeRootExperienceSummary({
			filteredItemIds: ["root"],
			allItems: {
				root: [
					{
						id: "m1",
						itemId: "leaf",
						quantity: 5,
						nodeId: "root_leaf",
						state: "TODO",
					},
				],
			},
			multipliers: { root: 3 },
		});

		// 3 crafts of root (recipe yields 1 each) * 8xp = 24
		expect(result).toEqual({
			totals: [{ skill: "Construction", experience: 24 }],
			ambiguousItemNames: [],
		});
	});

	it("rounds up to whole craft actions when the root recipe yields more than one", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(
					makeRecipe(
						4,
						[{ itemId: "leaf", quantity: 1 }],
						[],
						[{ name: "Cooking", experience: 5 }],
					),
				),
			]),
			leaf: makeItem("leaf", [makeVariant(null)]),
		});

		const result = computeRootExperienceSummary({
			filteredItemIds: ["root"],
			allItems: {
				root: [
					{
						id: "m1",
						itemId: "leaf",
						quantity: 10,
						nodeId: "root_leaf",
						state: "TODO",
					},
				],
			},
			multipliers: { root: 10 },
		});

		// ceil(10 / 4) = 3 craft actions * 5xp = 15
		expect(result).toEqual({
			totals: [{ skill: "Cooking", experience: 15 }],
			ambiguousItemNames: [],
		});
	});

	it("returns nothing when the tracked item has no marked materials yet", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(
					makeRecipe(1, [], [], [{ name: "Construction", experience: 8 }]),
				),
			]),
		});

		const result = computeRootExperienceSummary({
			filteredItemIds: ["root"],
			allItems: {},
			multipliers: { root: 3 },
		});

		expect(result).toEqual({ totals: [], ambiguousItemNames: [] });
	});

	it("infers the active variant from a marked descendant for a multi-variant root", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(
					makeRecipe(
						1,
						[{ itemId: "leaf", quantity: 2 }],
						[],
						[{ name: "Construction", experience: 8 }],
						"recipeA",
					),
				),
				makeVariant(
					makeRecipe(
						1,
						[{ itemId: "leaf", quantity: 3 }],
						[],
						[{ name: "Farming", experience: 20 }],
						"recipeB",
					),
				),
			]),
			leaf: makeItem("leaf", [makeVariant(null)]),
		});

		const result = computeRootExperienceSummary({
			filteredItemIds: ["root"],
			allItems: {
				// Marked under the first variant's path ("root_v0_...") only.
				root: [
					{
						id: "m1",
						itemId: "leaf",
						quantity: 2,
						nodeId: "root_v0_leaf",
						state: "TODO",
					},
				],
			},
			multipliers: { root: 1 },
		});

		expect(result).toEqual({
			totals: [{ skill: "Construction", experience: 8 }],
			ambiguousItemNames: [],
		});
	});

	it("flags the tracked item as ambiguous and only counts one recipe when materials are marked under two variants", () => {
		// Mirrors the reported bug: "30° Hip Roof" has Cabin/Cottage/Castle
		// variants; marking materials under both Cabin and Cottage means
		// there's no way to know which recipe will actually be crafted.
		registerItems({
			"30-hip-roof": makeItem(
				"30-hip-roof",
				[
					makeVariant(
						makeRecipe(
							1,
							[{ itemId: "ash-logs", quantity: 6 }],
							[],
							[{ name: "Construction", experience: 12 }],
							"cabin",
						),
					),
					makeVariant(
						makeRecipe(
							1,
							[{ itemId: "oak-logs", quantity: 6 }],
							[],
							[{ name: "Construction", experience: 18 }],
							"cottage",
						),
					),
				],
				"30° Hip Roof",
			),
			"ash-logs": makeItem("ash-logs", [makeVariant(null)]),
			"oak-logs": makeItem("oak-logs", [makeVariant(null)]),
		});

		const result = computeRootExperienceSummary({
			filteredItemIds: ["30-hip-roof"],
			allItems: {
				"30-hip-roof": [
					{
						id: "m1",
						itemId: "ash-logs",
						quantity: 6,
						nodeId: "30-hip-roof_v0_ash-logs",
						state: "TODO",
					},
					{
						id: "m2",
						itemId: "oak-logs",
						quantity: 6,
						nodeId: "30-hip-roof_v1_oak-logs",
						state: "TODO",
					},
				],
			},
			multipliers: { "30-hip-roof": 1 },
		});

		// Only the first active variant's experience is counted (12, not 12+18) —
		// the point of the ambiguity flag is that this number isn't trustworthy.
		expect(result.totals).toEqual([{ skill: "Construction", experience: 12 }]);
		expect(result.ambiguousItemNames).toEqual(["30° Hip Roof"]);
	});
});

describe("buildExperienceSummary", () => {
	it("adds the root item's own crafting experience to its ingredients' experience for the same skill", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(
					makeRecipe(
						1,
						[{ itemId: "plank", quantity: 4 }],
						[],
						[{ name: "Construction", experience: 8 }],
					),
				),
			]),
			plank: makeItem("plank", [
				makeVariant(
					makeRecipe(1, [], [], [{ name: "Construction", experience: 2 }]),
				),
			]),
		});

		const params = {
			filteredItemIds: ["root"],
			allItems: {
				root: [
					{
						id: "m1",
						itemId: "plank",
						quantity: 4,
						nodeId: "root_plank",
						state: "TODO" as const,
					},
				],
			},
			multipliers: { root: 1 },
			owned: {},
		};

		// root: 1 craft * 8xp = 8; plank: 4 crafts * 2xp = 8; combined = 16
		expect(buildExperienceSummary(params)).toEqual({
			totals: [{ skill: "Construction", experience: 16 }],
			ambiguousItemNames: [],
		});
	});

	it("merges ambiguous item names from both the root item and its ingredients", () => {
		registerItems({
			root: makeItem(
				"root",
				[
					makeVariant(
						makeRecipe(
							1,
							[{ itemId: "leafA", quantity: 1 }],
							[],
							[{ name: "Construction", experience: 12 }],
							"recipeA",
						),
					),
					makeVariant(
						makeRecipe(
							1,
							[{ itemId: "leafB", quantity: 1 }],
							[],
							[{ name: "Construction", experience: 18 }],
							"recipeB",
						),
					),
				],
				"Root Item",
			),
			leafA: makeItem("leafA", [makeVariant(null)]),
			leafB: makeItem("leafB", [makeVariant(null)]),
		});

		const params = {
			filteredItemIds: ["root"],
			allItems: {
				root: [
					{
						id: "m1",
						itemId: "leafA",
						quantity: 1,
						nodeId: "root_v0_leafA",
						state: "TODO" as const,
					},
					{
						id: "m2",
						itemId: "leafB",
						quantity: 1,
						nodeId: "root_v1_leafB",
						state: "TODO" as const,
					},
				],
			},
			multipliers: { root: 1 },
			owned: {},
		};

		expect(buildExperienceSummary(params).ambiguousItemNames).toEqual([
			"Root Item",
		]);
	});
});
