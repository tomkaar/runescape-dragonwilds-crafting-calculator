import { ResolvedItem } from "../types/resolved-item";

/**
 * It will take an item tree and recursively traverse it to find all unique facilities used in the crafting tree. It will return an array of unique facility names.
 * @param itemTree - ResolvedItem[] - The item tree to resolve unique facilities from.
 * @returns An array of unique facility names.
 */
export function resolveUniqueFacilitiesFromItemTree(itemTree: ResolvedItem[]): string[] {
    const uniqueFacilities = new Set<string>();

    function traverseTree(items: ResolvedItem[]) {
        for (const item of items) {
            if (item.facilities) {
                for (const facility of item.facilities) {
                    uniqueFacilities.add(facility);
                }
            }
            if (item.children) {
                traverseTree(item.children);
            }
        }
    }

    traverseTree(itemTree);

    return Array.from(uniqueFacilities);
}