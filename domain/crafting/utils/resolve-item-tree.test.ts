import { describe, it, expect, vi } from "vitest";
import type { Recipe } from "@/Types";
import { makeItem, makeVariant, makeRecipe } from "@/test/crafting-helpers";

vi.mock("react", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react")>();
    return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock("@/utils/source-item-by-id", () => ({
    sourceItemById: vi.fn(),
}));

import { sourceItemById } from "@/utils/source-item-by-id";
import { resolveItemTree } from "./resolve-item-tree";

const mockSourceItemById = vi.mocked(sourceItemById);

describe("item not found", () => {
    it("returns empty array when sourceItemById returns undefined", () => {
        mockSourceItemById.mockReturnValue(undefined);
        expect(resolveItemTree("unknown-item")).toEqual([]);
    });

    it("returns empty array when item has no variants", () => {
        mockSourceItemById.mockReturnValue(makeItem("empty-item", []));
        expect(resolveItemTree("empty-item")).toEqual([]);
    });
});

describe("single variant leaf node", () => {
    it("marks a variant with no recipe as a leaf", () => {
        mockSourceItemById.mockReturnValue(makeItem("leaf-item", [makeVariant(null)]));
        const result = resolveItemTree("leaf-item");
        expect(result).toHaveLength(1);
        expect(result[0].isLeaf).toBe(true);
    });

    it("has no children", () => {
        mockSourceItemById.mockReturnValue(makeItem("leaf-item", [makeVariant(null)]));
        const [node] = resolveItemTree("leaf-item");
        expect(node.children).toHaveLength(0);
    });

    it("sets variantIndex to null for a single variant", () => {
        mockSourceItemById.mockReturnValue(makeItem("single-item", [makeVariant(null)]));
        const [node] = resolveItemTree("single-item");
        expect(node.variantIndex).toBeNull();
    });

    it("defaults quantityNeeded to 1", () => {
        mockSourceItemById.mockReturnValue(makeItem("qty-item", [makeVariant(null)]));
        const [node] = resolveItemTree("qty-item");
        expect(node.quantityNeeded).toBe(1);
    });

    it("reflects the quantityNeeded argument", () => {
        mockSourceItemById.mockReturnValue(makeItem("qty-item", [makeVariant(null)]));
        const [node] = resolveItemTree("qty-item", 7);
        expect(node.quantityNeeded).toBe(7);
    });
});

describe("facilities", () => {
    it("carries facilities from the variant recipe", () => {
        const recipe = makeRecipe(1, [], ["Workbench" as Recipe["facilities"][number]]);
        mockSourceItemById.mockReturnValue(makeItem("bench-item", [makeVariant(recipe)]));
        const [node] = resolveItemTree("bench-item");
        expect(node.facilities).toEqual(["Workbench"]);
    });

    it("returns empty facilities for a leaf node", () => {
        mockSourceItemById.mockReturnValue(makeItem("leaf-item", [makeVariant(null)]));
        const [node] = resolveItemTree("leaf-item");
        expect(node.facilities).toEqual([]);
    });
});

describe("hasExcessItems", () => {
    it("is always false on the root node even when the recipe overproduces", () => {
        mockSourceItemById.mockReturnValue(makeItem("root-item", [makeVariant(makeRecipe(3))]));
        const [node] = resolveItemTree("root-item");
        expect(node.hasExcessItems).toBe(false);
    });

    it("is false when quantityRecieved exactly matches quantityNeeded", () => {
        // need 4, recipe makes 2 → multiplier 2, receive 4 — exact match
        mockSourceItemById.mockReturnValue(makeItem("exact-mat", [makeVariant(makeRecipe(2))]));
        const mat = makeItem("exact-mat", [makeVariant(makeRecipe(2))]);
        const parent = makeItem("parent", [makeVariant(makeRecipe(1, [{ itemId: "exact-mat", quantity: 4 }]))]);
        mockSourceItemById.mockImplementation((id) => {
            if (id === "parent") return parent;
            if (id === "exact-mat") return mat;
            return undefined;
        });
        const [parentNode] = resolveItemTree("parent");
        const child = parentNode.children[0];
        expect(child.quantityNeeded).toBe(4);
        expect(child.quantityRecieved).toBe(4);
        expect(child.hasExcessItems).toBe(false);
    });

    it("is true on a non-root node when the recipe overproduces", () => {
        // need 1, recipe makes 3 → multiplier 1, receive 3 > 1
        const mat = makeItem("over-mat", [makeVariant(makeRecipe(3))]);
        const parent = makeItem("parent", [makeVariant(makeRecipe(1, [{ itemId: "over-mat", quantity: 1 }]))]);
        mockSourceItemById.mockImplementation((id) => {
            if (id === "parent") return parent;
            if (id === "over-mat") return mat;
            return undefined;
        });
        const [parentNode] = resolveItemTree("parent");
        expect(parentNode.children[0].hasExcessItems).toBe(true);
    });
});

describe("quantity multiplier", () => {
    it("rounds up to meet quantityNeeded when the recipe underproduces", () => {
        // need 3, recipe makes 2 → multiplier ceil(3/2)=2, receive 4
        const mat = makeItem("under-mat", [makeVariant(makeRecipe(2))]);
        const parent = makeItem("parent", [makeVariant(makeRecipe(1, [{ itemId: "under-mat", quantity: 3 }]))]);
        mockSourceItemById.mockImplementation((id) => {
            if (id === "parent") return parent;
            if (id === "under-mat") return mat;
            return undefined;
        });
        const [parentNode] = resolveItemTree("parent");
        const child = parentNode.children[0];
        expect(child.quantityNeeded).toBe(3);
        expect(child.quantityRecieved).toBe(4);
        expect(child.hasExcessItems).toBe(true);
    });

    it("propagates scaled quantity to grandchildren when an intermediate node has a multiplier", () => {
        // root needs 1 of mid; mid recipe makes 1 and needs 3 of leaf
        // root needs 3 of mid; mid recipe makes 2, so multiplier=2, receive 4
        // mid needs quantity 3 of leaf, multiplier 2 → leaf.quantityNeeded = 6
        const leaf = makeItem("leaf", [makeVariant(null)]);
        const mid = makeItem("mid", [makeVariant(makeRecipe(2, [{ itemId: "leaf", quantity: 3 }]))]);
        const root = makeItem("root", [makeVariant(makeRecipe(1, [{ itemId: "mid", quantity: 3 }]))]);
        mockSourceItemById.mockImplementation((id) => {
            if (id === "root") return root;
            if (id === "mid") return mid;
            if (id === "leaf") return leaf;
            return undefined;
        });
        const [rootNode] = resolveItemTree("root");
        const midNode = rootNode.children[0];
        const leafNode = midNode.children[0];
        expect(midNode.quantityNeeded).toBe(3);
        expect(midNode.quantityRecieved).toBe(4);
        expect(leafNode.quantityNeeded).toBe(6); // 3 materials × multiplier 2
    });
});

describe("multiple variants", () => {
    it("returns one ResolvedItem per variant", () => {
        mockSourceItemById.mockReturnValue(
            makeItem("multi-item", [makeVariant(null), makeVariant(null)]),
        );
        const result = resolveItemTree("multi-item");
        expect(result).toHaveLength(2);
    });

    it("sets variantIndex in order for each variant", () => {
        mockSourceItemById.mockReturnValue(
            makeItem("multi-item", [makeVariant(null), makeVariant(null)]),
        );
        const result = resolveItemTree("multi-item");
        expect(result[0].variantIndex).toBe(0);
        expect(result[1].variantIndex).toBe(1);
    });

    it("hasExcessItems is false on all root variants even when the recipe overproduces", () => {
        mockSourceItemById.mockReturnValue(
            makeItem("multi-root", [makeVariant(makeRecipe(5)), makeVariant(makeRecipe(5))]),
        );
        const result = resolveItemTree("multi-root");
        result.forEach((node) => expect(node.hasExcessItems).toBe(false));
    });
});

describe("recipe materials", () => {
    it("silently skips a material that cannot be found", () => {
        const item = makeItem("parent", [makeVariant(makeRecipe(1, [{ itemId: "missing", quantity: 1 }]))]);
        mockSourceItemById.mockImplementation((id) => (id === "parent" ? item : undefined));
        const [node] = resolveItemTree("parent");
        expect(node.children).toHaveLength(0);
    });

    it("silently skips a material that exists but has no variants", () => {
        const emptyMat = makeItem("empty-mat", []);
        const item = makeItem("parent", [makeVariant(makeRecipe(1, [{ itemId: "empty-mat", quantity: 1 }]))]);
        mockSourceItemById.mockImplementation((id) => {
            if (id === "parent") return item;
            if (id === "empty-mat") return emptyMat;
            return undefined;
        });
        const [node] = resolveItemTree("parent");
        expect(node.children).toHaveLength(0);
    });

    it("includes found materials and skips missing ones in a mixed recipe", () => {
        const found = makeItem("found-mat", [makeVariant(null)]);
        const item = makeItem("parent", [
            makeVariant(makeRecipe(1, [
                { itemId: "missing-mat", quantity: 1 },
                { itemId: "found-mat", quantity: 2 },
            ])),
        ]);
        mockSourceItemById.mockImplementation((id) => {
            if (id === "parent") return item;
            if (id === "found-mat") return found;
            return undefined;
        });
        const [node] = resolveItemTree("parent");
        expect(node.children).toHaveLength(1);
        expect(node.children[0].item.id).toBe("found-mat");
    });

    it("multi-variant materials expand to one child per variant", () => {
        const mat = makeItem("multi-mat", [makeVariant(null), makeVariant(null)]);
        const item = makeItem("parent", [makeVariant(makeRecipe(1, [{ itemId: "multi-mat", quantity: 1 }]))]);
        mockSourceItemById.mockImplementation((id) => {
            if (id === "parent") return item;
            if (id === "multi-mat") return mat;
            return undefined;
        });
        const [node] = resolveItemTree("parent");
        expect(node.children).toHaveLength(2);
        expect(node.children[0].variantIndex).toBe(0);
        expect(node.children[1].variantIndex).toBe(1);
    });
});
