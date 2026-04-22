"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AccordionState = {
  openItems: string[];
  setOpenItems: (items: string[]) => void;
};

export const useAccordionState = create<AccordionState>()(
  persist(
    (set) => ({
      openItems: [],
      setOpenItems: (items: string[]) => set({ openItems: items }),
    }),
    {
      name: "accordion-state",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
