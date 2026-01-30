import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SelectedItemsStore = {
  items: {
    id: string;
    itemId: string;
    variantCounts: Record<string, number>;
  }[];
  addAnItem: (value: string) => void;
  removeAnItem: (id: string) => void;
  setCount: (id: string, variantId: string, count: number) => void;
  increaseItemCount: (id: string, variantId: string) => void;
  decreaseItemCount: (id: string, variantId: string) => void;
};

export const useSelectedItems = create<SelectedItemsStore>()(
  persist(
    (set, get) => ({
      items: [],
      addAnItem: (value: string) =>
        set({
          items: [
            { id: self.crypto.randomUUID(), itemId: value, variantCounts: {} },
            ...get().items,
          ],
        }),
      removeAnItem: (id: string) =>
        set({
          items: get().items.filter((item) => item.id !== id),
        }),
      setCount: (id: string, variantId: string, count: number) =>
        set({
          items: get().items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  variantCounts: { ...item.variantCounts, [variantId]: count },
                }
              : item,
          ),
        }),
      increaseItemCount: (id: string, variantId: string) =>
        set({
          items: get().items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  variantCounts: {
                    ...item.variantCounts,
                    [variantId]: (item.variantCounts[variantId] || 0) + 1,
                  },
                }
              : item,
          ),
        }),
      decreaseItemCount: (id: string, variantId: string) =>
        set({
          items: get().items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  variantCounts: {
                    ...item.variantCounts,
                    [variantId]: Math.max(
                      0,
                      (item.variantCounts[variantId] || 1) - 1,
                    ),
                  },
                }
              : item,
          ),
        }),
    }),
    {
      name: "selected-items",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
