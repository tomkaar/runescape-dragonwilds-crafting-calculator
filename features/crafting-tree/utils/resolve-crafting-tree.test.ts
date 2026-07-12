import { describe, expect, it, vi } from "vitest";
import { makeItem, makeRecipe, makeVariant } from "@/test/crafting-helpers";

// Disable React's cache so tests don't share memoized results
vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>();
	return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock("@/utils/source-item-by-id", () => ({
	sourceItemById: vi.fn(),
}));

import { sourceItemById } from "@/utils/source-item-by-id";
import type { Node } from "../schemas/Node";
import { resolveCraftingTree } from "./resolve-crafting-tree";

const mockSourceItemById = vi.mocked(sourceItemById);

/** Narrows a union Node to a specific `type`, asserting on the discriminant along the way. */
function assertNodeType<T extends Node["type"]>(
	node: Node,
	type: T,
): asserts node is Extract<Node, { type: T }> {
	expect(node.type).toBe(type);
}

describe("item not found", () => {
	it("returns empty nodes and edges when sourceItemById returns undefined", () => {
		mockSourceItemById.mockReturnValue(undefined);
		expect(resolveCraftingTree({ itemId: "unknown-item" })).toEqual({
			nodes: [],
			edges: [],
		});
	});

	it("returns empty nodes and edges when item has no variants", () => {
		mockSourceItemById.mockReturnValue(makeItem("empty-variants-item", []));
		expect(resolveCraftingTree({ itemId: "empty-variants-item" })).toEqual({
			nodes: [],
			edges: [],
		});
	});
});

describe("single variant leaf node", () => {
	it("marks a variant with no recipe as a leaf node", () => {
		mockSourceItemById.mockReturnValue(
			makeItem("leaf-item", [makeVariant(null)]),
		);
		const { nodes } = resolveCraftingTree({ itemId: "leaf-item" });
		expect(nodes).toHaveLength(1);
		const node = nodes[0];
		assertNodeType(node, "material");
		expect(node.data.isRoot).toBe(true);
		expect(node.data.leafNode).toBe(true);
	});

	it("produces one node and one edge rooted at 'root'", () => {
		mockSourceItemById.mockReturnValue(
			makeItem("leaf-item-2", [makeVariant(null)]),
		);
		const { nodes, edges } = resolveCraftingTree({ itemId: "leaf-item-2" });
		expect(nodes).toHaveLength(1);
		expect(edges).toHaveLength(1);
		expect(edges[0].source).toBe("root");
		expect(edges[0].target).toBe(nodes[0].id);
	});

	it("marks a variant with a recipe but no materials as a leaf node", () => {
		// e.g. Obsidian Cape: has a recipe (facility + output) but an empty materials list —
		// must not render a source Handle with nothing connected to it
		mockSourceItemById.mockReturnValue(
			makeItem("empty-recipe-item", [makeVariant(makeRecipe(1))]),
		);
		const { nodes } = resolveCraftingTree({ itemId: "empty-recipe-item" });
		expect(nodes).toHaveLength(1);
		const node = nodes[0];
		assertNodeType(node, "material");
		expect(node.data.isRoot).toBe(true);
		expect(node.data.leafNode).toBe(true);
	});

	it("marks a node whose only recipe material cannot be resolved as a leaf node", () => {
		const item = makeItem("parent-missing-only", [
			makeVariant(makeRecipe(1, [{ itemId: "missing", quantity: 1 }])),
		]);
		mockSourceItemById.mockImplementation((id) =>
			id === "parent-missing-only" ? item : undefined,
		);
		const { nodes } = resolveCraftingTree({ itemId: "parent-missing-only" });
		const node = nodes[0];
		assertNodeType(node, "material");
		expect(node.data.isRoot).toBe(true);
		expect(node.data.leafNode).toBe(true);
	});

	it("does not mark a node with resolvable children as a leaf node", () => {
		const mat = makeItem("mat-item", [makeVariant(null)]);
		const item = makeItem("parent-with-mat", [
			makeVariant(makeRecipe(1, [{ itemId: "mat-item", quantity: 1 }])),
		]);
		mockSourceItemById.mockImplementation((id) => {
			if (id === "parent-with-mat") return item;
			if (id === "mat-item") return mat;
			return undefined;
		});
		const { nodes } = resolveCraftingTree({ itemId: "parent-with-mat" });
		const parentNode = nodes.find((n) => n.id === "parent-with-mat");
		if (!parentNode) throw new Error("expected parent node");
		assertNodeType(parentNode, "material");
		expect(parentNode.data.isRoot).toBe(true);
		expect(parentNode.data.leafNode).toBe(false);

		const matNode = nodes.find((n) => n.data.id === "mat-item");
		if (!matNode) throw new Error("expected material node");
		assertNodeType(matNode, "material");
		expect(matNode.data.isRoot).toBe(false);
	});

	it("marks a variant option with a recipe but no materials as a leaf node", () => {
		mockSourceItemById.mockReturnValue(
			makeItem("multi-leaf-item", [
				makeVariant(makeRecipe(1)),
				makeVariant(null),
			]),
		);
		const { nodes } = resolveCraftingTree({ itemId: "multi-leaf-item" });
		const variants = nodes.filter((n) => n.id !== "multi-leaf-item");
		variants.forEach((v) => {
			assertNodeType(v, "material");
			expect(v.data.isRoot).toBe(false);
			expect(v.data.leafNode).toBe(true);
		});
	});
});

describe("hasExcessItems", () => {
	it("is always false on the initial node even when the recipe overproduces", () => {
		// recipe makes 3 but prevQuantity defaults to 1 — would be excess on a sub-node
		mockSourceItemById.mockReturnValue(
			makeItem("root-item", [makeVariant(makeRecipe(3))]),
		);
		const { nodes } = resolveCraftingTree({ itemId: "root-item" });
		const node = nodes[0];
		assertNodeType(node, "material");
		expect(node.data.isRoot).toBe(true);
		expect(node.data.hasExcessItems).toBe(false);
	});
});

describe("quantityNeeded", () => {
	it("defaults to 1 when prevQuantity is not provided", () => {
		mockSourceItemById.mockReturnValue(
			makeItem("qty-item", [makeVariant(null)]),
		);
		const { nodes } = resolveCraftingTree({ itemId: "qty-item" });
		const node = nodes[0];
		assertNodeType(node, "material");
		expect(node.data.isRoot).toBe(true);
		expect(node.data.quantityNeeded).toBe(1);
	});

	it("reflects prevQuantity when provided", () => {
		mockSourceItemById.mockReturnValue(
			makeItem("qty-item-2", [makeVariant(null)]),
		);
		const { nodes } = resolveCraftingTree({
			itemId: "qty-item-2",
			prevQuantity: 7,
			prevItemId: "parent",
		});
		// `initialNode` isn't overridden here, so this is still treated as the root call.
		const node = nodes[0];
		assertNodeType(node, "material");
		expect(node.data.isRoot).toBe(true);
		expect(node.data.quantityNeeded).toBe(7);
	});
});

describe("recipe materials", () => {
	it("silently skips a material that cannot be found", () => {
		const item = makeItem("parent", [
			makeVariant(makeRecipe(1, [{ itemId: "missing-mat", quantity: 1 }])),
		]);
		mockSourceItemById.mockImplementation((id) =>
			id === "parent" ? item : undefined,
		);
		const { nodes, edges } = resolveCraftingTree({ itemId: "parent" });
		// only the parent's own node and edge — no sub-tree
		expect(nodes).toHaveLength(1);
		expect(edges).toHaveLength(1);
		const node = nodes[0];
		assertNodeType(node, "material");
		expect(node.data.isRoot).toBe(true);
	});

	it("silently skips a material that exists but has no variants", () => {
		const emptyMat = makeItem("empty-mat", []);
		const item = makeItem("parent-empty-mat", [
			makeVariant(makeRecipe(1, [{ itemId: "empty-mat", quantity: 1 }])),
		]);
		mockSourceItemById.mockImplementation((id) => {
			if (id === "parent-empty-mat") return item;
			if (id === "empty-mat") return emptyMat;
			return undefined;
		});
		const { nodes, edges } = resolveCraftingTree({
			itemId: "parent-empty-mat",
		});
		expect(nodes).toHaveLength(1);
		expect(edges).toHaveLength(1);
		const node = nodes[0];
		assertNodeType(node, "material");
		expect(node.data.isRoot).toBe(true);
	});

	it("includes found materials and skips missing ones when a recipe has multiple materials", () => {
		const foundMat = makeItem("found-mat", [makeVariant(null)]);
		const item = makeItem("parent-mixed", [
			makeVariant(
				makeRecipe(1, [
					{ itemId: "missing-mat", quantity: 1 },
					{ itemId: "found-mat", quantity: 2 },
				]),
			),
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
		const foundMatNode = nodes.find((n) => n.data.id === "found-mat");
		if (!foundMatNode) throw new Error("expected found-mat node");
		assertNodeType(foundMatNode, "material");
		expect(foundMatNode.data.isRoot).toBe(false);
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
		// the selector is the root item itself here, so it's "recipe-group" with isRoot: true
		const selector = nodes.find((n) => n.id === "multi-item");
		if (!selector) throw new Error("expected selector node");
		assertNodeType(selector, "recipe-group");
		expect(selector.data.isRoot).toBe(true);
	});

	it("routes edges through the variant selector: root → selector → each variant", () => {
		mockSourceItemById.mockReturnValue(
			makeItem("multi-item-2", [makeVariant(null), makeVariant(null)]),
		);
		const { edges } = resolveCraftingTree({ itemId: "multi-item-2" });
		// edge from root to selector
		expect(edges).toContainEqual(
			expect.objectContaining({ source: "root", target: "multi-item-2" }),
		);
		// edges from selector to each variant
		expect(edges).toContainEqual(
			expect.objectContaining({
				source: "multi-item-2",
				target: "multi-item-2_v0",
			}),
		);
		expect(edges).toContainEqual(
			expect.objectContaining({
				source: "multi-item-2",
				target: "multi-item-2_v1",
			}),
		);
	});

	it("marks edges from selector to variants as highlighted", () => {
		mockSourceItemById.mockReturnValue(
			makeItem("multi-item-3", [makeVariant(null), makeVariant(null)]),
		);
		const { edges } = resolveCraftingTree({ itemId: "multi-item-3" });
		const variantEdges = edges.filter((e) => e.source === "multi-item-3");
		expect(variantEdges).toHaveLength(2);
		variantEdges.forEach((e) => {
			expect(e.data.highlighted).toBe(true);
		});
	});

	it("sets numberOfRecipies on the selector node and isRecipeNumberVariant on variant nodes", () => {
		mockSourceItemById.mockReturnValue(
			makeItem("multi-item-4", [makeVariant(null), makeVariant(null)]),
		);
		const { nodes } = resolveCraftingTree({ itemId: "multi-item-4" });
		const selector = nodes.find((n) => n.id === "multi-item-4");
		if (!selector) throw new Error("expected selector node");
		assertNodeType(selector, "recipe-group");
		expect(selector.data.numberOfRecipies).toBe(2);

		const variants = nodes.filter((n) => n.id !== "multi-item-4");
		variants.forEach((v) => {
			assertNodeType(v, "material");
		});
		expect(
			variants
				.map((n) =>
					n.type === "material" ? n.data.isRecipeNumberVariant : null,
				)
				.sort(),
		).toEqual([1, 2]);
	});

	it("assigns type 'recipe-group' to a non-root multi-variant material", () => {
		const childMulti = makeItem("child-multi", [
			makeVariant(null),
			makeVariant(null),
		]);
		const parent = makeItem("parent-nested-multi", [
			makeVariant(makeRecipe(1, [{ itemId: "child-multi", quantity: 1 }])),
		]);
		mockSourceItemById.mockImplementation((id) => {
			if (id === "parent-nested-multi") return parent;
			if (id === "child-multi") return childMulti;
			return undefined;
		});
		const { nodes } = resolveCraftingTree({ itemId: "parent-nested-multi" });

		const parentNode = nodes.find((n) => n.id === "parent-nested-multi");
		if (!parentNode) throw new Error("expected parent node");
		assertNodeType(parentNode, "material");
		expect(parentNode.data.isRoot).toBe(true);

		const selector = nodes.find(
			(n) => n.data.id === "child-multi" && n.type === "recipe-group",
		);
		if (!selector)
			throw new Error("expected a non-root recipe-group selector node");
		assertNodeType(selector, "recipe-group");
		expect(selector.data.numberOfRecipies).toBe(2);
		expect(selector.data.isRoot).toBe(false);

		const variants = nodes.filter(
			(n) => n.type === "material" && n.data.id === "child-multi",
		);
		expect(variants).toHaveLength(2);
		variants.forEach((v) => {
			assertNodeType(v, "material");
		});
		expect(
			variants
				.map((n) =>
					n.type === "material" ? n.data.isRecipeNumberVariant : null,
				)
				.sort(),
		).toEqual([1, 2]);
	});
});
