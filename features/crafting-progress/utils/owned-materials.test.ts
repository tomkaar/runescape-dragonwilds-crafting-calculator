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
import { sourceItemById } from "@/utils/source-item-by-id";
import { buildOwnedMaterials } from "./owned-materials";

const mockResolve = vi.mocked(resolveMaterialTree);
const mockSource = vi.mocked(sourceItemById);

function makeTreeLeaf(nodeId: string, quantity: number): MaterialTreeItem {
	return {
		id: nodeId,
		nodeId,
		quantity,
		facilities: [],
		isEnd: true,
	} as unknown as MaterialTreeItem;
}

function makeEntry(
	itemId: string,
	nodeId: string,
	quantity: number,
	state: "TODO" | "DONE" = "TODO",
): SelectedMaterial {
	return { id: `${itemId}-${nodeId}`, itemId, nodeId, quantity, state };
}

function makeSourceItem(itemId: string) {
	return {
		id: itemId,
		name: `${itemId}-name`,
		image: null,
		variants: [],
		facilities: [],
	};
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
			}),
		).toEqual([]);
	});

	it("returns empty array when a tracked item has no marked materials", () => {
		mockResolve.mockReturnValue([makeTreeLeaf("iron-ore", 2)]);
		expect(
			buildOwnedMaterials({
				trackedItemIds: ["sword"],
				allItems: {},
				multipliers: {},
			}),
		).toEqual([]);
	});

	it("skips entries that have no nodeId", () => {
		mockResolve.mockReturnValue([]);
		mockSource.mockReturnValue(
			makeSourceItem("iron-ore") as ReturnType<typeof sourceItemById>,
		);
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
		});
		expect(result).toEqual([]);
	});

	it("skips entries whose item cannot be found in the source data", () => {
		mockResolve.mockReturnValue([makeTreeLeaf("iron-ore", 2)]);
		mockSource.mockReturnValue(undefined);
		const result = buildOwnedMaterials({
			trackedItemIds: ["sword"],
			allItems: { sword: [makeEntry("iron-ore", "iron-ore", 2)] },
			multipliers: {},
		});
		expect(result).toEqual([]);
	});

	it("returns one entry for a single marked material", () => {
		mockResolve.mockReturnValue([makeTreeLeaf("iron-ore", 3)]);
		mockSource.mockReturnValue(
			makeSourceItem("iron-ore") as ReturnType<typeof sourceItemById>,
		);

		const result = buildOwnedMaterials({
			trackedItemIds: ["sword"],
			allItems: { sword: [makeEntry("iron-ore", "iron-ore", 3)] },
			multipliers: {},
		});

		expect(result).toHaveLength(1);
		expect(result[0].itemId).toBe("iron-ore");
		expect(result[0].needed).toBe(3);
		expect(result[0].nodeRefs).toEqual([
			{ trackedItemId: "sword", nodeId: "iron-ore" },
		]);
	});

	it("uses the resolved tree quantity, not the entry's stored quantity", () => {
		// Tree says 10 (multiplied), entry still has 2 (stale or pre-multiplier)
		mockResolve.mockReturnValue([makeTreeLeaf("iron-ore", 10)]);
		mockSource.mockReturnValue(
			makeSourceItem("iron-ore") as ReturnType<typeof sourceItemById>,
		);

		const result = buildOwnedMaterials({
			trackedItemIds: ["sword"],
			allItems: { sword: [makeEntry("iron-ore", "iron-ore", 2)] },
			multipliers: { sword: 5 },
		});

		expect(result[0].needed).toBe(10);
	});

	it("falls back to entry.quantity when nodeId is not in the resolved tree", () => {
		mockResolve.mockReturnValue([]); // tree is empty / nodeId won't be found
		mockSource.mockReturnValue(
			makeSourceItem("wood") as ReturnType<typeof sourceItemById>,
		);

		const result = buildOwnedMaterials({
			trackedItemIds: ["bow"],
			allItems: { bow: [makeEntry("wood", "bow_wood", 7)] },
			multipliers: {},
		});

		expect(result[0].needed).toBe(7);
	});

	it("merges the same material across multiple tracked items", () => {
		mockResolve.mockReturnValue([makeTreeLeaf("iron-ore", 4)]);
		mockSource.mockReturnValue(
			makeSourceItem("iron-ore") as ReturnType<typeof sourceItemById>,
		);

		const result = buildOwnedMaterials({
			trackedItemIds: ["sword", "shield"],
			allItems: {
				sword: [makeEntry("iron-ore", "iron-ore", 4)],
				shield: [makeEntry("iron-ore", "iron-ore", 4)],
			},
			multipliers: {},
		});

		expect(result).toHaveLength(1);
		expect(result[0].needed).toBe(8);
		expect(result[0].nodeRefs).toHaveLength(2);
	});

	it("keeps distinct materials as separate entries", () => {
		mockResolve.mockImplementation((id) => {
			if (id === "sword") return [makeTreeLeaf("iron-ore", 3)];
			if (id === "bow") return [makeTreeLeaf("wood", 5)];
			return [];
		});
		mockSource.mockImplementation(
			(id) => makeSourceItem(id as string) as ReturnType<typeof sourceItemById>,
		);

		const result = buildOwnedMaterials({
			trackedItemIds: ["sword", "bow"],
			allItems: {
				sword: [makeEntry("iron-ore", "iron-ore", 3)],
				bow: [makeEntry("wood", "wood", 5)],
			},
			multipliers: {},
		});

		expect(result).toHaveLength(2);
		expect(result.find((r) => r.itemId === "iron-ore")?.needed).toBe(3);
		expect(result.find((r) => r.itemId === "wood")?.needed).toBe(5);
	});

	it("passes the multiplier to resolveMaterialTree", () => {
		mockResolve.mockReturnValue([]);
		buildOwnedMaterials({
			trackedItemIds: ["sword"],
			allItems: {},
			multipliers: { sword: 3 },
		});
		expect(mockResolve).toHaveBeenCalledWith("sword", 3);
	});

	it("defaults multiplier to 1 when not provided", () => {
		mockResolve.mockReturnValue([]);
		buildOwnedMaterials({
			trackedItemIds: ["sword"],
			allItems: {},
			multipliers: {},
		});
		expect(mockResolve).toHaveBeenCalledWith("sword", 1);
	});

	it("includes DONE entries in the needed total", () => {
		mockResolve.mockReturnValue([makeTreeLeaf("iron-ore", 2)]);
		mockSource.mockReturnValue(
			makeSourceItem("iron-ore") as ReturnType<typeof sourceItemById>,
		);

		const result = buildOwnedMaterials({
			trackedItemIds: ["sword"],
			allItems: { sword: [makeEntry("iron-ore", "iron-ore", 2, "DONE")] },
			multipliers: {},
		});

		expect(result[0].needed).toBe(2);
	});
});
