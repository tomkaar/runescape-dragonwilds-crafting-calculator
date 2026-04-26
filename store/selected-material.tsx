"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Item = {
  // The unique id for this selected material entry
  id: string;
  // The id of the selected item
  itemId: string;
  // The quantity of the selected item
  quantity: number;
  // The id of the selected node, is selected from the crafting tree
  nodeId?: string;
  // The original item id from the node
  nodeOriginalId?: string;
  // The current state of the selected material
  state: "TODO" | "DONE";
};

type SelectedMaterialStore = {
  items: Record<string, Item[]>;
  addAnItem: (itemIdKey: string, value: Item) => void;
  markAsDone: (itemIdKey: string, id: string) => void;
  removeAnItemByNodeId: (itemIdKey: string, nodeId: string) => void;
  markAsDoneByNodeId: (itemIdKey: string, nodeId: string) => void;
  markAsTodoByNodeId: (itemIdKey: string, nodeId: string) => void;
  clearMarkedMaterials: (itemIdKey: string) => void;
  resetAllToTodo: (itemIdKey: string) => void;
};

export const useSelectedMaterial = create<SelectedMaterialStore>()(
  persist(
    (set, get) => ({
      items: {},
      addAnItem: (itemIdKey: string, value: Item) =>
        set({
          items: {
            ...get().items,
            [itemIdKey]: [value, ...(get().items[itemIdKey] || [])],
          },
        }),
      markAsDone: (itemIdKey: string, id: string) =>
        set({
          items: {
            ...get().items,
            [itemIdKey]: (get().items[itemIdKey] || []).map((item) =>
              item.id === id ? { ...item, state: "DONE" } : item,
            ),
          },
        }),
      removeAnItemByNodeId: (itemIdKey: string, nodeId: string) =>
        set({
          items: {
            ...get().items,
            [itemIdKey]: (get().items[itemIdKey] || []).filter(
              (item) => item.nodeId !== nodeId,
            ),
          },
        }),
      markAsDoneByNodeId: (itemIdKey: string, nodeId: string) =>
        set({
          items: {
            ...get().items,
            [itemIdKey]: (get().items[itemIdKey] || []).map((item) =>
              item.nodeId === nodeId ? { ...item, state: "DONE" } : item,
            ),
          },
        }),
      markAsTodoByNodeId: (itemIdKey: string, nodeId: string) =>
        set({
          items: {
            ...get().items,
            [itemIdKey]: (get().items[itemIdKey] || []).map((item) =>
              item.nodeId === nodeId ? { ...item, state: "TODO" } : item,
            ),
          },
        }),
      clearMarkedMaterials: (itemIdKey: string) =>
        set((state) => {
          const { [itemIdKey]: _, ...rest } = state.items;
          return { items: rest };
        }),
      resetAllToTodo: (itemIdKey: string) =>
        set({
          items: {
            ...get().items,
            [itemIdKey]: (get().items[itemIdKey] || []).map((item) => ({
              ...item,
              state: "TODO",
            })),
          },
        }),
    }),
    {
      name: "selected-recipe-material",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
