import { describe, expect, it } from "vitest";
import { makeItem, makeVariant } from "@/test/crafting-helpers";
import type { ResolvedItem } from "../types/resolved-item";
import { resolveUniqueFacilitiesFromItemTree } from "./resolve-unique-facilities-from-item-tree";

/** Minimal ResolvedItem fixture. Only facilities and children matter to this resolver; the rest are filled with neutral defaults. */
function makeResolvedItem(overrides: Partial<ResolvedItem> = {}): ResolvedItem {
	return {
		item: makeItem("item"),
		variant: makeVariant(),
		variantIndex: null,
		quantityNeeded: 1,
		quantityRecieved: 1,
		hasExcessItems: false,
		facilities: [],
		isLeaf: true,
		children: [],
		...overrides,
	};
}

describe("resolveUniqueFacilitiesFromItemTree", () => {
	it("returns an empty array for an empty tree", () => {
		expect(resolveUniqueFacilitiesFromItemTree([])).toEqual([]);
	});

	it("returns an empty array when no items have facilities", () => {
		const tree = [
			makeResolvedItem({ facilities: [] }),
			makeResolvedItem({ facilities: [] }),
		];
		expect(resolveUniqueFacilitiesFromItemTree(tree)).toEqual([]);
	});

	it("collects facilities from a single root item", () => {
		const tree = [makeResolvedItem({ facilities: ["Workbench"] })];
		expect(resolveUniqueFacilitiesFromItemTree(tree)).toEqual(["Workbench"]);
	});

	it("collects facilities from multiple root items", () => {
		const tree = [
			makeResolvedItem({ facilities: ["Workbench"] }),
			makeResolvedItem({ facilities: ["Forge"] }),
		];
		expect(resolveUniqueFacilitiesFromItemTree(tree)).toEqual([
			"Workbench",
			"Forge",
		]);
	});

	it("deduplicates facilities shared across items", () => {
		const tree = [
			makeResolvedItem({ facilities: ["Workbench"] }),
			makeResolvedItem({ facilities: ["Workbench"] }),
		];
		expect(resolveUniqueFacilitiesFromItemTree(tree)).toEqual(["Workbench"]);
	});

	it("collects facilities from nested children", () => {
		const child = makeResolvedItem({ facilities: ["Forge"] });
		const root = makeResolvedItem({
			facilities: ["Workbench"],
			children: [child],
		});
		expect(resolveUniqueFacilitiesFromItemTree([root])).toEqual([
			"Workbench",
			"Forge",
		]);
	});

	it("collects facilities from deeply nested grandchildren", () => {
		const grandchild = makeResolvedItem({ facilities: ["Anvil"] });
		const child = makeResolvedItem({
			facilities: ["Forge"],
			children: [grandchild],
		});
		const root = makeResolvedItem({
			facilities: ["Workbench"],
			children: [child],
		});
		expect(resolveUniqueFacilitiesFromItemTree([root])).toEqual([
			"Workbench",
			"Forge",
			"Anvil",
		]);
	});

	it("deduplicates facilities shared between a parent and its child", () => {
		const child = makeResolvedItem({ facilities: ["Workbench"] });
		const root = makeResolvedItem({
			facilities: ["Workbench"],
			children: [child],
		});
		expect(resolveUniqueFacilitiesFromItemTree([root])).toEqual(["Workbench"]);
	});

	it("ignores items with no facilities while still traversing their children", () => {
		const child = makeResolvedItem({ facilities: ["Forge"] });
		const root = makeResolvedItem({ facilities: [], children: [child] });
		expect(resolveUniqueFacilitiesFromItemTree([root])).toEqual(["Forge"]);
	});

	it("ignores items with no children", () => {
		const root = makeResolvedItem({ facilities: ["Workbench"], children: [] });
		expect(resolveUniqueFacilitiesFromItemTree([root])).toEqual(["Workbench"]);
	});
});
