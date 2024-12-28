import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Item {
  id: string;
  name: string;
  quantity: number;
}

type ItemsState = Item[];
const initialState: ItemsState = [];

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<ItemsState>) => {
      return action.payload;
    },
    addItem: (state, action: PayloadAction<Item>) => {
      state.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<Item>) => {
      const index = state.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteItem: (state, action: PayloadAction<string>) =>
      state.filter((item) => item.id !== action.payload),
  },
});

export const { setItems, addItem, updateItem, deleteItem } = itemsSlice.actions;
export default itemsSlice.reducer;
