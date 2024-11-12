// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';
import { ArticlesList } from './features/articles/ArticlesList';
import CategoryArticles from './features/articles/CategoryArticles';
import ArticleSingle from './features/articles/ArticleSingle';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<ArticlesList />} /> {/* Default view */}
                    
                    {/* Main department view that includes articles and department details */}
                    <Route path="department/:departmentId" element={<ArticlesList />} />
                    
                    {/* Route for category articles within a department */}
                    <Route path="department/:departmentId/category/:categoryId" element={<CategoryArticles />} />
                    
                    {/* Route for a single article, using department and category in the path */}
                    <Route path="department/:departmentId/category/:categoryId/article/:articleId" element={<ArticleSingle />} />

                    {/* Standalone route for viewing articles without department context */}
                    <Route path="article/:articleId" element={<ArticleSingle />} />
                    
                    {/* Standalone route for viewing categories without department context */}
                    <Route path="category/:categoryId" element={<CategoryArticles />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </Provider>
);