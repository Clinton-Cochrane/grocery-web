import { Ingredient } from '@/models/recipe';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartItem = {
	title?: string;
	recipeId: string;
	quantity: number;
	ingredients?: Ingredient[];
};

type CartState = CartItem[]; // Array of recipe IDs

const initialState: CartState = [];

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addRecipeToCart: (state, action: PayloadAction<{ recipeId: string; ingredient?: Ingredient; quantity?: number }>) => {
			const { recipeId, ingredient, quantity = 1 } = action.payload;

			console.log('Action Payload:', action.payload); // Debug the payload
			console.log('State before update:', JSON.stringify(state, null, 2)); // Log current state

			if (recipeId === 'extras' && ingredient) {
				let extras = state.find((item) => item.recipeId === 'extras');
				if (!extras) {
					extras = {
						recipeId: 'extras',
						title: 'Extras',
						ingredients: [],
						quantity: 1,
					};
					state.push(extras);
				}
				const existingIngredient = extras.ingredients?.find((item) => item.name === ingredient.name);
				if (existingIngredient) {
					existingIngredient.quantity += quantity;
				} else {
					extras.ingredients?.push(ingredient);
				}
			} else {
				const existingItem = state.find((item) => item.recipeId === recipeId);
				existingItem ? (existingItem.quantity += quantity) : state.push({ recipeId, quantity });
			}
		},
		updateRecipeQuantity: (state, action: PayloadAction<{ recipeId: string; quantity: number }>) => {
			const { recipeId, quantity } = action.payload;
			const existingItem = state.find((item) => item.recipeId === recipeId);

			existingItem && (existingItem.quantity = quantity);
		},
		removeRecipeFromCart: (state, action: PayloadAction<string>) => {
			return state.filter((item) => item.recipeId !== action.payload);
		},
		removeExtraIngredient: (state, action: PayloadAction<string>) => {
			const extras = state.find((item) => item.recipeId === 'extras');
			if (extras && extras.ingredients) {
				extras.ingredients = extras.ingredients.filter((item) => item.name !== action.payload);
			}
		},
		updateExtraIngredientQuantity: (state, action: PayloadAction<{ name: string; quantity: number }>) => {
			const extras = state.find((item) => item.recipeId === 'extras');
			if (extras && extras.ingredients) {
				const ingredient = extras.ingredients.find((item) => item.name === action.payload.name);
				if (ingredient) {
					ingredient.quantity += action.payload.quantity;
				}
			}
		},
		clearCart: () => {
			return [];
		},
	},
});

export const { addRecipeToCart, updateRecipeQuantity, removeRecipeFromCart, clearCart,removeExtraIngredient, updateExtraIngredientQuantity } = cartSlice.actions;
export default cartSlice.reducer;
