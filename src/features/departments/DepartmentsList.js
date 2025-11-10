// src/features/departments/DepartmentsList.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './DepartmentsList.css';

const DepartmentExcerpt = ({ department }) => (
    <div className="department-card">
        <Link to={`/department/${department.department_id}`}>{department.name}</Link>
    </div>
);

export const DepartmentsList = React.memo(() => {
    console.log("DepartmentsList render");

    // Read departments from Redux state (App already fetched them)
    const departments = useSelector((state) => state.departments.departments);

    return (
        <section className="departments-list">
            <h2>Departments</h2>
            <div className="departments-container">
                {departments.map((department) => (
                    <DepartmentExcerpt
                        key={department.department_id}
                        department={department}
                    />
                ))}
            </div>
        </section>
    );
});