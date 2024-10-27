// store.js or wherever your Redux store is configured
import { configureStore } from '@reduxjs/toolkit';
import departmentsReducer from '../features/departments/departmentsSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import departmentCategoriesReducer from '../features/departments/departmentCategoriesSlice'; // New import
//import articlesReducer from '../features/articles/articlesSlice';

const store = configureStore({
  reducer: {
    departments: departmentsReducer,
    categories: categoriesReducer,
    departmentCategories: departmentCategoriesReducer, // New reducer
  },
});

export default store;