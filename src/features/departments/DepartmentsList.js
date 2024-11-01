import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDepartments } from './departmentsSlice';
import { Link } from 'react-router-dom';
import './DepartmentsList.css';

const DepartmentExcerpt = ({ department }) => (
    <div className="department-card">
        <Link to={`/department/${department.department_id}`}>{department.name}</Link>
    </div>
);

export const DepartmentsList = () => {
    const dispatch = useDispatch();
    const departments = useSelector((state) => state.departments.departments);
    const status = useSelector((state) => state.departments.status);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDepartments());
        }
    }, [status, dispatch]);

    return (
        <section className="departments-list-container">
            <h2>Departments</h2>
            <div className="departments-list-horizontal">
                {departments.map((department) => (
                    <DepartmentExcerpt key={department.department_id} department={department} />
                ))}
            </div>
        </section>
    );
};