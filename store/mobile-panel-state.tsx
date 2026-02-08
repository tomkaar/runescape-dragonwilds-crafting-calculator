"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type MobilePanelsState = {
  panels: Record<string, boolean>;
  togglePanel: (panelId: string) => void;
};

export const useMobilePanelsState = create<MobilePanelsState>()(
  persist(
    (set) => ({
      panels: {},
      togglePanel: (panelId: string) => {
        set((state) => ({
          panels: {
            ...state.panels,
            [panelId]: !state.panels[panelId],
          },
        }));
      },
    }),
    {
      name: "mobile-panel-state",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
