import { configureStore } from "@reduxjs/toolkit";
import recipesReducer from "./recipeSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
