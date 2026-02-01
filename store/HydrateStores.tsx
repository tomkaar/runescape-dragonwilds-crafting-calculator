"use client";

import { useEffect } from "react";
import { useFavouriteItems } from "./favourite-items";
import { useSettings } from "./settings";
import { useSelectedMaterial } from "./selected-material";

/**
 * This component will rehydrate the provided store
 * when the document becomes visible or the window gains focus.
 */
export function HydrateStores() {
  const updateStore = () => {
    useFavouriteItems.persist.rehydrate();
    useSettings.persist.rehydrate();
    useSelectedMaterial.persist.rehydrate();
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
