import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import DepartmentDetails from './features/departments/DepartmentDetails';
import Header from './components/Header'; // Import the Header component
import './App.css';

const App = () => {
    const { departmentId } = useParams();

    return (
        <div className="app-layout">
            <Header /> {/* Add the Header here */}
            <header>
                <DepartmentsList />
            </header>

            <div className="content-wrapper">
                <aside className="sidebar">
                    {departmentId ? (
                        <DepartmentDetails departmentId={departmentId} />
                    ) : (
                        <CategoriesList departmentId={departmentId} />
                    )}
                </aside>

                <main className="content">
                    <Outlet /> {/* No need for <Elements> here */}
                </main>
            </div>
        </div>
    );
};

export default App;