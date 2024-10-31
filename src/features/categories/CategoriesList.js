import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from './categoriesSlice';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './CategoriesList.css';

const CategoryExcerpt = ({ category }) => (
  <div className="category-card">
    <h3>
      <Link to={`/categories/${category.category_id}`}>{category.name}</Link> {/* Link to the specific category */}
    </h3>
  </div>
);

export const CategoriesList = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const status = useSelector((state) => state.categories.status);
  const error = useSelector((state) => state.categories.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  let content;

  if (status === 'loading') {
    content = <h2 className="loading-message">Loading categories...</h2>;
  } else if (status === 'succeeded') {
    content = categories.map((category) => (
      <CategoryExcerpt key={category.category_id} category={category} />
    ));
  } else if (status === 'failed') {
    content = <div className="error-message">Error: {error}</div>;
  }

  return (
    <section className="categories-list-container">
      <h2>Categories</h2>
      <div className="categories-list">{content}</div>
    </section>
  );
};