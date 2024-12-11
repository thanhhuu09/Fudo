import { MenuItem } from "@/types";
import { create } from "zustand";

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  _id: string;
}

interface CartState {
  items: CartItem[];
  addItems: (item: CartItem) => void;
  removeItems: (id: string) => void;
  updateItems: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],

  addItems: (item: CartItem) =>
    set((state) => ({ items: [...state.items, item] })),

  removeItems: (id: string) =>
    set((state) => ({ items: state.items.filter((item) => item._id !== id) })),

  updateItems: (id: string, quantity: number) =>
    set((state) => ({
      items: state.items.map((item) =>
        item._id === id ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set({ items: [] }),
}));
