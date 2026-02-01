"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type FavouriteItemsStore = {
  items: string[];
  addAnItem: (value: string) => void;
  removeAnItem: (id: string) => void;
  toggleAnItem: (id: string) => void;
};

export const useFavouriteItems = create<FavouriteItemsStore>()(
  persist(
    (set, get) => ({
      items: [],
      addAnItem: (value: string) =>
        set({
          items: [value, ...get().items],
        }),
      removeAnItem: (id: string) =>
        set({
          items: get().items.filter((item) => item !== id),
        }),
      toggleAnItem: (id: string) => {
        if (get().items.includes(id)) {
          get().removeAnItem(id);
        } else {
          get().addAnItem(id);
        }
      },
    }),
    {
      name: "favourite-items",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/**
 * This component will rehydrate the favourite items store
 * when the document becomes visible or the window gains focus.
 */
export function HydrateFavouriteItems() {
  const updateStore = () => {
    useFavouriteItems.persist.rehydrate();
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
