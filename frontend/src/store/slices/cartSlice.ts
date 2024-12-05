import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageURL: string;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newProduct = action.payload;
      const existingProduct = state.items.find(
        (item) => item.id === newProduct.id
      );

      if (!existingProduct) {
        state.items.push({
          id: newProduct.id,
          name: newProduct.name,
          price: newProduct.price,
          quantity: 1,
          imageURL: newProduct.imageURL,
        });
      } else {
        existingProduct.quantity++;
      }
      state.totalQuantity++;
      state.totalPrice += newProduct.price;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const product = state.items.find((item) => item.id === productId);

      if (product) {
        product.quantity++;
        state.totalQuantity++;
        state.totalPrice += product.price;
      }
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const product = state.items.find((item) => item.id === productId);

      if (product && product.quantity > 1) {
        product.quantity -= 1;
        state.totalQuantity -= 1;
        state.totalPrice -= product.price;
      } else if (product && product.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== productId);
        state.totalQuantity -= 1;
        state.totalPrice -= product.price;
      }
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.totalQuantity = action.payload.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      state.totalPrice = action.payload.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  setCart,
} = cartSlice.actions;
export default cartSlice.reducer;
