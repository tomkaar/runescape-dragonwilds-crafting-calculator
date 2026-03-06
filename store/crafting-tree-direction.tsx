"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CraftingTreeDirectionStore = {
  direction: "TB" | "LR";
  setDirection: (direction: "TB" | "LR") => void;
};

export const useCraftingTreeDirection = create<CraftingTreeDirectionStore>()(
  persist(
    (set) => ({
      direction: "TB",
      setDirection: (direction: "TB" | "LR") => set({ direction }),
    }),
    {
      name: "crafting-tree-direction",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
