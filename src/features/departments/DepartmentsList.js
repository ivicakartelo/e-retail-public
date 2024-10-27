// DepartmentsList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from './departmentsSlice'; // Adjust the path as necessary
import { fetchCategoriesByDepartment } from './departmentCategoriesSlice'; // New import

const DepartmentsList = () => {
  const dispatch = useDispatch();
  const { departments, status } = useSelector((state) => state.departments);
  const { categories } = useSelector((state) => state.departmentCategories); // New state slice for categories

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [status, dispatch]);

  const handleDepartmentClick = (departmentId) => {
    dispatch(fetchCategoriesByDepartment(departmentId));
  };

  return (
    <div>
      <h1>Departments</h1>
      <ul>
        {departments.map((department) => (
          <li key={department.department_id}>
            <a href="#" onClick={() => handleDepartmentClick(department.department_id)}>
              {department.name}
            </a>
          </li>
        ))}
      </ul>

      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.category_id}>{category.category_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentsList;