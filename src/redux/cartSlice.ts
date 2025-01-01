import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartState = string[]; // Array of recipe IDs

const initialState: CartState = [];

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addRecipeToCart: (state, action: PayloadAction<string>) => {
			if (!state.includes(action.payload)) {
				state.push(action.payload);
			}
		},
		removeRecipeFromCart: (state, action: PayloadAction<string>) => {
			return state.filter((id) => id !== action.payload);
		},
		clearCart: () => {
			return [];
		},
	},
});

export const { addRecipeToCart, removeRecipeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
