import React, { useEffect } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { DepartmentsList } from './features/departments/DepartmentsList';
import DepartmentDetails from './features/departments/DepartmentDetails';
import Header from './components/Header';
import { fetchDepartments } from './features/departments/departmentsSlice';
import './App.css';

const App = () => {
  const { departmentId, categoryId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const departments = useSelector((state) => state.departments.departments);
  const departmentsStatus = useSelector((state) => state.departments.status);

  useEffect(() => {
    if (departmentsStatus === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [departmentsStatus, dispatch]);

  const department = departments.find(
    (d) => String(d.department_id) === String(departmentId)
  );

  const isArticlePage = /^\/article\/\d+$/.test(location.pathname);
  const isHomePage = !departmentId && !categoryId && !isArticlePage;
  const isDepartmentPage = departmentId && !categoryId;
  const isCategoryPage = departmentId && categoryId;

  const getBannerFilename = (name) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const departmentBannerName = department
    ? getBannerFilename(department.name)
    : null;

  const bannerPath = departmentBannerName
    ? `/assets/e_retail_public/catalog/${departmentBannerName}-banner.png`
    : null;

  const fallbackBanner = `/assets/e_retail_public/catalog/default-banner.png`;

  return (
    <div className="app-layout">
      <Header />

      <nav className="departments-nav">
        <DepartmentsList />
      </nav>

      {isDepartmentPage && (
        <div className="department-details-bar">
          <DepartmentDetails departmentId={departmentId} />
        </div>
      )}

      {departmentId && (
        <nav className="categories-nav">
          {/* Example placeholder */}
        </nav>
      )}

      {!isArticlePage && (
        <>
          {isHomePage && (
            <div className="home-banner">
              <h1>Welcome to Our Store</h1>
              <p>Explore departments and categories to find what you need.</p>
            </div>
          )}

          {isDepartmentPage && department && (
            <div className="department-banner">
              
              <img
                src={bannerPath}
                onError={(e) => {
                  e.target.src = fallbackBanner;
                }}
                alt={`${department.name} banner`}
              />
              
              <div className="department-banner-text">
                <h2>Department: {department.name}</h2>
                <p>Browse categories in this department.</p>
              </div>
              
            </div>
          )}

          {isDepartmentPage && !department && departmentsStatus === 'succeeded' && (
            <div className="department-banner">
              <p>Department not found.</p>
            </div>
          )}

          {isCategoryPage && (
            <div className="category-banner">
              <h2>Category: {categoryId}</h2>
              <p>You're viewing products in this category.</p>
            </div>
          )}
        </>
      )}

      <div className="content-wrapper">
        <main className="content full-width">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default App;