import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartItem = {
	recipeId: string;
	quantity: number;
};

type CartState = CartItem[]; // Array of recipe IDs

const initialState: CartState = [];

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addRecipeToCart: (state, action: PayloadAction<{recipeId: string; quantity?: number}>) => {
			const {recipeId, quantity = 1 } = action.payload;
			const existingItem = state.find((item) => item.recipeId === recipeId);
			if (existingItem) {
				existingItem.quantity += quantity;
			} else {
				state.push({recipeId, quantity})
			}
		},
		updateRecipeQuantity: (state, action: PayloadAction<{recipeId: string; quantity: number}>) => {
			const {recipeId, quantity} = action.payload;
			const existingItem = state.find((item) => item.recipeId === recipeId);

			existingItem && (existingItem.quantity = quantity);
		},
		removeRecipeFromCart: (state, action: PayloadAction<string>) => {
			return state.filter((item) => item.recipeId !== action.payload);
		},
		clearCart: () => {
			return [];
		},
	},
});

export const { addRecipeToCart, updateRecipeQuantity, removeRecipeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
