import { fetchCart, updateCart } from "@/services/cartService";
import { create } from "zustand";
import useAuthStore from "./authStore";
import { Product } from "@/types";

interface CartState {
  items: Product[];
  isLoading: boolean;
  fetchCarts: (userId: string) => Promise<void>;
  addItem: (
    userId: string,
    menuItemId: string,
    quality: number
  ) => Promise<void>;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  isLoading: false,

  fetchCarts: async (userId) => {
    set({ isLoading: true }); // 🔥 Bắt đầu tải dữ liệu
    try {
      const accessToken = useAuthStore.getState().accessToken as string;
      console.log({ userId, accessToken });

      const response = await fetchCart(userId, accessToken);
      set({ items: response });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      set({ items: [] }); // 🔥 Nếu lỗi, set cart rỗng
    } finally {
      set({ isLoading: false }); // 🔥 Kết thúc tải
    }
  },

  addItem: async (userId, menuItemId, quality) => {
    set({ isLoading: true }); // 🔥 Đặt trạng thái loading trước khi gọi API
    try {
      const accessToken = useAuthStore.getState().accessToken as string;
      await updateCart(userId, accessToken, menuItemId, quality);
      await get().fetchCarts(userId); // 🔥 Sau khi cập nhật xong, fetch lại cart
    } finally {
      set({ isLoading: false }); // 🔥 Đảm bảo kết thúc loading
    }
  },

  clearCart: () => set({ items: [] }),

  getTotalPrice: () =>
    get().items.reduce(
      (acc, item) => acc + item.menuItem.price * item.quantity,
      0
    ),
}));
