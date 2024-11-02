// src/App.js

import React from 'react';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import DepartmentDetails from './features/departments/DepartmentDetails';
import { Outlet, useParams } from 'react-router-dom';
import './App.css';

const App = () => {
    const { departmentId } = useParams(); // Get departmentId from the URL

    return (
        <div className="app">
            <DepartmentsList /> {/* Horizontal list of departments */}

            <div className="content-wrapper">
                <div className="categories-wrapper">
                    {departmentId ? (
                        <DepartmentDetails departmentId={departmentId} /> // Display DepartmentDetails if departmentId exists
                    ) : (
                        <CategoriesList /> // Otherwise, display CategoriesList
                    )}
                </div>

                {/* Main content area to display nested route content like ArticlesList or CategoryArticles */}
                <div className="main-content">
                    <Outlet /> {/* Renders matched nested route component */}
                </div>
            </div>
        </div>
    );
};

export default App;