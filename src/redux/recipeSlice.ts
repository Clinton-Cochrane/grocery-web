import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Recipe {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: { key: string; value: string }[];
  total_time?: string;
  utensils?: string;
  difficulty?: string;
}

export interface RecipesState {
  recipes: Recipe[];
}

// Initial state matches `RecipesState` structure
const initialState: RecipesState = {
  recipes: [],
};

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    // Set all recipes (replaces the current list)
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
    },

    // Add a new recipe
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes.push(action.payload);
    },

    // Update an existing recipe
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.recipes.findIndex(
        (recipe) => recipe._id === action.payload._id
      );
      if (index !== -1) {
        state.recipes[index] = action.payload;
      }
    },

    // Delete a recipe by ID
    deleteRecipe: (state, action: PayloadAction<string>) => {
      state.recipes = state.recipes.filter(
        (recipe) => recipe._id !== action.payload
      );
    },
  },
});

export const { setRecipes, addRecipe, updateRecipe, deleteRecipe } =
  recipeSlice.actions;
export default recipeSlice.reducer;
