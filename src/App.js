import React from 'react';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import { ArticlesList } from './features/articles/ArticlesList';
import './App.css';

const HomePage = () => {
    return (
        <div className="homepage-container">
            {/* Horizontal top section for DepartmentsList */}
            <div className="departments-section">
                <DepartmentsList />
            </div>

            {/* Main content area with vertical left and right sections */}
            <div className="main-content">
                <div className="categories-section">
                    <CategoriesList />
                </div>
                <div className="articles-section">
                    <ArticlesList />
                </div>
            </div>
        </div>
    );
};

export default HomePage;