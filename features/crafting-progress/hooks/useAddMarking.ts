"use client";

import { findBaseQuantity } from "@/features/crafting-progress/utils/base-quantity";
import { useSelectedMaterial } from "@/store/selected-material";

/**
 * Marks a material node on a tracked item from outside its card, building
 * the same entry the item cards' checkbox does so the two are
 * indistinguishable.
 */
export function useAddMarking() {
	const addAnItem = useSelectedMaterial((state) => state.addAnItem);

	return (trackedItemId: string, itemId: string, nodeId: string) => {
		addAnItem(trackedItemId, {
			id: self.crypto.randomUUID(),
			itemId,
			quantity: findBaseQuantity(trackedItemId, nodeId) ?? 0,
			nodeId,
			nodeOriginalId: trackedItemId,
			state: "TODO",
		});
	};
}
