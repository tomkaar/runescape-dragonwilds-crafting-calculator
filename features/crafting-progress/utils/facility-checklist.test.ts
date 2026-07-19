/** biome-ignore-all lint/style/noNonNullAssertion: <ok for tests> */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeItem, makeRecipe, makeVariant } from "@/test/crafting-helpers";

vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>();
	return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock("@/utils/source-item-by-id", () => ({
	sourceItemById: vi.fn(),
}));

import { sourceItemById } from "@/utils/source-item-by-id";
import { buildFacilityChecklist } from "./facility-checklist";

const mockSourceItemById = vi.mocked(sourceItemById);

function registerItems(items: Record<string, ReturnType<typeof makeItem>>) {
	mockSourceItemById.mockImplementation((id: string) => items[id]);
}

beforeEach(() => {
	mockSourceItemById.mockReset();
});

describe("buildFacilityChecklist", () => {
	it("returns nothing when the tracked item has no marked materials", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(
					makeRecipe(1, [{ itemId: "leaf", quantity: 5 }], ["Furnace"]),
				),
			]),
			leaf: makeItem("leaf", [makeVariant(null)]),
		});

		const result = buildFacilityChecklist({
			filteredItemIds: ["root"],
			allItems: {},
			multipliers: { root: 1 },
			owned: {},
		});

		expect(result).toEqual({ facilities: [], ambiguousItemNames: [] });
	});

	it("includes an ingredient's facility from a remaining marked step", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(makeRecipe(1, [{ itemId: "leaf", quantity: 5 }])),
			]),
			leaf: makeItem("leaf", [
				makeVariant(makeRecipe(1, [], ["Spinning Wheel"])),
			]),
		});

		const result = buildFacilityChecklist({
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

		expect(result.facilities).toEqual(["Spinning Wheel"]);
	});

	it("excludes a facility whose only material is fully covered by owned stock", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(makeRecipe(1, [{ itemId: "leaf", quantity: 5 }])),
			]),
			leaf: makeItem("leaf", [
				makeVariant(makeRecipe(1, [], ["Spinning Wheel"])),
			]),
		});

		const result = buildFacilityChecklist({
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
			owned: { leaf: 5 },
		});

		expect(result.facilities).toEqual([]);
	});

	it("includes the tracked item's own facility even though it's never a step", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(
					makeRecipe(1, [{ itemId: "leaf", quantity: 5 }], ["Crafting Table"]),
				),
			]),
			leaf: makeItem("leaf", [makeVariant(makeRecipe(1, [], ["Loom"]))]),
		});

		const result = buildFacilityChecklist({
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

		expect(result.facilities).toEqual(["Crafting Table", "Loom"]);
	});

	it("dedupes a facility shared by the root item and an ingredient", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(
					makeRecipe(1, [{ itemId: "leaf", quantity: 5 }], ["Crafting Table"]),
				),
			]),
			leaf: makeItem("leaf", [
				makeVariant(makeRecipe(1, [], ["Crafting Table"])),
			]),
		});

		const result = buildFacilityChecklist({
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

		expect(result.facilities).toEqual(["Crafting Table"]);
	});

	it("flags the tracked item as ambiguous when materials are marked under two variants", () => {
		registerItems({
			"30-hip-roof": makeItem(
				"30-hip-roof",
				[
					makeVariant(
						makeRecipe(
							1,
							[{ itemId: "ash-logs", quantity: 6 }],
							["Crafting Table"],
							[],
							"cabin",
						),
					),
					makeVariant(
						makeRecipe(
							1,
							[{ itemId: "oak-logs", quantity: 6 }],
							["Sawmill"],
							[],
							"cottage",
						),
					),
				],
				"30° Hip Roof",
			),
			"ash-logs": makeItem("ash-logs", [makeVariant(null)]),
			"oak-logs": makeItem("oak-logs", [makeVariant(null)]),
		});

		const result = buildFacilityChecklist({
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
			owned: {},
		});

		expect(result.ambiguousItemNames).toEqual(["30° Hip Roof"]);
	});

	it("returns facilities sorted alphabetically", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(
					makeRecipe(
						1,
						[
							{ itemId: "a", quantity: 1 },
							{ itemId: "b", quantity: 1 },
						],
						["Tannery"],
					),
				),
			]),
			a: makeItem("a", [makeVariant(makeRecipe(1, [], ["Grindstone"]))]),
			b: makeItem("b", [makeVariant(makeRecipe(1, [], ["Furnace"]))]),
		});

		const result = buildFacilityChecklist({
			filteredItemIds: ["root"],
			allItems: {
				root: [
					{
						id: "m1",
						itemId: "a",
						quantity: 1,
						nodeId: "root_a",
						state: "TODO",
					},
					{
						id: "m2",
						itemId: "b",
						quantity: 1,
						nodeId: "root_b",
						state: "TODO",
					},
				],
			},
			multipliers: { root: 1 },
			owned: {},
		});

		expect(result.facilities).toEqual(["Furnace", "Grindstone", "Tannery"]);
	});

	it("excludes always-available facilities like the Build Menu", () => {
		registerItems({
			root: makeItem("root", [
				makeVariant(
					makeRecipe(1, [{ itemId: "leaf", quantity: 1 }], ["Build Menu"]),
				),
			]),
			leaf: makeItem("leaf", [makeVariant(makeRecipe(1, [], ["Furnace"]))]),
		});

		const result = buildFacilityChecklist({
			filteredItemIds: ["root"],
			allItems: {
				root: [
					{
						id: "m1",
						itemId: "leaf",
						quantity: 1,
						nodeId: "root_leaf",
						state: "TODO",
					},
				],
			},
			multipliers: { root: 1 },
			owned: {},
		});

		expect(result.facilities).toEqual(["Furnace"]);
	});
});
