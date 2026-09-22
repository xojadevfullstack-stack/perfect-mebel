"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface SelectionItem {
  id: string;
  slug: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  images: string[];
  categoryName?: string;
  stockStatus: "IN_STOCK" | "MADE_TO_ORDER";
  dimensions?: string | null;
  material?: string | null;
}

interface SelectionsState {
  items: SelectionItem[];
  addItem: (item: SelectionItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: SelectionItem) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
}

export const useSelectionsStore = create<SelectionsState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { items, isSelected } = get();
        if (!isSelected(item.id)) {
          set({ items: [...items, item] });
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleItem: (item) => {
        const { items, isSelected } = get();
        if (isSelected(item.id)) {
          set({ items: items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...items, item] });
        }
      },

      clearAll: () => {
        set({ items: [] });
      },

      isSelected: (id) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: "mebel-salon-selections",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
