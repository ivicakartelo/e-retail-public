import React from 'react';
import { Link, Outlet } from 'react-router-dom'
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
//import { ArticlesList } from './features/articles/ArticlesList';
import './App.css';

const App = () => {
    return (
        <div className="app-container">
            <div className="departments-list">
                <DepartmentsList />
            </div>
            <div className="main-content">
                <div className="categories-list">
                    <CategoriesList />
                </div>
                <div className="articles-list">
                <Outlet />
                </div>
            </div>
        </div>  
    );
};

export default App;