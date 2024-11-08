// src/features/categoryArticles/categoryArticlesSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch articles by category ID
export const fetchArticlesByCategory = createAsyncThunk(
    'categoryArticles/fetchArticlesByCategory',
    async (categoryId) => {
        const response = await axios.get(`http://localhost:5000/categories/${categoryId}/articles`);
        return response.data.articles;
    }
);

const categoryArticlesSlice = createSlice({
    name: 'categoryArticles',
    initialState: {
        articles: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchArticlesByCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchArticlesByCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.articles = action.payload;
            })
            .addCase(fetchArticlesByCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default categoryArticlesSlice.reducer;