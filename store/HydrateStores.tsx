"use client";

import { useEffect } from "react";
import { useFavouriteItems } from "./favourite-items";
import { useMobilePanelsState } from "./mobile-panel-state";
import { useSelectedMaterial } from "./selected-material";
import { useMaterialMultiplier } from "./material-multiplier";
import { useCraftingTreeDirection } from "./crafting-tree-direction";

/**
 * This component will rehydrate the provided store
 * when the document becomes visible or the window gains focus.
 */
export function HydrateStores() {
  const updateStore = () => {
    useCraftingTreeDirection.persist.rehydrate();
    useFavouriteItems.persist.rehydrate();
    useMobilePanelsState.persist.rehydrate();
    useSelectedMaterial.persist.rehydrate();
    useMaterialMultiplier.persist.rehydrate();
  };

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
