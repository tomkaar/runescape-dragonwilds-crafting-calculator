import { describe, it, expect } from "vitest";
import { flattenQuantities } from "./owned-materials";
import type { MaterialTreeItem } from "@/features/materials-tree/types/material-tree";

function makeLeaf(nodeId: string, quantity: number): MaterialTreeItem {
  return { id: nodeId, nodeId, quantity, facilities: [], isEnd: true } as unknown as MaterialTreeItem;
}

function makeNode(
  nodeId: string,
  quantity: number,
  children: MaterialTreeItem[],
): MaterialTreeItem {
  return { id: nodeId, nodeId, quantity, facilities: [], children } as unknown as MaterialTreeItem;
}

function makeVariantNode(
  nodeId: string,
  variantNumber: number,
  children: MaterialTreeItem[],
): MaterialTreeItem {
  return { id: nodeId, nodeId, quantity: 1, variantNumber, facilities: [], children } as unknown as MaterialTreeItem;
}

describe("flattenQuantities", () => {
  it("returns empty array for empty input", () => {
    expect(flattenQuantities([])).toEqual([]);
  });

  it("returns a single entry for a leaf node", () => {
    expect(flattenQuantities([makeLeaf("iron-ore", 3)]))
      .toEqual([{ nodeId: "iron-ore", quantity: 3 }]);
  });

  it("includes both parent and child nodes", () => {
    const tree = [makeNode("iron-bar", 1, [makeLeaf("iron-ore", 2)])];
    expect(flattenQuantities(tree)).toEqual([
      { nodeId: "iron-bar", quantity: 1 },
      { nodeId: "iron-ore", quantity: 2 },
    ]);
  });

  it("recurses to arbitrary depth", () => {
    const tree = [
      makeNode("a", 1, [
        makeNode("b", 2, [
          makeLeaf("c", 3),
        ]),
      ]),
    ];
    expect(flattenQuantities(tree)).toEqual([
      { nodeId: "a", quantity: 1 },
      { nodeId: "b", quantity: 2 },
      { nodeId: "c", quantity: 3 },
    ]);
  });

  describe("variant nodes", () => {
    it("skips the variant node itself", () => {
      const tree = [makeVariantNode("sword_v0", 1, [makeLeaf("iron-ore", 2)])];
      const result = flattenQuantities(tree);
      expect(result.find((n) => n.nodeId === "sword_v0")).toBeUndefined();
    });

    it("promotes variant children to the same level", () => {
      const tree = [makeVariantNode("sword_v0", 1, [makeLeaf("iron-ore", 2)])];
      expect(flattenQuantities(tree)).toEqual([{ nodeId: "iron-ore", quantity: 2 }]);
    });

    it("handles a variant node with no children", () => {
      const variantLeaf = { id: "x", nodeId: "x", quantity: 1, variantNumber: 1, facilities: [] } as unknown as MaterialTreeItem;
      expect(flattenQuantities([variantLeaf])).toEqual([]);
    });

    it("handles mixed variant and non-variant siblings", () => {
      const tree = [
        makeLeaf("stone", 5),
        makeVariantNode("sword_v0", 1, [makeLeaf("iron-ore", 2)]),
      ];
      expect(flattenQuantities(tree)).toEqual([
        { nodeId: "stone", quantity: 5 },
        { nodeId: "iron-ore", quantity: 2 },
      ]);
    });
  });
});
