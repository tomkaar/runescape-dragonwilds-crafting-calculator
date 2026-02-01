"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SettingsStore = {
  UIItemFavouritesOpen?: boolean;
  UIItemUsedInOpen?: boolean;
  toggleUIItemFavouritesOpen: () => void;
  toggleUIItemUsedInOpen: () => void;
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set, get) => ({
      UIItemFavouritesOpen: false,
      UIItemUsedInOpen: true,
      toggleUIItemFavouritesOpen: () =>
        set(() => ({ UIItemFavouritesOpen: !get().UIItemFavouritesOpen })),
      toggleUIItemUsedInOpen: () =>
        set(() => ({ UIItemUsedInOpen: !get().UIItemUsedInOpen })),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
