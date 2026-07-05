import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Item, ItemVariant, Recipe } from "@/Types";
import { Facility } from "@/Types";

vi.mock("react", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react")>();
    return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock("@/utils/source-item-by-id", () => ({
    sourceItemById: vi.fn(),
}));

import { sourceItemById } from "@/utils/source-item-by-id";
import { resolveMaterialsTree } from "./resolve-materials-tree";

const mockSourceItemById = vi.mocked(sourceItemById);

function makeItem(id: string, variants: ItemVariant[] = []): Item {
    return { id, name: `${id}-name`, image: null, variants, facilities: [] };
}

function makeVariant(recipe: Recipe | null = null): ItemVariant {
    return { id: "v1", name: "Variant", image: null, variantName: null, recipe, usesRecipe: null };
}

function makeRecipe(quantity = 1, materials: Recipe["materials"] = [], facilities: Recipe["facilities"] = []): Recipe {
    return { id: "r1", facilities, quantity, materials };
}

beforeEach(() => {
    vi.resetAllMocks();
});

describe("item not found", () => {
    it("returns empty array when sourceItemById returns undefined", () => {
        mockSourceItemById.mockReturnValue(undefined);
        expect(resolveMaterialsTree("unknown-item")).toEqual([]);
    });

    it("returns empty array when item has no variants", () => {
        mockSourceItemById.mockReturnValue(makeItem("empty-item", []));
        expect(resolveMaterialsTree("empty-item")).toEqual([]);
    });
});

describe("single variant leaf node", () => {
    it("returns one item", () => {
        mockSourceItemById.mockReturnValue(makeItem("leaf-item", [makeVariant(null)]));
        expect(resolveMaterialsTree("leaf-item")).toHaveLength(1);
    });

    it("marks a leaf as isEnd: true", () => {
        mockSourceItemById.mockReturnValue(makeItem("leaf-item", [makeVariant(null)]));
        const [node] = resolveMaterialsTree("leaf-item");
        expect(node.isEnd).toBe(true);
    });

    it("has no children property", () => {
        mockSourceItemById.mockReturnValue(makeItem("leaf-item", [makeVariant(null)]));
        const [node] = resolveMaterialsTree("leaf-item");
        expect("children" in node).toBe(false);
    });

    it("sets id to the item id", () => {
        mockSourceItemById.mockReturnValue(makeItem("iron-ore", [makeVariant(null)]));
        const [node] = resolveMaterialsTree("iron-ore");
        expect(node.id).toBe("iron-ore");
    });

    it("sets nodeId to the item id when there is no parent", () => {
        mockSourceItemById.mockReturnValue(makeItem("iron-ore", [makeVariant(null)]));
        const [node] = resolveMaterialsTree("iron-ore");
        expect(node.nodeId).toBe("iron-ore");
    });

    it("sets facilities from the variant recipe", () => {
        mockSourceItemById.mockReturnValue(makeItem("iron-bar", [makeVariant(makeRecipe(1, [], [Facility[7]]))]));
        const [node] = resolveMaterialsTree("iron-bar");
        expect(node.facilities).toEqual(["Furnace"]);
    });
});

describe("quantityNeeded", () => {
    it("defaults to 1", () => {
        mockSourceItemById.mockReturnValue(makeItem("qty-item", [makeVariant(null)]));
        const [node] = resolveMaterialsTree("qty-item");
        expect(node.quantity).toBe(1);
    });

    it("reflects quantityNeeded argument", () => {
        mockSourceItemById.mockReturnValue(makeItem("qty-item", [makeVariant(null)]));
        const [node] = resolveMaterialsTree("qty-item", 5);
        expect(node.quantity).toBe(5);
    });
});

describe("children", () => {
    it("includes child nodes when the item has recipe materials", () => {
        const child = makeItem("child-item", [makeVariant(null)]);
        const parent = makeItem("parent-item", [makeVariant(makeRecipe(1, [{ itemId: "child-item", quantity: 2 }]))]);
        mockSourceItemById.mockImplementation((id) => {
            if (id === "parent-item") return parent;
            if (id === "child-item") return child;
            return undefined;
        });

        const [node] = resolveMaterialsTree("parent-item");
        expect("children" in node).toBe(true);
        if ("children" in node) {
            expect(node.children).toHaveLength(1);
            expect(node.children[0].id).toBe("child-item");
        }
    });

    it("silently skips a material that cannot be found", () => {
        const parent = makeItem("parent", [makeVariant(makeRecipe(1, [{ itemId: "missing", quantity: 1 }]))]);
        mockSourceItemById.mockImplementation((id) => (id === "parent" ? parent : undefined));

        const [node] = resolveMaterialsTree("parent");
        expect("children" in node).toBe(false);
    });

    it("sets child nodeId as parentNodeId_childItemId", () => {
        const child = makeItem("coal", [makeVariant(null)]);
        const parent = makeItem("iron-bar", [makeVariant(makeRecipe(1, [{ itemId: "coal", quantity: 1 }]))]);
        mockSourceItemById.mockImplementation((id) => {
            if (id === "iron-bar") return parent;
            if (id === "coal") return child;
            return undefined;
        });

        const [node] = resolveMaterialsTree("iron-bar");
        if ("children" in node) {
            expect(node.children[0].nodeId).toBe("iron-bar_coal");
        }
    });
});

describe("multiple variants", () => {
    it("creates a selector node plus one node per variant", () => {
        mockSourceItemById.mockReturnValue(makeItem("multi-item", [makeVariant(null), makeVariant(null)]));
        const result = resolveMaterialsTree("multi-item");
        // one selector at root
        expect(result).toHaveLength(1);
        const [selector] = result;
        // two variant children
        expect("children" in selector).toBe(true);
        if ("children" in selector) {
            expect(selector.children).toHaveLength(2);
        }
    });

    it("selector node has no variantNumber", () => {
        mockSourceItemById.mockReturnValue(makeItem("multi-item", [makeVariant(null), makeVariant(null)]));
        const [selector] = resolveMaterialsTree("multi-item");
        expect(selector.variantNumber).toBeUndefined();
    });

    it("variant nodes have 1-indexed variantNumber", () => {
        mockSourceItemById.mockReturnValue(makeItem("multi-item", [makeVariant(null), makeVariant(null)]));
        const [selector] = resolveMaterialsTree("multi-item");
        if ("children" in selector) {
            expect(selector.children.map((c) => c.variantNumber)).toEqual([1, 2]);
        }
    });

    it("selector node has empty facilities", () => {
        mockSourceItemById.mockReturnValue(makeItem("multi-item", [makeVariant(makeRecipe(1, [], [Facility[7]])), makeVariant(null)]));
        const [selector] = resolveMaterialsTree("multi-item");
        expect(selector.facilities).toEqual([]);
    });

    it("variant nodeIds are suffixed with v0, v1, etc.", () => {
        mockSourceItemById.mockReturnValue(makeItem("multi-item", [makeVariant(null), makeVariant(null)]));
        const [selector] = resolveMaterialsTree("multi-item");
        if ("children" in selector) {
            expect(selector.children[0].nodeId).toBe("multi-item_v0");
            expect(selector.children[1].nodeId).toBe("multi-item_v1");
        }
    });

    it("selector nodeId is just the item id when there is no parent", () => {
        mockSourceItemById.mockReturnValue(makeItem("multi-item", [makeVariant(null), makeVariant(null)]));
        const [selector] = resolveMaterialsTree("multi-item");
        expect(selector.nodeId).toBe("multi-item");
    });
});
