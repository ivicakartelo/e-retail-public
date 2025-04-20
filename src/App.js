import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { DepartmentsList } from './features/departments/DepartmentsList';
import DepartmentDetails from './features/departments/DepartmentDetails';
import Header from './components/Header';
import './App.css';

const App = () => {
    const { departmentId, categoryId } = useParams();

    const shouldShowSidebar = departmentId && !categoryId;

    return (
        <div className="app-layout">
            <Header />

            <header>
                <DepartmentsList />
            </header>

            <div className="content-wrapper">
            {shouldShowSidebar && (
    <aside className="sidebar">
        <DepartmentDetails departmentId={departmentId} />
    </aside>
)}

                <main className={`content ${shouldShowSidebar ? '' : 'full-width'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default App;