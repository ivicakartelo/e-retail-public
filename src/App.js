// src/App.js
import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import DepartmentDetails from './features/departments/DepartmentDetails';
import './App.css';
import store from './app/store'; // Adjust path as necessary

const App = () => {
    const { departmentId, categoryId } = useParams(); // Get departmentId and categoryId from URL params
    // App.js or main component where store is used

console.log("Initial Redux state:", store.getState().articleSingle); // This should log the initial state of articleSingle
    
return (
        <div className="app-layout">
            <header>
                <DepartmentsList /> {/* Horizontal display at the top */}
            </header>
            <div className="content-wrapper">
                <aside className="sidebar">
                    {/* Always render DepartmentDetails as long as departmentId is present */}
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