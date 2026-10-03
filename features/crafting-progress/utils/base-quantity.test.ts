import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>();
	return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock("@/features/material-tree/utils/resolve-material-tree", () => ({
	resolveMaterialTree: vi.fn(),
}));

import type { MaterialTreeItem } from "@/features/material-tree/types/material-tree";
import { resolveMaterialTree } from "@/features/material-tree/utils/resolve-material-tree";
import { makeItem } from "@/test/crafting-helpers";
import { findBaseQuantity } from "./base-quantity";

const mockResolve = vi.mocked(resolveMaterialTree);

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
		...(children.length > 0 ? { children } : {}),
	};
}

beforeEach(() => {
	vi.clearAllMocks();
});

describe("findBaseQuantity", () => {
	it("returns the node's quantity from the unmultiplied tree", () => {
		mockResolve.mockReturnValue([
			makeTreeNode("sword", "sword", 1, [
				makeTreeNode("bar", "sword_bar", 2, [
					makeTreeNode("ore", "sword_bar_ore", 4),
				]),
			]),
		]);

		expect(findBaseQuantity("sword", "sword_bar_ore")).toBe(4);
		// Resolved without a multiplier, so a multiplied tracked item still
		// stores the same base quantity the item-card checkbox does.
		expect(mockResolve).toHaveBeenCalledWith("sword");
	});

	it("finds a node beneath a recipe variant", () => {
		mockResolve.mockReturnValue([
			makeTreeNode("sword", "sword", 1, [
				{
					...makeTreeNode("bar", "sword_bar", 2),
					children: [
						{
							...makeTreeNode("bar", "sword_bar_v1", 2, [
								makeTreeNode("ore", "sword_bar_v1_ore", 6),
							]),
							variantNumber: 2,
						},
					],
				},
			]),
		]);

		expect(findBaseQuantity("sword", "sword_bar_v1_ore")).toBe(6);
	});

	it("returns undefined for a nodeId not in the tree", () => {
		mockResolve.mockReturnValue([makeTreeNode("sword", "sword", 1)]);

		expect(findBaseQuantity("sword", "missing")).toBeUndefined();
	});
});
