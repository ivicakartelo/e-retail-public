// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';
import { ArticlesList } from './features/articles/ArticlesList';
import CategoryArticles from './features/articles/CategoryArticles';
import DepartmentDetails from './features/departments/DepartmentDetails';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<ArticlesList />} /> {/* Main content */}
                    
                    {/* Route for when departmentId is available */}
                    <Route path="department/:departmentId" element={<ArticlesList />} />

                    {/* Route for when categoryId is available 
                    <Route path="category/:categoryId" element={<DepartmentDetails />} />
                    */}
                    {/* Route for when only categoryId is present (if needed) */}
                    <Route path="category/:categoryId" element={<CategoryArticles />} />
                    
                    </Route>
            </Routes>
        </BrowserRouter>
    </Provider>
);