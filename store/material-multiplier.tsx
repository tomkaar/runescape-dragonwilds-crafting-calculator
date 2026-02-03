"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type MaterialMultiplierStore = {
  items: Record<string, number>;
  setMultiplier: (itemIdKey: string, value: number) => void;
};

export const useMaterialMultiplier = create<MaterialMultiplierStore>()(
  persist(
    (set, get) => ({
      items: {},
      setMultiplier: (itemIdKey: string, value: number) =>
        set({
          items: {
            ...get().items,
            [itemIdKey]: value,
          },
        }),
    }),
    {
      name: "material-multiplier",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
