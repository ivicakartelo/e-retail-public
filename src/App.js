// src/App.js
import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import DepartmentDetails from './features/departments/DepartmentDetails';
import './App.css';
import store from './app/store';

const App = () => {
    const { departmentId } = useParams();

    console.log("Initial Redux state:", store.getState().articleSingle);

    return (
        <div className="app-layout">
            <header>
                <DepartmentsList /> {/* Horizontal display at the top */}
            </header>
            <div className="content-wrapper">
                <aside className="sidebar">
                    {/* Conditionally render DepartmentDetails or CategoriesList based on departmentId */}
                    {departmentId ? (
                        <DepartmentDetails departmentId={departmentId} />
                    ) : (
                        <CategoriesList />
                    )}
                </aside>
                <main className="content">
                    <Outlet /> {/* Allows nested routes to render here */}
                </main>
            </div>
        </div>
    );
};

export default App;