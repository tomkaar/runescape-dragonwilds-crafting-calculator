import { resolveMaterialTree } from "@/features/material-tree/utils/resolve-material-tree";
import { flattenQuantities } from "./flatten-quantities";

/**
 * Looks up a node's quantity in a tracked item's unmultiplied material tree —
 * the base quantity a marked material stores, matching what the item cards'
 * checkboxes save.
 */
export function findBaseQuantity(
	trackedItemId: string,
	nodeId: string,
): number | undefined {
	return flattenQuantities(resolveMaterialTree(trackedItemId)).find(
		(n) => n.nodeId === nodeId,
	)?.quantity;
}
