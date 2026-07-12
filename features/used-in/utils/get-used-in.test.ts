import { describe, expect, it, vi } from "vitest";
import type { Item } from "@/Types";
import { makeItem, makeRecipe, makeVariant } from "@/test/crafting-helpers";

vi.mock("@/data/items.json", () => ({ default: [] }));

async function loadGetUsedIn(items: Item[]) {
	vi.resetModules();
	vi.doMock("@/data/items.json", () => ({ default: items }));
	return (await import("./get-used-in")).getUsedIn;
}

describe("no items reference the given itemId", () => {
	it("returns an empty array", async () => {
		const items = [makeItem("unrelated", [makeVariant(null)])];
		const getUsedIn = await loadGetUsedIn(items);
		expect(getUsedIn("mat-item")).toEqual([]);
	});
});

describe("a single item uses the material", () => {
	it("includes that item", async () => {
		const items = [
			makeItem("mat-item", [makeVariant(null)]),
			makeItem("parent", [
				makeVariant(makeRecipe(1, [{ itemId: "mat-item", quantity: 1 }])),
			]),
		];
		const getUsedIn = await loadGetUsedIn(items);
		const result = getUsedIn("mat-item");
		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({
			id: "parent",
			name: "parent-name",
			image: null,
		});
	});
});

describe("an item references the material across multiple variants", () => {
	it("is only included once", async () => {
		const items = [
			makeItem("mat-item", [makeVariant(null)]),
			makeItem("parent", [
				makeVariant(makeRecipe(1, [{ itemId: "mat-item", quantity: 1 }])),
				makeVariant(makeRecipe(1, [{ itemId: "mat-item", quantity: 2 }])),
			]),
		];
		const getUsedIn = await loadGetUsedIn(items);
		expect(getUsedIn("mat-item")).toHaveLength(1);
	});
});

describe("multiple items use the material", () => {
	it("includes all of them", async () => {
		const items = [
			makeItem("mat-item", [makeVariant(null)]),
			makeItem("parent-a", [
				makeVariant(makeRecipe(1, [{ itemId: "mat-item", quantity: 1 }])),
			]),
			makeItem("parent-b", [
				makeVariant(makeRecipe(1, [{ itemId: "mat-item", quantity: 1 }])),
			]),
		];
		const getUsedIn = await loadGetUsedIn(items);
		const result = getUsedIn("mat-item");
		expect(result.map((r) => r.id).sort()).toEqual(["parent-a", "parent-b"]);
	});
});

describe("an item with no recipe", () => {
	it("is not treated as using any material", async () => {
		const items = [
			makeItem("mat-item", [makeVariant(null)]),
			makeItem("leaf-only", [makeVariant(null)]),
		];
		const getUsedIn = await loadGetUsedIn(items);
		expect(getUsedIn("mat-item")).toEqual([]);
	});
});
