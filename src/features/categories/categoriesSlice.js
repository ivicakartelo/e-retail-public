// src/features/categories/categoriesSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await axios.get('http://localhost:5000/categories');
  return response.data;
});

export const fetchCategoriesByDepartment = createAsyncThunk(
    'departmentCategories/fetchCategoriesByDepartment',
    async (departmentId) => {
        const response = await axios.get(`http://localhost:5000/departments/${departmentId}/categories`);
        console.log('API response:', response.data.categories);
        return response.data.categories;
    }
);

const categoriesSlice = createSlice({
    name: 'departmentCategories',
    initialState: {
        categories: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoriesByDepartment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategoriesByDepartment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(fetchCategoriesByDepartment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchCategories.pending, (state) => {
              state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.error.message;
            });
    },
});

export default categoriesSlice.reducer;