"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type StepsFilterStore = {
  isAll: boolean;
  selectedIds: string[];
  selectAll: () => void;
  toggleItem: (id: string, allIds: string[]) => void;
};

export const useStepsFilter = create<StepsFilterStore>()(
  persist(
    (set, get) => ({
      isAll: true,
      selectedIds: [],
      selectAll: () =>
        set((state) =>
          state.isAll
            ? { isAll: false, selectedIds: [] }
            : { isAll: true, selectedIds: [] },
        ),
      toggleItem: (id: string, allIds: string[]) => {
        const { isAll, selectedIds } = get();
        if (isAll) {
          set({ isAll: false, selectedIds: allIds.filter((i) => i !== id) });
        } else {
          const next = selectedIds.includes(id)
            ? selectedIds.filter((i) => i !== id)
            : [...selectedIds, id];
          set({ isAll: false, selectedIds: next });
        }
      },
    }),
    {
      name: "steps-filter",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
