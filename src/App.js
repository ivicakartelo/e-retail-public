// src/App.js
import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import DepartmentDetails from './features/departments/DepartmentDetails';
import './App.css';

const App = () => {
    const { departmentId } = useParams(); // Get departmentId from the URL to control sidebar content
    const categories = useSelector((state) => state.departmentCategories.categories); // Access categories from state

    return (
        <div className="app-layout">
            <header>
                <DepartmentsList /> {/* Horizontal display at the top */}
            </header>
            <aside className="sidebar">
                {/* Conditionally render DepartmentDetails or CategoriesList */}
                {departmentId ? <DepartmentDetails /> : categories.length > 0 && <CategoriesList />}
            </aside>
            <main className="content">
                <Outlet /> {/* Displays ArticlesList or other main content */}
            </main>
        </div>
    );
};

export default App;