"use client";

import { useEffect } from "react";
import { useCraftingTreeDirection } from "./crafting-tree-direction";
import { useFacilitiesOwned } from "./facilities-owned";
import { useFavouriteItems } from "./favourite-items";
import { useItemFilter } from "./item-filter";
import { useMaterialMultiplier } from "./material-multiplier";
import { useMobilePanelsState } from "./mobile-panel-state";
import { useSelectedMaterial } from "./selected-material";
import { useSkillLevels } from "./skill-levels";

/**
 * This component will rehydrate the provided store
 * when the document becomes visible or the window gains focus.
 */
export function HydrateStores() {
	const updateStore = () => {
		useCraftingTreeDirection.persist.rehydrate();
		useFacilitiesOwned.persist.rehydrate();
		useFavouriteItems.persist.rehydrate();
		useMobilePanelsState.persist.rehydrate();
		useSelectedMaterial.persist.rehydrate();
		useMaterialMultiplier.persist.rehydrate();
		useSkillLevels.persist.rehydrate();
		useItemFilter.persist.rehydrate();
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <known>
	useEffect(() => {
		document.addEventListener("visibilitychange", updateStore);
		window.addEventListener("focus", updateStore);
		return () => {
			document.removeEventListener("visibilitychange", updateStore);
			window.removeEventListener("focus", updateStore);
		};
	}, []);
	return null;
}
