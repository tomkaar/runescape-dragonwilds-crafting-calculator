import { resolveItemTree } from "@/domain/crafting/utils/resolve-item-tree";
import { type ResolvedItem } from "@/domain/crafting/types/resolved-item";
import { cache } from "react";
import { type MaterialTreeItem } from "../types/material-tree";

// Produces a path-based ID so the same item appearing at different positions
// in the tree (e.g. coal as a child of iron-bar vs steel-bar) gets a unique key.
function buildNodeId(parentNodeId: string | null, itemId: string, variantSuffix: string | null = null): string {
    return [parentNodeId, itemId, variantSuffix]
        .filter((p): p is string => p !== null)
        .join("_");
}

// Groups consecutive ResolvedItems that belong to the same multi-variant item
// so they can be rendered as a selector + variant pair.
// Single-variant items are wrapped in a one-element array for uniform iteration.
function groupVariants(items: ResolvedItem[]): ResolvedItem[][] {
    return items.reduce<ResolvedItem[][]>((groups, item) => {
        const last = groups[groups.length - 1];
        if (last && last[0].item.id === item.item.id && item.variantIndex !== null) {
            last.push(item);
        } else {
            groups.push([item]);
        }
        return groups;
    }, []);
}

// Converts a flat list of ResolvedItems into a MaterialTreeItem hierarchy.
// Multi-variant items produce a selector node whose children are the variant nodes,
// mirroring the selector/variant structure used by resolveCraftingTree.
function adaptToMaterialTree(
    resolvedItems: ResolvedItem[],
    parentNodeId: string | null,
): MaterialTreeItem[] {
    const result: MaterialTreeItem[] = [];

    for (const group of groupVariants(resolvedItems)) {
        const [first] = group;

        if (first.variantIndex === null) {
            const nodeId = buildNodeId(parentNodeId, first.item.id);
            const children = adaptToMaterialTree(first.children, nodeId);

            result.push({
                id: first.item.id,
                nodeId,
                item: first.item,
                quantity: first.quantityNeeded,
                variant: first.variant,
                facilities: first.facilities,
                isEnd: first.isLeaf,
                ...(children.length > 0 ? { children } : {}),
            });
        } else {
            // Multi-variant: a selector node groups the variants so the UI can
            // present a recipe picker. The selector carries no facilities of its
            // own — those live on the individual variant nodes.
            const selectorNodeId = buildNodeId(parentNodeId, first.item.id);

            const variantChildren: MaterialTreeItem[] = group.map((variantItem, vi) => {
                const variantNodeId = buildNodeId(parentNodeId, first.item.id, `v${vi}`);
                const children = adaptToMaterialTree(variantItem.children, variantNodeId);

                return {
                    id: variantItem.item.id,
                    nodeId: variantNodeId,
                    item: variantItem.item,
                    quantity: variantItem.quantityNeeded,
                    variant: variantItem.variant,
                    variantNumber: vi + 1,
                    facilities: variantItem.facilities,
                    isEnd: variantItem.isLeaf,
                    ...(children.length > 0 ? { children } : {}),
                };
            });

            result.push({
                id: first.item.id,
                nodeId: selectorNodeId,
                item: first.item,
                quantity: first.quantityNeeded,
                facilities: [],
                children: variantChildren,
            });
        }
    }

    return result;
}

/**
 * Resolves the materials tree for a given item, returning a hierarchical
 * MaterialTreeItem structure. Delegates quantity/recipe logic to resolveItemTree
 * and adapts the result into the nested format the UI expects.
 * Memoized per React request so multiple components resolving the same item share one result.
 */
export const resolveMaterialsTree = cache(
    (itemId: string, quantityNeeded = 1): MaterialTreeItem[] => {
        const resolvedItems = resolveItemTree(itemId, quantityNeeded);
        if (resolvedItems.length === 0) return [];
        return adaptToMaterialTree(resolvedItems, null);
    },
);
