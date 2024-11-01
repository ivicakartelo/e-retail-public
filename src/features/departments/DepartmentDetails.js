import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoriesByDepartment } from '../categories/categoriesSlice';

const DepartmentDetails = () => {
    const { departmentId } = useParams();
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.departmentCategories.categories);
    const status = useSelector((state) => state.departmentCategories.status);

    useEffect(() => {
        dispatch(fetchCategoriesByDepartment(departmentId));
    }, [departmentId, dispatch]);

    return (
        <div>
            <h2>Categories for Department {departmentId}</h2>
            {status === 'loading' && <p>Loading categories...</p>}
            {status === 'failed' && <p>Failed to load categories.</p>}
            {status === 'succeeded' && (
                <ul>
                    {categories.map((category) => (
                        <li key={category.category_id}>
                            <Link to={`/category/${category.category_id}`}>
                                {category.category_name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DepartmentDetails;