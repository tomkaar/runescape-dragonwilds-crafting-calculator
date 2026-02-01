"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SettingsStore = {
  UIItemFavouritesOpen?: boolean;
  toggleUIItemFavouritesOpen: () => void;
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set, get) => ({
      UIItemFavouritesOpen: false,
      toggleUIItemFavouritesOpen: () =>
        set(() => ({ UIItemFavouritesOpen: !get().UIItemFavouritesOpen })),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
