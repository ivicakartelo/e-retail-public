import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import DepartmentDetails from './features/departments/DepartmentDetails';
import './App.css';

const App = () => {
    const { departmentId, categoryId } = useParams(); // Retrieve both departmentId and categoryId

    return (
        <div className="app-layout">
            <header>
                <DepartmentsList /> {/* Horizontal display at the top */}
            </header>
            <div className="content-wrapper">
                <aside className="sidebar">
                    {/* Render DepartmentDetails if a department or category is selected, else render CategoriesList */}
                    {departmentId || categoryId ? (
                        <MemoizedDepartmentDetails departmentId={departmentId} />
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

// Use React.memo to avoid re-rendering DepartmentDetails unless departmentId changes
const MemoizedDepartmentDetails = React.memo(DepartmentDetails, (prevProps, nextProps) => {
    return prevProps.departmentId === nextProps.departmentId;
});

export default App;