import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartState = Set<string>;

const initialState: CartState = new Set();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addRecipeToCart: (state, action: PayloadAction<string>) => {
      state.add(action.payload);
    },
    removeRecipeFromCart: (state, action: PayloadAction<string>) => {
      state.delete(action.payload);
    },
    clearCart: (state) => {
      state.clear();
    },
  },
});

export const { addRecipeToCart, removeRecipeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
