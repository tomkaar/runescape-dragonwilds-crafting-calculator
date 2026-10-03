import { describe, expect, it } from "vitest";
import { makeItem } from "@/test/crafting-helpers";
import type { MaterialTreeItem } from "../types/material-tree";
import { getMarkedBeneathNames } from "./unmarked-parent";

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

// sword -> steel -> bar -> ore
const ore = makeTreeNode("ore", "sword_steel_bar_ore");
const bar = makeTreeNode("bar", "sword_steel_bar", [ore]);
const steel = makeTreeNode("steel", "sword_steel", [bar]);
const sword = makeTreeNode("sword", "sword", [steel]);

describe("getMarkedBeneathNames", () => {
	it("returns nothing when no descendant is marked", () => {
		expect(getMarkedBeneathNames(steel, "sword", new Set())).toEqual([]);
	});

	it("names the nearest marked descendants of an unmarked node", () => {
		expect(
			getMarkedBeneathNames(steel, "sword", new Set(["sword_steel_bar_ore"])),
		).toEqual(["ore-name"]);
	});

	it("stops at the first marked descendant on each branch", () => {
		expect(
			getMarkedBeneathNames(
				steel,
				"sword",
				new Set(["sword_steel_bar", "sword_steel_bar_ore"]),
			),
		).toEqual(["bar-name"]);
	});

	it("returns nothing for a node that is marked itself", () => {
		expect(
			getMarkedBeneathNames(
				steel,
				"sword",
				new Set(["sword_steel", "sword_steel_bar_ore"]),
			),
		).toEqual([]);
	});

	it("returns nothing for the tracked item's own node", () => {
		expect(
			getMarkedBeneathNames(sword, "sword", new Set(["sword_steel_bar_ore"])),
		).toEqual([]);
	});

	it("returns nothing for a recipe variant node", () => {
		const variant = makeTreeNode("bar", "sword_bar_v0", [ore], 1);
		expect(
			getMarkedBeneathNames(variant, "sword", new Set([ore.nodeId])),
		).toEqual([]);
	});

	it("looks through recipe variants and lists each name once", () => {
		const selector = makeTreeNode("bar", "sword_bar", [
			makeTreeNode(
				"bar",
				"sword_bar_v0",
				[makeTreeNode("ore", "sword_bar_v0_ore")],
				1,
			),
			makeTreeNode(
				"bar",
				"sword_bar_v1",
				[
					makeTreeNode("ore", "sword_bar_v1_ore"),
					makeTreeNode("coal", "sword_bar_v1_coal"),
				],
				2,
			),
		]);

		expect(
			getMarkedBeneathNames(
				selector,
				"sword",
				new Set(["sword_bar_v0_ore", "sword_bar_v1_ore", "sword_bar_v1_coal"]),
			),
		).toEqual(["ore-name", "coal-name"]);
	});
});
