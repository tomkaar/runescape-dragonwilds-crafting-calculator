import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SelectedMaterial } from "@/store/selected-material";

vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>();
	return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock("@/features/material-tree/utils/resolve-material-tree", () => ({
	resolveMaterialTree: vi.fn(),
}));

vi.mock("@/utils/source-item-by-id", () => ({
	sourceItemById: vi.fn(),
}));

import type { MaterialTreeItem } from "@/features/material-tree/types/material-tree";
import { resolveMaterialTree } from "@/features/material-tree/utils/resolve-material-tree";
import { makeItem } from "@/test/crafting-helpers";
import { sourceItemById } from "@/utils/source-item-by-id";
import { buildOwnedMaterials } from "./owned-materials";

const mockResolve = vi.mocked(resolveMaterialTree);
const mockSource = vi.mocked(sourceItemById);

function makeTreeNode(
	itemId: string,
	nodeId: string,
	quantity: number,
	children: MaterialTreeItem[] = [],
): MaterialTreeItem {
	return {
		id: itemId,
		nodeId,
		item: makeItem(itemId),
		quantity,
		facilities: [],
		isEnd: children.length === 0,
		...(children.length > 0 ? { children } : {}),
	};
}

function makeEntry(
	itemId: string,
	nodeId: string,
	quantity: number,
	state: "TODO" | "DONE" = "TODO",
): SelectedMaterial {
	return { id: `${itemId}-${nodeId}`, itemId, nodeId, quantity, state };
}

function registerAllItems() {
	mockSource.mockImplementation((id) => makeItem(id as string));
}

// sword (x1) -> bar (x4) -> ore (x8)
function swordTree(): MaterialTreeItem[] {
	return [
		makeTreeNode("sword", "sword", 1, [
			makeTreeNode("bar", "sword_bar", 4, [
				makeTreeNode("ore", "sword_bar_ore", 8),
			]),
		]),
	];
}

beforeEach(() => {
	vi.clearAllMocks();
	mockResolve.mockReturnValue([]);
	mockSource.mockReturnValue(undefined);
});

describe("buildOwnedMaterials", () => {
	it("returns empty array when there are no tracked items", () => {
		expect(
			buildOwnedMaterials({
				trackedItemIds: [],
				allItems: {},
				multipliers: {},
				owned: {},
			}),
		).toEqual([]);
	});

	it("returns empty array when a tracked item has no marked materials", () => {
		mockResolve.mockReturnValue([makeTreeNode("iron-ore", "iron-ore", 2)]);
		expect(
			buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: {},
				multipliers: {},
				owned: {},
			}),
		).toEqual([]);
	});

	it("skips entries that have no nodeId", () => {
		mockResolve.mockReturnValue([]);
		registerAllItems();
		const entry: SelectedMaterial = {
			id: "e1",
			itemId: "iron-ore",
			quantity: 2,
			state: "TODO",
		};
		const result = buildOwnedMaterials({
			trackedItemIds: ["sword"],
			allItems: { sword: [entry] },
			multipliers: {},
			owned: {},
		});
		expect(result).toEqual([]);
	});

	it("skips entries whose item cannot be found in the source data", () => {
		mockResolve.mockReturnValue([makeTreeNode("iron-ore", "iron-ore", 2)]);
		mockSource.mockReturnValue(undefined);
		const result = buildOwnedMaterials({
			trackedItemIds: ["sword"],
			allItems: { sword: [makeEntry("iron-ore", "iron-ore", 2)] },
			multipliers: {},
			owned: {},
		});
		expect(result).toEqual([]);
	});

	it("returns one entry for a single marked material", () => {
		mockResolve.mockReturnValue([makeTreeNode("iron-ore", "iron-ore", 3)]);
		registerAllItems();

		const result = buildOwnedMaterials({
			trackedItemIds: ["sword"],
			allItems: { sword: [makeEntry("iron-ore", "iron-ore", 3)] },
			multipliers: {},
			owned: {},
		});

		expect(result).toHaveLength(1);
		expect(result[0].itemId).toBe("iron-ore");
		expect(result[0].total).toBe(3);
		expect(result[0].nodeRefs).toEqual([
			{ trackedItemId: "sword", nodeId: "iron-ore" },
		]);
	});

	it("uses the resolved tree quantity, not the entry's stored quantity", () => {
		// Tree says 10 (multiplied), entry still has 2 (stale or pre-multiplier)
		mockResolve.mockReturnValue([makeTreeNode("iron-ore", "iron-ore", 10)]);
		registerAllItems();

		const result = buildOwnedMaterials({
			trackedItemIds: ["sword"],
			allItems: { sword: [makeEntry("iron-ore", "iron-ore", 2)] },
			multipliers: { sword: 5 },
			owned: {},
		});

		expect(result[0].total).toBe(10);
		expect(result[0].adjustedValue).toBe(10);
	});

	it("falls back to entry.quantity when nodeId is not in the resolved tree", () => {
		mockResolve.mockReturnValue([]); // tree is empty / nodeId won't be found
		registerAllItems();

		const result = buildOwnedMaterials({
			trackedItemIds: ["bow"],
			allItems: { bow: [makeEntry("wood", "bow_wood", 7)] },
			multipliers: {},
			owned: {},
		});

		expect(result[0].total).toBe(7);
		expect(result[0].adjustedValue).toBe(7);
	});

	it("merges the same material across multiple tracked items", () => {
		mockResolve.mockReturnValue([makeTreeNode("iron-ore", "iron-ore", 4)]);
		registerAllItems();

		const result = buildOwnedMaterials({
			trackedItemIds: ["sword", "shield"],
			allItems: {
				sword: [makeEntry("iron-ore", "iron-ore", 4)],
				shield: [makeEntry("iron-ore", "iron-ore", 4)],
			},
			multipliers: {},
			owned: {},
		});

		expect(result).toHaveLength(1);
		expect(result[0].total).toBe(8);
		expect(result[0].adjustedValue).toBe(8);
		expect(result[0].nodeRefs).toHaveLength(2);
	});

	it("keeps distinct materials as separate entries", () => {
		mockResolve.mockImplementation((id) => {
			if (id === "sword") return [makeTreeNode("iron-ore", "iron-ore", 3)];
			if (id === "bow") return [makeTreeNode("wood", "wood", 5)];
			return [];
		});
		registerAllItems();

		const result = buildOwnedMaterials({
			trackedItemIds: ["sword", "bow"],
			allItems: {
				sword: [makeEntry("iron-ore", "iron-ore", 3)],
				bow: [makeEntry("wood", "wood", 5)],
			},
			multipliers: {},
			owned: {},
		});

		expect(result).toHaveLength(2);
		expect(result.find((r) => r.itemId === "iron-ore")?.total).toBe(3);
		expect(result.find((r) => r.itemId === "wood")?.total).toBe(5);
	});

	it("passes the multiplier to resolveMaterialTree", () => {
		mockResolve.mockReturnValue([]);
		buildOwnedMaterials({
			trackedItemIds: ["sword"],
			allItems: {},
			multipliers: { sword: 3 },
			owned: {},
		});
		expect(mockResolve).toHaveBeenCalledWith("sword", 3);
	});

	it("defaults multiplier to 1 when not provided", () => {
		mockResolve.mockReturnValue([]);
		buildOwnedMaterials({
			trackedItemIds: ["sword"],
			allItems: {},
			multipliers: {},
			owned: {},
		});
		expect(mockResolve).toHaveBeenCalledWith("sword", 1);
	});

	it("includes DONE entries in the total", () => {
		mockResolve.mockReturnValue([makeTreeNode("iron-ore", "iron-ore", 2)]);
		registerAllItems();

		const result = buildOwnedMaterials({
			trackedItemIds: ["sword"],
			allItems: { sword: [makeEntry("iron-ore", "iron-ore", 2, "DONE")] },
			multipliers: {},
			owned: {},
		});

		expect(result[0].total).toBe(2);
	});

	describe("adjustedValue", () => {
		it("equals the total when nothing is owned", () => {
			mockResolve.mockReturnValue(swordTree());
			registerAllItems();

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: {
					sword: [
						makeEntry("bar", "sword_bar", 4),
						makeEntry("ore", "sword_bar_ore", 8),
					],
				},
				multipliers: {},
				owned: {},
			});

			const ore = result.find((r) => r.itemId === "ore");
			const bar = result.find((r) => r.itemId === "bar");
			expect(bar).toMatchObject({ total: 4, adjustedValue: 4 });
			expect(ore).toMatchObject({ total: 8, adjustedValue: 8 });
		});

		it("does not subtract the material's own owned count", () => {
			mockResolve.mockReturnValue(swordTree());
			registerAllItems();

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: {
					sword: [
						makeEntry("bar", "sword_bar", 4),
						makeEntry("ore", "sword_bar_ore", 8),
					],
				},
				multipliers: {},
				owned: { ore: 3, bar: 1 },
			});

			const ore = result.find((r) => r.itemId === "ore");
			const bar = result.find((r) => r.itemId === "bar");
			expect(bar).toMatchObject({ total: 4, adjustedValue: 4 });
			// 1 of 4 bars owned -> only 3 bars left to craft -> 6 ore
			expect(ore).toMatchObject({ total: 8, adjustedValue: 6 });
		});

		it("scales a child down when its parent is partly owned", () => {
			mockResolve.mockReturnValue(swordTree());
			registerAllItems();

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: {
					sword: [
						makeEntry("bar", "sword_bar", 4),
						makeEntry("ore", "sword_bar_ore", 8),
					],
				},
				multipliers: {},
				owned: { bar: 2 },
			});

			expect(result.find((r) => r.itemId === "ore")).toMatchObject({
				total: 8,
				adjustedValue: 4,
			});
		});

		it("drops a child to 0 when its parent is fully owned", () => {
			mockResolve.mockReturnValue(swordTree());
			registerAllItems();

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: {
					sword: [
						makeEntry("bar", "sword_bar", 4),
						makeEntry("ore", "sword_bar_ore", 8),
					],
				},
				multipliers: {},
				owned: { bar: 4 },
			});

			expect(result.find((r) => r.itemId === "ore")).toMatchObject({
				total: 8,
				adjustedValue: 0,
			});
		});

		it("cascades the discount through multiple levels", () => {
			// sword -> ingot (x2) -> bar (x4) -> ore (x8)
			mockResolve.mockReturnValue([
				makeTreeNode("sword", "sword", 1, [
					makeTreeNode("ingot", "sword_ingot", 2, [
						makeTreeNode("bar", "sword_ingot_bar", 4, [
							makeTreeNode("ore", "sword_ingot_bar_ore", 8),
						]),
					]),
				]),
			]);
			registerAllItems();

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: {
					sword: [
						makeEntry("ingot", "sword_ingot", 2),
						makeEntry("bar", "sword_ingot_bar", 4),
						makeEntry("ore", "sword_ingot_bar_ore", 8),
					],
				},
				multipliers: {},
				owned: { ingot: 1, bar: 1 },
			});

			// 1 of 2 ingots owned -> 2 bars needed; 1 bar owned -> 1 of 2 left -> ore halved again
			expect(result.find((r) => r.itemId === "bar")).toMatchObject({
				total: 4,
				adjustedValue: 2,
			});
			expect(result.find((r) => r.itemId === "ore")).toMatchObject({
				total: 8,
				adjustedValue: 4,
			});
		});

		it("still discounts a child when its parent is marked DONE", () => {
			mockResolve.mockReturnValue(swordTree());
			registerAllItems();

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: {
					sword: [
						makeEntry("bar", "sword_bar", 4, "DONE"),
						makeEntry("ore", "sword_bar_ore", 8),
					],
				},
				multipliers: {},
				owned: { bar: 4 },
			});

			expect(result.find((r) => r.itemId === "ore")).toMatchObject({
				total: 8,
				adjustedValue: 0,
			});
		});

		it("does not discount a child whose owned parent is not marked", () => {
			mockResolve.mockReturnValue(swordTree());
			registerAllItems();

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: { sword: [makeEntry("ore", "sword_bar_ore", 8)] },
				multipliers: {},
				owned: { bar: 4 },
			});

			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({ total: 8, adjustedValue: 8 });
		});

		it("rounds a fractional adjusted value up", () => {
			// sword -> bar (x3) -> ore (x7); owning 1 bar leaves 2/3 * 7 = 4.67 ore
			mockResolve.mockReturnValue([
				makeTreeNode("sword", "sword", 1, [
					makeTreeNode("bar", "sword_bar", 3, [
						makeTreeNode("ore", "sword_bar_ore", 7),
					]),
				]),
			]);
			registerAllItems();

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: {
					sword: [
						makeEntry("bar", "sword_bar", 3),
						makeEntry("ore", "sword_bar_ore", 7),
					],
				},
				multipliers: {},
				owned: { bar: 1 },
			});

			expect(result.find((r) => r.itemId === "ore")).toMatchObject({
				total: 7,
				adjustedValue: 5,
			});
		});

		it("pools a shared parent across tracked items before discounting", () => {
			// sword and shield each need 2 bars (4 ore); owning 2 of the 4 pooled bars halves the ore
			mockResolve.mockImplementation((id) => [
				makeTreeNode(id as string, id as string, 1, [
					makeTreeNode("bar", `${id}_bar`, 2, [
						makeTreeNode("ore", `${id}_bar_ore`, 4),
					]),
				]),
			]);
			registerAllItems();

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword", "shield"],
				allItems: {
					sword: [
						makeEntry("bar", "sword_bar", 2),
						makeEntry("ore", "sword_bar_ore", 4),
					],
					shield: [
						makeEntry("bar", "shield_bar", 2),
						makeEntry("ore", "shield_bar_ore", 4),
					],
				},
				multipliers: {},
				owned: { bar: 2 },
			});

			expect(result.find((r) => r.itemId === "bar")).toMatchObject({
				total: 4,
				adjustedValue: 4,
			});
			expect(result.find((r) => r.itemId === "ore")).toMatchObject({
				total: 8,
				adjustedValue: 4,
			});
		});
	});
});
