import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Recipe {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: {key:string; value: string}[];
  total_time?: string;
  utensils?: string;  
  difficulty?: string;
}

type RecipesState = Recipe[];

const initialState: RecipesState = [];

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<RecipesState>) => {
      return action.payload;
    },

    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.push(action.payload);
    },

    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.findIndex(
        (recipe) => recipe._id === action.payload._id
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteRecipe: (state, action: PayloadAction<string>) => {
      return state.filter((recipe) => recipe._id !== action.payload);
    },
  },
});

export const { setRecipes, addRecipe, updateRecipe, deleteRecipe } =
  recipeSlice.actions;
export default recipeSlice.reducer;
