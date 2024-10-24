import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDepartments } from './departmentsSlice';
import './DepartmentsList.css';

export const DepartmentsList = () => {
    const dispatch = useDispatch();
    const departments = useSelector((state) => state.departments.departments);
    const status = useSelector((state) => state.departments.status);
    const error = useSelector((state) => state.departments.error);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDepartments());
        }
    }, [status, dispatch]);

    let content;

    if (status === 'loading') {
        content = <h2 className="loading-message">Loading departments...</h2>;
    } else if (status === 'succeeded') {
        content = departments.map((department) => (
            <div key={department.department_id} className="department-item">
                {department.name}
            </div>
        ));
    } else if (status === 'failed') {
        content = <div className="error-message">Error: {error}</div>;
    }

    return (
        <section className="departments-container">
            <h2>Departments</h2>
            <div className="departments-list">{content}</div>
        </section>
    );
};