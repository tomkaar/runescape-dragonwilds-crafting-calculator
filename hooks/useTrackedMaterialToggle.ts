"use client";

import { useSelectedMaterial } from "@/store/selected-material";

type Args = {
	initialItemId: string;
	nodeId: string;
	itemId: string;
	quantity: number;
};

/**
 * Shared add/remove-from-tracking logic for crafting-tree and material-tree
 * nodes: looks up whether a node is already tracked and exposes add/remove/
 * toggle actions that build the SelectedMaterial entry consistently.
 */
export function useTrackedMaterialToggle({
	initialItemId,
	nodeId,
	itemId,
	quantity,
}: Args) {
	const allItems = useSelectedMaterial((state) => state.items);
	const addAnItem = useSelectedMaterial((state) => state.addAnItem);
	const removeAnItemByNodeId = useSelectedMaterial(
		(state) => state.removeAnItemByNodeId,
	);

	const items = allItems[initialItemId] || [];
	const added = items.find((item) => item.nodeId === nodeId);

	const add = () => {
		if (added) return;
		addAnItem(initialItemId, {
			id: self.crypto.randomUUID(),
			itemId,
			quantity,
			nodeId,
			nodeOriginalId: initialItemId,
			state: "TODO",
		});
	};

	const remove = () => {
		if (!added) return;
		removeAnItemByNodeId(initialItemId, nodeId);
	};

	const toggle = () => (added ? remove() : add());

	return { items, added, add, remove, toggle };
}
