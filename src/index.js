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
import Basket from './features/basket/Basket';
import SearchResults from './components/SearchResults';
import { AddUserForm } from './features/users/AddUserForm';
import Dashboard from './components/Dashboard'; // Your dashboard or home component
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Customer from './components/Customer';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<ArticlesList />} />
                    <Route path="department/:departmentId" element={<ArticlesList />} />
                    <Route path="department/:departmentId/category/:categoryId" element={<CategoryArticles />} />
                    <Route path="department/:departmentId/category/:categoryId/article/:articleId" element={<ArticleSingle />} />
                    <Route path="article/:articleId" element={<ArticleSingle />} />
                    <Route path="category/:categoryId" element={<CategoryArticles />} />
                    <Route path="/basket" element={<Basket />} /> {/* Basket route */}
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/registration" element={<AddUserForm />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
                    <Route path="/customer" element={<PrivateRoute><Customer /></PrivateRoute>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </Provider>
);