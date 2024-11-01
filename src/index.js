// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';
import { ArticlesList } from './features/articles/ArticlesList';
import DepartmentDetails from './features/departments/DepartmentDetails';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<ArticlesList />} />  {/* Always display ArticlesList */}
                    <Route path="department/:departmentId" element={<DepartmentDetails />} />  {/* Show DepartmentDetails in sidebar */}
                </Route>
            </Routes>
        </BrowserRouter>
    </Provider>
);