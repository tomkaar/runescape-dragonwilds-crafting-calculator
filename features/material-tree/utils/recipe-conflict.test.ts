import { describe, expect, it } from "vitest";
import { makeItem } from "@/test/crafting-helpers";
import type { MaterialTreeItem } from "../types/material-tree";
import { getActiveRecipeNumbers } from "./recipe-conflict";

function makeTreeNode(
	itemId: string,
	nodeId: string,
	children: MaterialTreeItem[] = [],
	variantNumber?: number,
): MaterialTreeItem {
	return {
		id: itemId,
		nodeId,
		item: makeItem(itemId),
		quantity: 1,
		facilities: [],
		...(variantNumber !== undefined ? { variantNumber } : {}),
		...(children.length > 0 ? { children } : {}),
	};
}

// bar with recipe 1 (ore -> rock), recipe 2 (scrap) and recipe 3 (coal)
const bar = makeTreeNode("bar", "bar", [
	makeTreeNode(
		"bar",
		"bar_v0",
		[
			makeTreeNode("ore", "bar_v0_ore", [
				makeTreeNode("rock", "bar_v0_ore_rock"),
			]),
		],
		1,
	),
	makeTreeNode("bar", "bar_v1", [makeTreeNode("scrap", "bar_v1_scrap")], 2),
	makeTreeNode("bar", "bar_v2", [makeTreeNode("coal", "bar_v2_coal")], 3),
]);

describe("getActiveRecipeNumbers", () => {
	it("returns nothing for an item with a single recipe", () => {
		const plain = makeTreeNode("bar", "bar", [makeTreeNode("ore", "bar_ore")]);
		expect(getActiveRecipeNumbers(plain, new Set(["bar_ore"]))).toEqual([]);
	});

	it("returns nothing when no recipe has anything marked", () => {
		expect(getActiveRecipeNumbers(bar, new Set())).toEqual([]);
	});

	it("returns the single recipe with something marked beneath it", () => {
		expect(getActiveRecipeNumbers(bar, new Set(["bar_v1_scrap"]))).toEqual([2]);
	});

	it("returns every recipe with something marked beneath it, in order", () => {
		expect(
			getActiveRecipeNumbers(
				bar,
				new Set(["bar_v2_coal", "bar_v0_ore", "bar_v1_scrap"]),
			),
		).toEqual([1, 2, 3]);
	});

	it("counts a marking deep beneath a recipe", () => {
		expect(
			getActiveRecipeNumbers(bar, new Set(["bar_v0_ore_rock", "bar_v1_scrap"])),
		).toEqual([1, 2]);
	});

	it("ignores a marking on the item itself", () => {
		expect(
			getActiveRecipeNumbers(bar, new Set(["bar", "bar_v1_scrap"])),
		).toEqual([2]);
	});
});
