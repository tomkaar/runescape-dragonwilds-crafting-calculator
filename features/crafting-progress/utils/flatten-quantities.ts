import { type MaterialTreeItem } from "@/features/materials-tree/types/material-tree";

/**
 * Flattens a material tree into a list of (nodeId, quantity) pairs.
 *
 * Variant nodes (recipe alternates) are transparent — their children are
 * promoted up so every real leaf material still appears in the output.
 *
 * @param nodes - Top-level nodes of a resolved material tree.
 * @returns Flat array of { nodeId, quantity } for every non-variant node.
 */
export function flattenQuantities(
  nodes: MaterialTreeItem[],
): Array<{ nodeId: string; quantity: number }> {
  const result: Array<{ nodeId: string; quantity: number }> = [];
  for (const node of nodes) {
    if (node.variantNumber !== undefined) {
      // Variant node: skip itself but recurse into its children
      if ("children" in node) {
        result.push(...flattenQuantities(node.children));
      }
      continue;
    }
    result.push({ nodeId: node.nodeId, quantity: node.quantity });
    if ("children" in node) {
      result.push(...flattenQuantities(node.children));
    }
  }
  return result;
}
