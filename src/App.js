// src/App.js

import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import DepartmentDetails from './features/departments/DepartmentDetails';
import './App.css';

const App = () => {
    const { departmentId } = useParams();

    return (
        <div className="app-layout">
            <header>
                <DepartmentsList />
            </header>
            <div className="content-wrapper">
                <aside className="sidebar">
                    {departmentId ? (
                        <DepartmentDetails departmentId={departmentId} />
                    ) : (
                        <CategoriesList departmentId={departmentId} />  // Removed the comment here
                    )}
                </aside>
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default App;