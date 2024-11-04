import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import DepartmentDetails from './features/departments/DepartmentDetails';
import './App.css';

const App = () => {
    const { departmentId, categoryId } = useParams(); // Retrieve both departmentId and categoryId

    // State to persist the last valid departmentId
    const [currentDepartmentId, setCurrentDepartmentId] = useState(departmentId);

    // Update currentDepartmentId only if a new departmentId is provided
    useEffect(() => {
        if (departmentId) {
            setCurrentDepartmentId(departmentId);
        }
    }, [departmentId]);

    return (
        <div className="app-layout">
            <header>
                <DepartmentsList /> {/* Horizontal display at the top */}
            </header>
            <div className="content-wrapper">
                <aside className="sidebar">
                    {/* Render DepartmentDetails with the persisted currentDepartmentId */}
                    {currentDepartmentId ? (
                        <DepartmentDetails departmentId={currentDepartmentId} />
                    ) : (
                        <CategoriesList />
                    )}
                </aside>
                <main className="content">
                    <Outlet /> {/* Allows nested routes to render here if needed */}
                </main>
            </div>
        </div>
    );
};

export default App;