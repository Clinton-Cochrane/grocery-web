import { Recipe } from '@/models/recipe';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RecipesState {
	recipes: Recipe[];
}

const initialState: RecipesState = {
	recipes: [],
};

const recipeSlice = createSlice({
	name: 'recipes',
	initialState,
	reducers: {
		setRecipes: (state, action: PayloadAction<Recipe[]>) => {
			state.recipes = action.payload;
		},
		addRecipe: (state, action: PayloadAction<Recipe>) => {
			state.recipes.push(action.payload);
		},
		updateRecipe: (state, action: PayloadAction<Recipe>) => {
			const index = state.recipes.findIndex((recipe) => recipe._id === action.payload._id);
			if (index !== -1) {
				state.recipes[index] = action.payload;
			}
		},
		deleteRecipe: (state, action: PayloadAction<string>) => {
			state.recipes = state.recipes.filter((recipe) => recipe._id !== action.payload);
		},
	},
});

export const { setRecipes, addRecipe, updateRecipe, deleteRecipe } = recipeSlice.actions;
export default recipeSlice.reducer;
