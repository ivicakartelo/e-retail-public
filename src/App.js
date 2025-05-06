import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { DepartmentsList } from './features/departments/DepartmentsList';
import DepartmentDetails from './features/departments/DepartmentDetails';
import Header from './components/Header';
import './App.css';

const App = () => {
  const { departmentId, categoryId } = useParams();

  const isHomePage = !departmentId && !categoryId;
  const isDepartmentPage = departmentId && !categoryId;
  const isCategoryPage = departmentId && categoryId;

  return (
    <div className="app-layout">
      <Header />

      {/* Main Department Navigation */}
      <nav className="departments-nav">
        <DepartmentsList />
      </nav>

      {/* Department Details shown below the navigation */}
      {isDepartmentPage && (
        <div className="department-details-bar">
          <DepartmentDetails departmentId={departmentId} />
        </div>
      )}

      {/* Category Navigation */}
      {departmentId && (
        <nav className="categories-nav">
          {/* Example placeholder */}
        </nav>
      )}

      {/* Banners */}
      {isHomePage && (
        <div className="home-banner">
          <h1>Welcome to Our Store</h1>
          <p>Explore departments and categories to find what you need.</p>
        </div>
      )}

      {isDepartmentPage && (
        <div className="department-banner">
          <h2>Department: {departmentId}</h2>
          <p>Browse categories in this department.</p>
        </div>
      )}

      {isCategoryPage && (
        <div className="category-banner">
          <h2>Category: {categoryId}</h2>
          <p>You're viewing products in this category.</p>
        </div>
      )}

      {/* Main Content */}
      <div className="content-wrapper">
        <main className="content full-width">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default App;