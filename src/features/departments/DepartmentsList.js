// DepartmentsList.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDepartments } from './departmentsSlice';
import { Link } from 'react-router-dom';
import './DepartmentsList.css';

const DepartmentExcerpt = ({ department }) => (
  <div className="department-card">
    <h3>
      <Link to={`/departments/${department.department_id}`}>
        {department.name}
      </Link>
    </h3>
  </div>
);

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
      <DepartmentExcerpt key={department.department_id} department={department} />
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
