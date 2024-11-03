// src/App.js
import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { ArticlesList } from './features/articles/ArticlesList';
import CategoryArticles from './features/articles/CategoryArticles';
import { CategoriesList } from './features/categories/CategoriesList';
import DepartmentDetails from './features/departments/DepartmentDetails';
import './App.css';

const App = () => {
    const { departmentId } = useParams(); // Get departmentId to control sidebar content
    const { categoryId } = useParams(); // Get categoryId to control Outlet content

    return (
        <div className="app-layout">
            <header>
                <DepartmentsList /> {/* Horizontal display at the top */}
            </header>
            <div className="content-wrapper">
                <aside className="sidebar">
                    {/* Render DepartmentDetails if a department is selected, else render CategoriesList */}
                    {departmentId || categoryId ? <DepartmentDetails departmentId={departmentId} /> : <CategoriesList />}
                </aside>
                <main className="content">
                    {/* Render CategoryArticles if a category is selected, else render ArticlesList */}
                    {categoryId ? <CategoryArticles categoryId={categoryId} /> : <ArticlesList />}
                    <Outlet /> {/* Displays ArticlesList or other main content */}
                </main>
            </div>
        </div>
    );
};

export default App;