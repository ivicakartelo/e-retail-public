// src/features/departments/DepartmentDetails.js

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategoriesByDepartment } from '../categories/categoriesSlice';

const DepartmentDetails = ({ departmentId }) => {
    const dispatch = useDispatch();

    // Fetch categories for this department
    const categories = useSelector((state) => state.departmentCategories.categories);
    const categoriesStatus = useSelector((state) => state.departmentCategories.status);
    const error = useSelector((state) => state.departmentCategories.error);

    useEffect(() => {
        if (categoriesStatus === 'idle' || departmentId) {
            dispatch(fetchCategoriesByDepartment(departmentId));
        }
    }, [categoriesStatus, dispatch, departmentId]);

    if (categoriesStatus === 'loading') {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Department {departmentId} Categories</h2>
            <ul>
                {categories.map((category) => (
                    <li key={category.category_id}>
                        <Link to={`/department/${departmentId}/category/${category.category_id}`}>
                            {category.category_name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DepartmentDetails;