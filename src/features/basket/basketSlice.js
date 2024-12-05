import { createSlice } from '@reduxjs/toolkit';

const basketSlice = createSlice({
  name: 'basket',
  initialState: {
    articles: [], // Each article has { article_id, name, price, quantity, ... }
  },
  reducers: {
    addToBasket: (state, action) => {
      const existingArticle = state.articles.find(
        (article) => article.article_id === action.payload.article_id
      );

      if (existingArticle) {
        existingArticle.quantity += 1; // Increment quantity if article exists
      } else {
        state.articles.push({ ...action.payload, quantity: 1 }); // Add new article
      }
    },
    removeArticle: (state, action) => {
      if (!action.payload || !action.payload.article_id) {
        console.error('Invalid payload in removeArticle:', action.payload);
        return; // Skip processing if payload is invalid
      }
    
      const { article_id, decrementOnly } = action.payload;
      const existingArticle = state.articles.find(
        (article) => article.article_id === article_id
      );
    
      if (existingArticle) {
        if (decrementOnly && existingArticle.quantity > 1) {
          existingArticle.quantity -= 1; // Decrement quantity if greater than 1
        } else {
          // Remove the article if decrementOnly is false or quantity becomes 0
          state.articles = state.articles.filter(
            (article) => article.article_id !== article_id
          );
        }
      }
    },
    clearBasket: (state) => {
      state.articles = []; // Clear all articles from the basket
    },
  },
});

export const { addToBasket, removeArticle, clearBasket } = basketSlice.actions;
export default basketSlice.reducer;