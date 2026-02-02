"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SettingsStore = {
  UIItemFavouritesOpen?: boolean;
  UIItemUsedInOpen?: boolean;
  UIItemRequiredMaterials?: boolean;
  toggleUIItemFavouritesOpen: () => void;
  toggleUIItemUsedInOpen: () => void;
  toggleUIItemRequiredMaterials: () => void;
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set, get) => ({
      UIItemFavouritesOpen: false,
      UIItemUsedInOpen: false,
      UIItemRequiredMaterials: true,
      toggleUIItemFavouritesOpen: () =>
        set(() => ({ UIItemFavouritesOpen: !get().UIItemFavouritesOpen })),
      toggleUIItemUsedInOpen: () =>
        set(() => ({ UIItemUsedInOpen: !get().UIItemUsedInOpen })),
      toggleUIItemRequiredMaterials: () =>
        set(() => ({
          UIItemRequiredMaterials: !get().UIItemRequiredMaterials,
        })),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
