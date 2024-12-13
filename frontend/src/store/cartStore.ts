import { fetchCart, updateCart } from "@/services/cartService";
import { create } from "zustand";
import useAuthStore from "./authStore";
import { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  fetchCarts: (userId: string) => void;
  addItem: (userId: string, menuItemId: string, quality: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  fetchCarts: async (userId) => {
    const accessToken = useAuthStore.getState().accessToken as string;
    console.log({ userId, accessToken });
    const response = await fetchCart(userId, accessToken);
    set({ items: response });
  },
  // this include add, update, delete
  addItem: async (userId: string, menuItemId: string, quality: number) => {
    const accessToken = useAuthStore.getState().accessToken as string;
    await updateCart(userId, accessToken, menuItemId, quality);
    get().fetchCarts(userId);
  },
  clearCart: () => set({ items: [] }),
  getTotalPrice: () =>
    // How reduce works: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
    get().items.reduce(
      (acc, item) => acc + item.menuItem.price * item.quantity,
      0
    ),
}));
