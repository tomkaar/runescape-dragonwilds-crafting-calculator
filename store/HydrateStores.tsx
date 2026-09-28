"use client";

import { useEffect } from "react";
import { useFavouriteItems } from "./favourite-items";
import { useItemFilter } from "./item-filter";
import { useMaterialMultiplier } from "./material-multiplier";
import { useSelectedMaterial } from "./selected-material";
import { useSettings } from "./settings";

/**
 * This component will rehydrate the provided store
 * when the document becomes visible or the window gains focus.
 */
export function HydrateStores() {
	const updateStore = () => {
		useFavouriteItems.persist.rehydrate();
		useSelectedMaterial.persist.rehydrate();
		useMaterialMultiplier.persist.rehydrate();
		useItemFilter.persist.rehydrate();
		useSettings.persist.rehydrate();
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
