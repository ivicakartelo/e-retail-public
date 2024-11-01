// src/index.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';
import { ArticlesList } from './features/articles/ArticlesList';
import DepartmentDetails from './features/departments/DepartmentDetails';
import CategoryArticles from './features/articles/CategoryArticles';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<ArticlesList />} />
          <Route path="department/:departmentId" element={<DepartmentDetails />} />
          <Route path="department/:departmentId/category/:categoryId" element={<CategoryArticles />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);