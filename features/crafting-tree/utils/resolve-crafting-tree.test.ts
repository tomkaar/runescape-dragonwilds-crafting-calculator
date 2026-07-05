import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Item, ItemVariant, Recipe } from "@/Types";

// Disable React's cache so tests don't share memoized results
vi.mock("react", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react")>();
    return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock("@/utils/source-item-by-id", () => ({
    sourceItemById: vi.fn(),
}));

import { sourceItemById } from "@/utils/source-item-by-id";
import { resolveCraftingTree } from "./resolve-crafting-tree";

const mockSourceItemById = vi.mocked(sourceItemById);

function makeItem(id: string, variants: ItemVariant[] = []): Item {
    return { id, name: `${id}-name`, image: null, variants, facilities: [] };
}

function makeVariant(recipe: Recipe | null = null): ItemVariant {
    return { id: "v1", name: "Variant", image: null, variantName: null, recipe, usesRecipe: null };
}

function makeRecipe(quantity = 1, materials: Recipe["materials"] = []): Recipe {
    return { id: "r1", facilities: [], quantity, materials };
}

beforeEach(() => {
    vi.resetAllMocks();
});

describe("item not found", () => {
    it("returns empty nodes and edges when sourceItemById returns undefined", () => {
        mockSourceItemById.mockReturnValue(undefined);
        expect(resolveCraftingTree({ itemId: "unknown-item" })).toEqual({ nodes: [], edges: [] });
    });

    it("returns empty nodes and edges when item has no variants", () => {
        mockSourceItemById.mockReturnValue(makeItem("empty-variants-item", []));
        expect(resolveCraftingTree({ itemId: "empty-variants-item" })).toEqual({ nodes: [], edges: [] });
    });
});

describe("single variant leaf node", () => {
    it("marks a variant with no recipe as a leaf node", () => {
        mockSourceItemById.mockReturnValue(makeItem("leaf-item", [makeVariant(null)]));
        const { nodes } = resolveCraftingTree({ itemId: "leaf-item" });
        expect(nodes).toHaveLength(1);
        expect(nodes[0].data.leafNode).toBe(true);
    });

    it("produces one node and one edge rooted at 'root'", () => {
        mockSourceItemById.mockReturnValue(makeItem("leaf-item-2", [makeVariant(null)]));
        const { nodes, edges } = resolveCraftingTree({ itemId: "leaf-item-2" });
        expect(nodes).toHaveLength(1);
        expect(edges).toHaveLength(1);
        expect(edges[0].source).toBe("root");
        expect(edges[0].target).toBe(nodes[0].id);
    });
});

describe("hasExcessItems", () => {
    it("is always false on the initial node even when the recipe overproduces", () => {
        // recipe makes 3 but prevQuantity defaults to 1 — would be excess on a sub-node
        mockSourceItemById.mockReturnValue(makeItem("root-item", [makeVariant(makeRecipe(3))]));
        const { nodes } = resolveCraftingTree({ itemId: "root-item" });
        expect(nodes[0].data.hasExcessItems).toBe(false);
    });


});

describe("quantityNeeded", () => {
    it("defaults to 1 when prevQuantity is not provided", () => {
        mockSourceItemById.mockReturnValue(makeItem("qty-item", [makeVariant(null)]));
        const { nodes } = resolveCraftingTree({ itemId: "qty-item" });
        expect(nodes[0].data.quantityNeeded).toBe(1);
    });

    it("reflects prevQuantity when provided", () => {
        mockSourceItemById.mockReturnValue(makeItem("qty-item-2", [makeVariant(null)]));
        const { nodes } = resolveCraftingTree({ itemId: "qty-item-2", prevQuantity: 7, prevItemId: "parent" });
        expect(nodes[0].data.quantityNeeded).toBe(7);
    });
});

describe("recipe materials", () => {
    it("silently skips a material that cannot be found", () => {
        const item = makeItem("parent", [makeVariant(makeRecipe(1, [{ itemId: "missing-mat", quantity: 1 }]))]);
        mockSourceItemById.mockImplementation((id) => (id === "parent" ? item : undefined));
        const { nodes, edges } = resolveCraftingTree({ itemId: "parent" });
        // only the parent's own node and edge — no sub-tree
        expect(nodes).toHaveLength(1);
        expect(edges).toHaveLength(1);
    });

    it("silently skips a material that exists but has no variants", () => {
        const emptyMat = makeItem("empty-mat", []);
        const item = makeItem("parent-empty-mat", [makeVariant(makeRecipe(1, [{ itemId: "empty-mat", quantity: 1 }]))]);
        mockSourceItemById.mockImplementation((id) => {
            if (id === "parent-empty-mat") return item;
            if (id === "empty-mat") return emptyMat;
            return undefined;
        });
        const { nodes, edges } = resolveCraftingTree({ itemId: "parent-empty-mat" });
        expect(nodes).toHaveLength(1);
        expect(edges).toHaveLength(1);
    });

    it("includes found materials and skips missing ones when a recipe has multiple materials", () => {
        const foundMat = makeItem("found-mat", [makeVariant(null)]);
        const item = makeItem("parent-mixed", [
            makeVariant(makeRecipe(1, [
                { itemId: "missing-mat", quantity: 1 },
                { itemId: "found-mat", quantity: 2 },
            ])),
        ]);
        mockSourceItemById.mockImplementation((id) => {
            if (id === "parent-mixed") return item;
            if (id === "found-mat") return foundMat;
            return undefined;
        });
        const { nodes, edges } = resolveCraftingTree({ itemId: "parent-mixed" });
        // parent + found-mat; missing-mat produces nothing
        expect(nodes).toHaveLength(2);
        expect(edges).toHaveLength(2);
        expect(nodes.some((n) => n.data.id === "found-mat")).toBe(true);
    });
});

describe("multiple variants", () => {
    it("creates a variant selector node plus one node per variant", () => {
        mockSourceItemById.mockReturnValue(
            makeItem("multi-item", [makeVariant(null), makeVariant(null)]),
        );
        const { nodes } = resolveCraftingTree({ itemId: "multi-item" });
        // 1 selector + 2 variant nodes
        expect(nodes).toHaveLength(3);
    });

    it("routes edges through the variant selector: root → selector → each variant", () => {
        mockSourceItemById.mockReturnValue(
            makeItem("multi-item-2", [makeVariant(null), makeVariant(null)]),
        );
        const { edges } = resolveCraftingTree({ itemId: "multi-item-2" });
        // edge from root to selector
        expect(edges).toContainEqual(expect.objectContaining({ source: "root", target: "multi-item-2" }));
        // edges from selector to each variant
        expect(edges).toContainEqual(expect.objectContaining({ source: "multi-item-2", target: "multi-item-2_v0" }));
        expect(edges).toContainEqual(expect.objectContaining({ source: "multi-item-2", target: "multi-item-2_v1" }));
    });

    it("marks edges from selector to variants as highlighted", () => {
        mockSourceItemById.mockReturnValue(
            makeItem("multi-item-3", [makeVariant(null), makeVariant(null)]),
        );
        const { edges } = resolveCraftingTree({ itemId: "multi-item-3" });
        const variantEdges = edges.filter((e) => e.source === "multi-item-3");
        expect(variantEdges).toHaveLength(2);
        variantEdges.forEach((e) => expect(e.data.highlighted).toBe(true));
    });

    it("sets numberOfRecipies on the selector node and isRecipeNumberVariant on variant nodes", () => {
        mockSourceItemById.mockReturnValue(
            makeItem("multi-item-4", [makeVariant(null), makeVariant(null)]),
        );
        const { nodes } = resolveCraftingTree({ itemId: "multi-item-4" });
        const selector = nodes.find((n) => n.id === "multi-item-4");
        const variants = nodes.filter((n) => n.id !== "multi-item-4");
        expect(selector?.data.numberOfRecipies).toBe(2);
        expect(variants.map((n) => n.data.isRecipeNumberVariant).sort()).toEqual([1, 2]);
    });
});
