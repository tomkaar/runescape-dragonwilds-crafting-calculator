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
import {
	buildSteps,
	computeCoverageWarnings,
	computeRemainingQuantities,
} from "./build-steps";

const mockSourceItemById = vi.mocked(sourceItemById);

function registerItems(items: Record<string, ReturnType<typeof makeItem>>) {
	mockSourceItemById.mockImplementation((id: string) => items[id]);
}

beforeEach(() => {
	mockSourceItemById.mockReset();
});

describe("buildSteps", () => {
	it("includes a marked single-level material with its raw quantity", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(makeRecipe(1, [{ itemId: "leaf", quantity: 5 }])),
			]),
			leaf: makeItem("leaf", [makeVariant(null)]),
		});

		const result = buildSteps({
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
			multipliers: { root: 1 },
			owned: {},
		});

		expect(result).toEqual([
			expect.objectContaining({
				itemId: "leaf",
				quantity: 5,
				depth: 1,
				hasChildren: false,
			}),
		]);
	});

	it("excludes materials marked DONE", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(
					makeRecipe(1, [
						{ itemId: "leafDone", quantity: 3 },
						{ itemId: "leafTodo", quantity: 4 },
					]),
				),
			]),
			leafDone: makeItem("leafDone", [makeVariant(null)]),
			leafTodo: makeItem("leafTodo", [makeVariant(null)]),
		});

		const result = buildSteps({
			filteredItemIds: ["root"],
			allItems: {
				root: [
					{
						id: "m1",
						itemId: "leafDone",
						quantity: 3,
						nodeId: "root_leafDone",
						state: "DONE",
					},
					{
						id: "m2",
						itemId: "leafTodo",
						quantity: 4,
						nodeId: "root_leafTodo",
						state: "TODO",
					},
				],
			},
			multipliers: { root: 1 },
			owned: {},
		});

		expect(result).toHaveLength(1);
		expect(result[0].itemId).toBe("leafTodo");
	});

	it("nets a flat single-level material against owned stock", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(makeRecipe(1, [{ itemId: "leaf", quantity: 20 }])),
			]),
			leaf: makeItem("leaf", [makeVariant(null)]),
		});

		const result = buildSteps({
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
			owned: { leaf: 15 },
		});

		expect(result[0].quantity).toBe(5);
	});

	it("cascades owned stock of an intermediate material down to its own ingredients", () => {
		// root needs 48 mid; mid needs 9 leaf each (raw leaf demand = 432).
		// Owning 25 of the 48 mid means only 23 need crafting, so only
		// 23 * 9 = 207 leaf are actually needed — netted against 100 owned leaf = 107.
		registerItems({
			root: makeItem("root", [
				makeVariant(makeRecipe(1, [{ itemId: "mid", quantity: 48 }])),
			]),
			mid: makeItem("mid", [
				makeVariant(makeRecipe(1, [{ itemId: "leaf", quantity: 9 }])),
			]),
			leaf: makeItem("leaf", [makeVariant(null)]),
		});

		const result = buildSteps({
			filteredItemIds: ["root"],
			allItems: {
				root: [
					{
						id: "m1",
						itemId: "mid",
						quantity: 48,
						nodeId: "root_mid",
						state: "TODO",
					},
					{
						id: "m2",
						itemId: "leaf",
						quantity: 432,
						nodeId: "root_mid_leaf",
						state: "TODO",
					},
				],
			},
			multipliers: { root: 1 },
			owned: { mid: 25, leaf: 100 },
		});

		const mid = result.find((r) => r.itemId === "mid")!;
		const leaf = result.find((r) => r.itemId === "leaf")!;
		expect(mid.quantity).toBe(23);
		expect(leaf.quantity).toBe(107);
		// "used for" quantity reflects mid's own corrected remaining count, not the stale gross total.
		expect(leaf.parents).toEqual([
			expect.objectContaining({ itemId: "mid", quantity: 23 }),
		]);
	});

	it("aggregates a shared intermediate and leaf across independent tracked items", () => {
		// rootA needs 10 mid, rootB needs 20 mid — 30 gross, 10 owned -> 20 remaining.
		// mid needs 9 leaf each -> 270 gross leaf, scaled by mid's 20/30 deficit ratio -> 180 remaining.
		registerItems({
			rootA: makeItem("rootA", [
				makeVariant(makeRecipe(1, [{ itemId: "mid", quantity: 10 }])),
			]),
			rootB: makeItem("rootB", [
				makeVariant(makeRecipe(1, [{ itemId: "mid", quantity: 20 }])),
			]),
			mid: makeItem("mid", [
				makeVariant(makeRecipe(1, [{ itemId: "leaf", quantity: 9 }])),
			]),
			leaf: makeItem("leaf", [makeVariant(null)]),
		});

		const result = buildSteps({
			filteredItemIds: ["rootA", "rootB"],
			allItems: {
				rootA: [
					{
						id: "a1",
						itemId: "mid",
						quantity: 10,
						nodeId: "rootA_mid",
						state: "TODO",
					},
					{
						id: "a2",
						itemId: "leaf",
						quantity: 90,
						nodeId: "rootA_mid_leaf",
						state: "TODO",
					},
				],
				rootB: [
					{
						id: "b1",
						itemId: "mid",
						quantity: 20,
						nodeId: "rootB_mid",
						state: "TODO",
					},
					{
						id: "b2",
						itemId: "leaf",
						quantity: 180,
						nodeId: "rootB_mid_leaf",
						state: "TODO",
					},
				],
			},
			multipliers: { rootA: 1, rootB: 1 },
			owned: { mid: 10 },
		});

		const mid = result.find((r) => r.itemId === "mid")!;
		const leaf = result.find((r) => r.itemId === "leaf")!;
		expect(mid.quantity).toBe(20);
		expect(leaf.quantity).toBe(180);
		expect(leaf.usedFor.map((u) => u.itemId).sort()).toEqual([
			"rootA",
			"rootB",
		]);
	});

	it("keeps a root tracked item as a parent when a material is also used directly by it", () => {
		// rootA needs 3 mid, mid needs 2 leaf each (6 leaf via mid).
		// rootB needs 4 leaf directly — rootB is never itself a "marked" step,
		// so it has no aggregated/remainingMap entry, but should still show up
		// as a "used for" parent instead of being silently dropped.
		registerItems({
			rootA: makeItem("rootA", [
				makeVariant(makeRecipe(1, [{ itemId: "mid", quantity: 3 }])),
			]),
			rootB: makeItem("rootB", [
				makeVariant(makeRecipe(1, [{ itemId: "leaf", quantity: 4 }])),
			]),
			mid: makeItem("mid", [
				makeVariant(makeRecipe(1, [{ itemId: "leaf", quantity: 2 }])),
			]),
			leaf: makeItem("leaf", [makeVariant(null)]),
		});

		const result = buildSteps({
			filteredItemIds: ["rootA", "rootB"],
			allItems: {
				rootA: [
					{
						id: "a1",
						itemId: "mid",
						quantity: 3,
						nodeId: "rootA_mid",
						state: "TODO",
					},
					{
						id: "a2",
						itemId: "leaf",
						quantity: 6,
						nodeId: "rootA_mid_leaf",
						state: "TODO",
					},
				],
				rootB: [
					{
						id: "b1",
						itemId: "leaf",
						quantity: 4,
						nodeId: "rootB_leaf",
						state: "TODO",
					},
				],
			},
			multipliers: { rootA: 1, rootB: 1 },
			owned: {},
		});

		const leaf = result.find((r) => r.itemId === "leaf")!;
		expect(leaf.quantity).toBe(10);
		expect(leaf.parents).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ itemId: "mid", quantity: 3 }),
				expect.objectContaining({ itemId: "rootB", quantity: 1 }),
			]),
		);
		expect(leaf.parents).toHaveLength(2);
	});

	it("sorts deepest materials first, then intermediates before leaves, then by name", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(
					makeRecipe(1, [
						{ itemId: "mid", quantity: 1 },
						{ itemId: "alpha", quantity: 1 },
					]),
				),
			]),
			mid: makeItem("mid", [
				makeVariant(makeRecipe(1, [{ itemId: "zeta", quantity: 1 }])),
			]),
			alpha: makeItem("alpha", [makeVariant(null)]),
			zeta: makeItem("zeta", [makeVariant(null)]),
		});

		const result = buildSteps({
			filteredItemIds: ["root"],
			allItems: {
				root: [
					{
						id: "m1",
						itemId: "mid",
						quantity: 1,
						nodeId: "root_mid",
						state: "TODO",
					},
					{
						id: "m2",
						itemId: "alpha",
						quantity: 1,
						nodeId: "root_alpha",
						state: "TODO",
					},
					{
						id: "m3",
						itemId: "zeta",
						quantity: 1,
						nodeId: "root_mid_zeta",
						state: "TODO",
					},
				],
			},
			multipliers: { root: 1 },
			owned: {},
		});

		expect(result.map((r) => r.itemId)).toEqual(["zeta", "mid", "alpha"]);
	});

	it("rounds a fractional deficit up and flags the material whose ingredient step was never marked", () => {
		// rootA only marks "mid" as a step (never expands/marks its own "leaf" need).
		// rootB marks both. mid's deficit ratio is computed across both roots, but
		// leaf's raw total only reflects rootB's contribution — a real coverage gap,
		// not a bug — so the result is fractional and rootA should be flagged.
		registerItems({
			rootA: makeItem("rootA", [
				makeVariant(makeRecipe(1, [{ itemId: "mid", quantity: 13 }])),
			]),
			rootB: makeItem("rootB", [
				makeVariant(makeRecipe(1, [{ itemId: "mid", quantity: 17 }])),
			]),
			mid: makeItem("mid", [
				makeVariant(makeRecipe(1, [{ itemId: "leaf", quantity: 9 }])),
			]),
			leaf: makeItem("leaf", [makeVariant(null)]),
		});

		const result = buildSteps({
			filteredItemIds: ["rootA", "rootB"],
			allItems: {
				rootA: [
					{
						id: "a1",
						itemId: "mid",
						quantity: 13,
						nodeId: "rootA_mid",
						state: "TODO",
					},
				],
				rootB: [
					{
						id: "b1",
						itemId: "mid",
						quantity: 17,
						nodeId: "rootB_mid",
						state: "TODO",
					},
					{
						id: "b2",
						itemId: "leaf",
						quantity: 153,
						nodeId: "rootB_mid_leaf",
						state: "TODO",
					},
				],
			},
			multipliers: { rootA: 1, rootB: 1 },
			owned: { mid: 8 },
		});

		const mid = result.find((r) => r.itemId === "mid")!;
		const leaf = result.find((r) => r.itemId === "leaf")!;
		expect(mid.quantity).toBe(22); // 30 gross - 8 owned
		expect(leaf.quantity).toBe(113); // ceil(153 * 22/30) = ceil(112.2)
		expect(leaf.coverageWarnings).toEqual([
			expect.objectContaining({
				parentItemId: "mid",
				missingRoots: [expect.objectContaining({ itemId: "rootA" })],
			}),
		]);
		expect(mid.coverageWarnings).toEqual([]);
	});

	it("scales a step's recipe contribution by its remaining (post-owned) quantity", () => {
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

		const result = buildSteps({
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

		expect(result[0].quantity).toBe(8);
		expect(result[0].recipeContributions).toEqual([
			{
				skills: [{ name: "Cooking", experience: 5 }],
				recipeQuantity: 4,
				remainingQuantity: 8,
			},
		]);
	});
});

describe("computeCoverageWarnings", () => {
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
			facilities: [],
			...overrides,
		};
	}

	it("returns no warnings when every root using the parent also uses the child", () => {
		const parent = stepEntry({
			itemId: "parent",
			quantity: 10,
			usedFor: [{ itemId: "rootA", name: "rootA", image: null }],
		});
		const child = stepEntry({
			itemId: "child",
			quantity: 5,
			parents: [{ itemId: "parent", name: "parent", image: null, quantity: 5 }],
			usedFor: [{ itemId: "rootA", name: "rootA", image: null }],
		});
		const aggregated = new Map([
			["parent", parent],
			["child", child],
		]);
		expect(computeCoverageWarnings(child, aggregated)).toEqual([]);
	});

	it("flags roots that use the parent but never marked the child", () => {
		const parent = stepEntry({
			itemId: "parent",
			quantity: 30,
			usedFor: [
				{ itemId: "rootA", name: "rootA", image: null },
				{ itemId: "rootB", name: "rootB", image: null },
			],
		});
		const child = stepEntry({
			itemId: "child",
			quantity: 20,
			parents: [
				{ itemId: "parent", name: "parent", image: null, quantity: 20 },
			],
			usedFor: [{ itemId: "rootB", name: "rootB", image: null }],
		});
		const aggregated = new Map([
			["parent", parent],
			["child", child],
		]);
		const warnings = computeCoverageWarnings(child, aggregated);
		expect(warnings).toHaveLength(1);
		expect(warnings[0].parentItemId).toBe("parent");
		expect(warnings[0].missingRoots.map((r) => r.itemId)).toEqual(["rootA"]);
	});

	it("returns no warnings when the parent is a tracked root, not an aggregated material", () => {
		const child = stepEntry({
			itemId: "child",
			quantity: 5,
			parents: [
				{ itemId: "someRoot", name: "someRoot", image: null, quantity: 5 },
			],
			usedFor: [{ itemId: "someRoot", name: "someRoot", image: null }],
		});
		const aggregated = new Map([["child", child]]);
		expect(computeCoverageWarnings(child, aggregated)).toEqual([]);
	});
});

describe("computeRemainingQuantities", () => {
	function entry(
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
			facilities: [],
			...overrides,
		};
	}

	it("returns the gross quantity unchanged when nothing is owned", () => {
		const aggregated = new Map<string, StepEntry>([
			["a", entry({ itemId: "a", quantity: 10 })],
		]);
		expect(computeRemainingQuantities(aggregated, {})).toEqual(
			new Map([["a", 10]]),
		);
	});

	it("excludes an item fully covered by owned stock", () => {
		const aggregated = new Map<string, StepEntry>([
			["a", entry({ itemId: "a", quantity: 10 })],
		]);
		expect(computeRemainingQuantities(aggregated, { a: 10 }).has("a")).toBe(
			false,
		);
	});

	it("cascades a parent's deficit ratio down to a child with a single parent", () => {
		const aggregated = new Map<string, StepEntry>([
			["mid", entry({ itemId: "mid", quantity: 48 })],
			[
				"leaf",
				entry({
					itemId: "leaf",
					quantity: 432,
					parents: [{ itemId: "mid", name: "mid", image: null, quantity: 432 }],
				}),
			],
		]);
		const remaining = computeRemainingQuantities(aggregated, {
			mid: 25,
			leaf: 100,
		});
		expect(remaining.get("mid")).toBe(23);
		expect(remaining.get("leaf")).toBe(107);
	});

	it("weights a child's deficit by each distinct parent proportionally", () => {
		const aggregated = new Map<string, StepEntry>([
			["p1", entry({ itemId: "p1", quantity: 10 })],
			["p2", entry({ itemId: "p2", quantity: 20 })],
			[
				"child",
				entry({
					itemId: "child",
					quantity: 90,
					parents: [
						{ itemId: "p1", name: "p1", image: null, quantity: 30 }, // 3 child per p1 unit
						{ itemId: "p2", name: "p2", image: null, quantity: 60 }, // 3 child per p2 unit
					],
				}),
			],
		]);
		// p1 fully owned (ratio 0), p2 untouched (ratio 1) -> child's adjusted gross = 0*30 + 1*60 = 60
		const remaining = computeRemainingQuantities(aggregated, { p1: 10, p2: 0 });
		expect(remaining.get("p1")).toBeUndefined();
		expect(remaining.get("p2")).toBe(20);
		expect(remaining.get("child")).toBe(60);
	});

	it("treats an item with no recorded parent as needing no ancestor correction", () => {
		const aggregated = new Map<string, StepEntry>([
			["a", entry({ itemId: "a", quantity: 30 })],
		]);
		expect(computeRemainingQuantities(aggregated, { a: 5 }).get("a")).toBe(25);
	});
});
