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

function registerTrees(trees: Record<string, MaterialTreeItem[]>) {
	mockResolve.mockImplementation((id) => trees[id as string] ?? []);
	registerAllItems();
}

// Multi-variant item: a selector node whose children are one variant node
// per recipe, mirroring resolveMaterialTree's nodeId scheme.
function makeSelectorNode(
	itemId: string,
	nodeId: string,
	quantity: number,
	variants: Array<(variantNodeId: string) => MaterialTreeItem[]>,
): MaterialTreeItem {
	return {
		id: itemId,
		nodeId,
		item: makeItem(itemId),
		quantity,
		facilities: [],
		children: variants.map((buildChildren, vi) => {
			const variantNodeId = `${nodeId}_v${vi}`;
			return {
				id: itemId,
				nodeId: variantNodeId,
				item: makeItem(itemId),
				quantity,
				facilities: [],
				variantNumber: vi + 1,
				children: buildChildren(variantNodeId),
			};
		}),
	};
}

// root (x1) -> bar (x2) -> ore (x4)
function barTree(root: string): MaterialTreeItem[] {
	return [
		makeTreeNode(root, root, 1, [
			makeTreeNode("bar", `${root}_bar`, 2, [
				makeTreeNode("ore", `${root}_bar_ore`, 4),
			]),
		]),
	];
}

function pathOf(...itemIds: string[]) {
	return itemIds.map((itemId) => ({
		itemId,
		name: `${itemId}-name`,
		image: null,
	}));
}

function find(result: ReturnType<typeof buildOwnedMaterials>, id: string) {
	// biome-ignore lint/style/noNonNullAssertion: <test asserts the entry exists>
	return result.find((r) => r.itemId === id)!;
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

	it("only counts the given item ids, ignoring other entries in allItems", () => {
		mockResolve.mockReturnValue([makeTreeNode("iron-ore", "iron-ore", 4)]);
		registerAllItems();

		const result = buildOwnedMaterials({
			trackedItemIds: ["sword", "shield"],
			allItems: {
				sword: [makeEntry("iron-ore", "iron-ore", 4)],
				shield: [makeEntry("iron-ore", "iron-ore", 4)],
				helmet: [makeEntry("iron-ore", "iron-ore", 4)],
			},
			multipliers: {},
			owned: {},
		});

		expect(result).toHaveLength(1);
		expect(result[0].total).toBe(8);
		expect(result[0].adjustedValue).toBe(8);
		expect(result[0].nodeRefs.map((ref) => ref.trackedItemId)).toEqual([
			"sword",
			"shield",
		]);
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

	describe("missingPaths", () => {
		function missing(
			path: string[],
			targets: Array<[nodeId: string, recipeNumber: number | null]>,
			anyRecipe = false,
		) {
			return {
				trackedItemId: path[0],
				path: pathOf(...path),
				anyRecipe,
				targets: targets.map(([nodeId, recipeNumber]) => ({
					nodeId,
					recipeNumber,
				})),
			};
		}

		it("is empty when the material is marked everywhere its parent appears", () => {
			registerTrees({ sword: barTree("sword"), shield: barTree("shield") });

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword", "shield"],
				allItems: {
					sword: [makeEntry("bar", "sword_bar", 2)],
					shield: [makeEntry("bar", "shield_bar", 2)],
				},
				multipliers: {},
				owned: {},
			});

			expect(find(result, "bar").missingPaths).toEqual([]);
		});

		it("flags a top-level material marked on one tracked item but not another", () => {
			registerTrees({ sword: barTree("sword"), shield: barTree("shield") });

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword", "shield"],
				allItems: { sword: [makeEntry("bar", "sword_bar", 2)] },
				multipliers: {},
				owned: {},
			});

			expect(find(result, "bar").missingPaths).toEqual([
				missing(["shield"], [["shield_bar", null]]),
			]);
		});

		it("flags a deeper material missing under another marked occurrence of its parent", () => {
			registerTrees({ sword: barTree("sword"), shield: barTree("shield") });

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword", "shield"],
				allItems: {
					sword: [
						makeEntry("bar", "sword_bar", 2),
						makeEntry("ore", "sword_bar_ore", 4),
					],
					shield: [makeEntry("bar", "shield_bar", 2)],
				},
				multipliers: {},
				owned: {},
			});

			expect(find(result, "ore").missingPaths).toEqual([
				missing(["shield", "bar"], [["shield_bar_ore", null]]),
			]);
			expect(find(result, "bar").missingPaths).toEqual([]);
		});

		it("ignores occurrences of the parent that are not marked", () => {
			registerTrees({ sword: barTree("sword"), shield: barTree("shield") });

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword", "shield"],
				allItems: {
					sword: [
						makeEntry("bar", "sword_bar", 2),
						makeEntry("ore", "sword_bar_ore", 4),
					],
				},
				multipliers: {},
				owned: {},
			});

			// shield's bar isn't marked, so its ore isn't expected to be either —
			// only the bar itself is flagged.
			expect(find(result, "ore").missingPaths).toEqual([]);
			expect(find(result, "bar").missingPaths).toEqual([
				missing(["shield"], [["shield_bar", null]]),
			]);
		});

		it("flags a missing occurrence within the same tracked item", () => {
			// sword -> bar -> ore, and sword -> guard -> bar -> ore
			registerTrees({
				sword: [
					makeTreeNode("sword", "sword", 1, [
						makeTreeNode("bar", "sword_bar", 2, [
							makeTreeNode("ore", "sword_bar_ore", 4),
						]),
						makeTreeNode("guard", "sword_guard", 1, [
							makeTreeNode("bar", "sword_guard_bar", 1, [
								makeTreeNode("ore", "sword_guard_bar_ore", 2),
							]),
						]),
					]),
				],
			});

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: {
					sword: [
						makeEntry("bar", "sword_bar", 2),
						makeEntry("ore", "sword_bar_ore", 4),
						makeEntry("bar", "sword_guard_bar", 1),
					],
				},
				multipliers: {},
				owned: {},
			});

			expect(find(result, "ore").missingPaths).toEqual([
				missing(["sword", "guard", "bar"], [["sword_guard_bar_ore", null]]),
			]);
			expect(find(result, "bar").missingPaths).toEqual([]);
		});

		it("lists a missing occurrence under each different parent", () => {
			// sword -> bar -> ore, shield -> plate -> ore, plus a marked ore under
			// both bar and plate elsewhere
			registerTrees({
				sword: barTree("sword"),
				shield: [
					makeTreeNode("shield", "shield", 1, [
						makeTreeNode("bar", "shield_bar", 2, [
							makeTreeNode("ore", "shield_bar_ore", 4),
						]),
						makeTreeNode("plate", "shield_plate", 1, [
							makeTreeNode("ore", "shield_plate_ore", 3),
						]),
					]),
				],
				helm: [
					makeTreeNode("helm", "helm", 1, [
						makeTreeNode("plate", "helm_plate", 1, [
							makeTreeNode("ore", "helm_plate_ore", 3),
						]),
					]),
				],
			});

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword", "shield", "helm"],
				allItems: {
					sword: [
						makeEntry("bar", "sword_bar", 2),
						makeEntry("ore", "sword_bar_ore", 4),
					],
					shield: [
						makeEntry("bar", "shield_bar", 2),
						makeEntry("plate", "shield_plate", 1),
					],
					helm: [
						makeEntry("plate", "helm_plate", 1),
						makeEntry("ore", "helm_plate_ore", 3),
					],
				},
				multipliers: {},
				owned: {},
			});

			expect(find(result, "ore").missingPaths).toEqual(
				expect.arrayContaining([
					missing(["shield", "bar"], [["shield_bar_ore", null]]),
					missing(["shield", "plate"], [["shield_plate_ore", null]]),
				]),
			);
			expect(find(result, "ore").missingPaths).toHaveLength(2);
		});

		describe("multi-variant parent", () => {
			// shield -> bar with recipe 1 (ore + coal), recipe 2 (scrap) and
			// recipe 3 (ore)
			function variantShieldTree(): MaterialTreeItem[] {
				return [
					makeTreeNode("shield", "shield", 1, [
						makeSelectorNode("bar", "shield_bar", 2, [
							(v) => [
								makeTreeNode("ore", `${v}_ore`, 4),
								makeTreeNode("coal", `${v}_coal`, 2),
							],
							(v) => [makeTreeNode("scrap", `${v}_scrap`, 6)],
							(v) => [makeTreeNode("ore", `${v}_ore`, 5)],
						]),
					]),
				];
			}

			const swordEntries = [
				makeEntry("bar", "sword_bar", 2),
				makeEntry("ore", "sword_bar_ore", 4),
			];

			it("does not flag when the inferred recipe doesn't use the material", () => {
				registerTrees({ sword: barTree("sword"), shield: variantShieldTree() });

				const result = buildOwnedMaterials({
					trackedItemIds: ["sword", "shield"],
					allItems: {
						sword: swordEntries,
						shield: [
							makeEntry("bar", "shield_bar", 2),
							makeEntry("scrap", "shield_bar_v1_scrap", 6),
						],
					},
					multipliers: {},
					owned: {},
				});

				expect(find(result, "ore").missingPaths).toEqual([]);
			});

			it("flags when the inferred recipe uses the material but it isn't marked", () => {
				registerTrees({ sword: barTree("sword"), shield: variantShieldTree() });

				const result = buildOwnedMaterials({
					trackedItemIds: ["sword", "shield"],
					allItems: {
						sword: swordEntries,
						shield: [
							makeEntry("bar", "shield_bar", 2),
							makeEntry("coal", "shield_bar_v0_coal", 2),
						],
					},
					multipliers: {},
					owned: {},
				});

				expect(find(result, "ore").missingPaths).toEqual([
					missing(["shield", "bar"], [["shield_bar_v0_ore", 1]]),
				]);
			});

			it("flags as any recipe when no recipe can be inferred", () => {
				registerTrees({ sword: barTree("sword"), shield: variantShieldTree() });

				const result = buildOwnedMaterials({
					trackedItemIds: ["sword", "shield"],
					allItems: {
						sword: swordEntries,
						shield: [makeEntry("bar", "shield_bar", 2)],
					},
					multipliers: {},
					owned: {},
				});

				expect(find(result, "ore").missingPaths).toEqual([
					missing(
						["shield", "bar"],
						[
							["shield_bar_v0_ore", 1],
							["shield_bar_v2_ore", 3],
						],
						true,
					),
				]);
			});

			it("does not flag when the material is marked under the chosen recipe", () => {
				registerTrees({ sword: barTree("sword"), shield: variantShieldTree() });

				const result = buildOwnedMaterials({
					trackedItemIds: ["sword", "shield"],
					allItems: {
						sword: swordEntries,
						shield: [
							makeEntry("bar", "shield_bar", 2),
							makeEntry("ore", "shield_bar_v0_ore", 4),
						],
					},
					multipliers: {},
					owned: {},
				});

				expect(find(result, "ore").missingPaths).toEqual([]);
			});
		});

		it("ignores tracked items outside the filter", () => {
			registerTrees({ sword: barTree("sword"), shield: barTree("shield") });

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: { sword: [makeEntry("bar", "sword_bar", 2)] },
				multipliers: {},
				owned: {},
			});

			expect(find(result, "bar").missingPaths).toEqual([]);
		});

		it("counts DONE markings as marked", () => {
			registerTrees({ sword: barTree("sword"), shield: barTree("shield") });

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword", "shield"],
				allItems: {
					sword: [makeEntry("bar", "sword_bar", 2, "DONE")],
					shield: [makeEntry("bar", "shield_bar", 2)],
				},
				multipliers: {},
				owned: {},
			});

			expect(find(result, "bar").missingPaths).toEqual([]);
		});
	});

	describe("unmarkedParents", () => {
		function unmarked(path: string[], nodeIds: string[]) {
			return {
				trackedItemId: path[0],
				path: pathOf(...path),
				unmarked: nodeIds.map((nodeId) => {
					const itemId = nodeId.split("_").at(-1) as string;
					return { nodeId, itemId, name: `${itemId}-name` };
				}),
			};
		}

		// root (x1) -> steel (x1) -> bar (x2) -> ore (x4)
		function steelTree(root: string): MaterialTreeItem[] {
			return [
				makeTreeNode(root, root, 1, [
					makeTreeNode("steel", `${root}_steel`, 1, [
						makeTreeNode("bar", `${root}_steel_bar`, 2, [
							makeTreeNode("ore", `${root}_steel_bar_ore`, 4),
						]),
					]),
				]),
			];
		}

		it("flags a marked material whose parent isn't marked", () => {
			registerTrees({ sword: barTree("sword") });

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: { sword: [makeEntry("ore", "sword_bar_ore", 4)] },
				multipliers: {},
				owned: {},
			});

			expect(find(result, "ore").unmarkedParents).toEqual([
				unmarked(["sword", "bar"], ["sword_bar"]),
			]);
		});

		it("lists the whole unmarked chain up to the tracked item, top-down", () => {
			registerTrees({ sword: steelTree("sword") });

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: { sword: [makeEntry("ore", "sword_steel_bar_ore", 4)] },
				multipliers: {},
				owned: {},
			});

			expect(find(result, "ore").unmarkedParents).toEqual([
				unmarked(["sword", "steel", "bar"], ["sword_steel", "sword_steel_bar"]),
			]);
		});

		it("stops at the nearest marked ancestor", () => {
			registerTrees({ sword: steelTree("sword") });

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: {
					sword: [
						makeEntry("steel", "sword_steel", 1),
						makeEntry("ore", "sword_steel_bar_ore", 4),
					],
				},
				multipliers: {},
				owned: {},
			});

			expect(find(result, "ore").unmarkedParents).toEqual([
				unmarked(["sword", "steel", "bar"], ["sword_steel_bar"]),
			]);
			expect(find(result, "steel").unmarkedParents).toEqual([]);
		});

		it("is empty for a material directly under the tracked item", () => {
			registerTrees({ sword: barTree("sword") });

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: { sword: [makeEntry("bar", "sword_bar", 2)] },
				multipliers: {},
				owned: {},
			});

			expect(find(result, "bar").unmarkedParents).toEqual([]);
		});

		it("flags an unmarked multi-variant parent, skipping the recipe node", () => {
			registerTrees({
				shield: [
					makeTreeNode("shield", "shield", 1, [
						makeSelectorNode("bar", "shield_bar", 2, [
							(v) => [makeTreeNode("ore", `${v}_ore`, 4)],
							(v) => [makeTreeNode("scrap", `${v}_scrap`, 6)],
						]),
					]),
				],
			});

			const result = buildOwnedMaterials({
				trackedItemIds: ["shield"],
				allItems: { shield: [makeEntry("ore", "shield_bar_v0_ore", 4)] },
				multipliers: {},
				owned: {},
			});

			expect(find(result, "ore").unmarkedParents).toEqual([
				unmarked(["shield", "bar"], ["shield_bar"]),
			]);
		});

		it("counts a DONE parent as marked", () => {
			registerTrees({ sword: barTree("sword") });

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: {
					sword: [
						makeEntry("bar", "sword_bar", 2, "DONE"),
						makeEntry("ore", "sword_bar_ore", 4),
					],
				},
				multipliers: {},
				owned: {},
			});

			expect(find(result, "ore").unmarkedParents).toEqual([]);
		});

		it("lists one entry per tracked item, merging identical paths", () => {
			// sword -> steel with two recipes, both bar -> ore
			registerTrees({
				sword: [
					makeTreeNode("sword", "sword", 1, [
						makeSelectorNode("steel", "sword_steel", 1, [
							(v) => [
								makeTreeNode("bar", `${v}_bar`, 2, [
									makeTreeNode("ore", `${v}_bar_ore`, 4),
								]),
							],
							(v) => [
								makeTreeNode("bar", `${v}_bar`, 3, [
									makeTreeNode("ore", `${v}_bar_ore`, 6),
								]),
							],
						]),
					]),
				],
				shield: barTree("shield"),
			});

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword", "shield"],
				allItems: {
					sword: [
						makeEntry("ore", "sword_steel_v0_bar_ore", 4),
						makeEntry("ore", "sword_steel_v1_bar_ore", 6),
					],
					shield: [makeEntry("ore", "shield_bar_ore", 4)],
				},
				multipliers: {},
				owned: {},
			});

			expect(find(result, "ore").unmarkedParents).toEqual([
				unmarked(
					["sword", "steel", "bar"],
					["sword_steel", "sword_steel_v0_bar"],
				),
				unmarked(["shield", "bar"], ["shield_bar"]),
			]);
		});

		it("ignores tracked items outside the filter", () => {
			registerTrees({ sword: barTree("sword"), shield: barTree("shield") });

			const result = buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: {
					sword: [
						makeEntry("bar", "sword_bar", 2),
						makeEntry("ore", "sword_bar_ore", 4),
					],
					shield: [makeEntry("ore", "shield_bar_ore", 4)],
				},
				multipliers: {},
				owned: {},
			});

			expect(find(result, "ore").unmarkedParents).toEqual([]);
		});
	});
});
