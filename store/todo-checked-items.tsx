"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type TodoCheckedItemsStore = {
  items: string[];
  addAnItem: (value: string) => void;
  removeAnItem: (id: string) => void;
  toggleAnItem: (id: string) => void;
  clear: () => void;
};

export const useTodoCheckedItems = create<TodoCheckedItemsStore>()(
  persist(
    (set, get) => ({
      items: [],
      addAnItem: (value: string) =>
        set({
          items: [value, ...get().items],
        }),
      removeAnItem: (id: string) =>
        set({
          items: get().items.filter((item) => item !== id),
        }),
      toggleAnItem: (id: string) => {
        console.log("Toggling item", id);
        if (get().items.includes(id)) {
          get().removeAnItem(id);
        } else {
          console.log("Adding item", id);
          get().addAnItem(id);
        }
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "todo-checked-items",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
