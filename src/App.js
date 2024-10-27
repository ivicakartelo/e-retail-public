import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DepartmentsList from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import { ArticlesList } from './features/articles/ArticlesList';
import './App.css';

const HomePage = () => {
    return (
        <Router>
            <div className="public-container">
                {/* Simple navigation bar for tab selection */}
                <nav className="navbar">
                    <ul>
                        <li>
                            <a href="/">Departments</a>
                        </li>
                        <li>
                            <a href="/categories">Categories</a>
                        </li>
                        <li>
                            <a href="/articles">Articles</a>
                        </li>
                    </ul>
                </nav>
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<DepartmentsList />} />
                        <Route path="/categories/:departmentId" element={<CategoriesList />} />
                        <Route path="/articles/:categoryId" element={<ArticlesList />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default HomePage;