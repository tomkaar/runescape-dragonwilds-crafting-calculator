"use client";

import { getMaterialSelection } from "@/features/material-tree/utils/material-selection";
import { useSelectedMaterial } from "@/store/selected-material";

type Material = {
	nodeId: string;
	itemId: string;
	quantity: number;
};

type Args = {
	initialItemId: string;
	materials: Material[];
};

/**
 * Bulk counterpart to useTrackedMaterialToggle: tracks or untracks all of a
 * node's direct materials at once. Toggling selects the missing materials,
 * or deselects them all when every material is already tracked.
 */
export function useTrackedMaterialsToggle({ initialItemId, materials }: Args) {
	const allItems = useSelectedMaterial((state) => state.items);
	const addItems = useSelectedMaterial((state) => state.addItems);
	const removeItemsByNodeIds = useSelectedMaterial(
		(state) => state.removeItemsByNodeIds,
	);

	const items = allItems[initialItemId] || [];
	const { allSelected, missing } = getMaterialSelection(materials, items);

	const toggle = () => {
		if (allSelected) {
			removeItemsByNodeIds(
				initialItemId,
				materials.map((material) => material.nodeId),
			);
			return;
		}

		addItems(
			initialItemId,
			missing.map((material) => ({
				id: self.crypto.randomUUID(),
				itemId: material.itemId,
				quantity: material.quantity,
				nodeId: material.nodeId,
				nodeOriginalId: initialItemId,
				state: "TODO",
			})),
		);
	};

	return { allSelected, toggle };
}
