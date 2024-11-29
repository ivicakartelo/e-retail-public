import { createSlice } from '@reduxjs/toolkit';

const basketSlice = createSlice({
  name: 'basket',
  initialState: {
    items: [], // Each item has { article_id, name, price, quantity, ... }
  },
  reducers: {
    addToBasket: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.article_id === action.payload.article_id
      );

      if (existingItem) {
        existingItem.quantity += 1; // Increment quantity if item exists
      } else {
        state.items.push({ ...action.payload, quantity: 1 }); // Add new item
      }
    },
    removeItem: (state, action) => {
      if (!action.payload || !action.payload.article_id) {
        console.error('Invalid payload in removeItem:', action.payload);
        return; // Skip processing if payload is invalid
      }
    
      const index = state.items.findIndex(
        (item) => item.article_id === action.payload.article_id
      );
    
      if (index !== -1) {
        state.items.splice(index, 1); // Remove the item from the basket
      }
    },
    clearBasket: (state) => {
      state.items = []; // Clear all items from the basket
    },
  },
});

export const { addToBasket, removeItem, clearBasket } = basketSlice.actions;
export default basketSlice.reducer;