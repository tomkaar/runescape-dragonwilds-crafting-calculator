"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ProgressUiStateStore = {
  itemCompact: boolean;
  setItemCompact: (compact: boolean) => void;
};

export const useProgressUiState = create<ProgressUiStateStore>()(
  persist(
    (set) => ({
      itemCompact: true,
      setItemCompact: (itemCompact) => set({ itemCompact }),
    }),
    {
      name: "progress-ui-state",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
