import React from 'react';
import DepartmentsList from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import { ArticlesList } from './features/articles/ArticlesList';
import './App.css';

const HomePage = () => {
    return (
        <div>
            <DepartmentsList />
            <CategoriesList />
            <ArticlesList />
        </div>  
    );
};

export default HomePage;