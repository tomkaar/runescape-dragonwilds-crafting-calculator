"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ProgressUiStateStore = {
  grouped: boolean;
  setGrouped: (grouped: boolean) => void;
  compact: boolean;
  setCompact: (compact: boolean) => void;
  itemCompact: boolean;
  setItemCompact: (compact: boolean) => void;
};

export const useProgressUiState = create<ProgressUiStateStore>()(
  persist(
    (set) => ({
      grouped: false,
      setGrouped: (grouped) => set({ grouped }),
      compact: false,
      setCompact: (compact) => set({ compact }),
      itemCompact: true,
      setItemCompact: (itemCompact) => set({ itemCompact }),
    }),
    {
      name: "progress-ui-state",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
