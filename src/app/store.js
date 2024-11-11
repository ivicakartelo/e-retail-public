// store.js or wherever your Redux store is configured
import { configureStore } from '@reduxjs/toolkit';
import departmentsReducer from '../features/departments/departmentsSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import articlesReducer from '../features/articles/articlesSlice';
import departmentCategoriesReducer from '../features/categories/departmentCategoriesSlice';
import categoryArticlesReducer from '../features/articles/categoryArticlesSlice';
import articleSingleReducer from '../features/articles/articleSingleSlice';

const store = configureStore({
  reducer: {
    departments: departmentsReducer,
    categories: categoriesReducer,
    articles: articlesReducer,
    departmentCategories: departmentCategoriesReducer, 
    categoryArticles: categoryArticlesReducer,
    articleSingle: articleSingleReducer
  },
});

export default store;