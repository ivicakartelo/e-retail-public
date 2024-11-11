// src/features/articles/CategoryArticles.js

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticlesByCategory } from './categoryArticlesSlice';

const CategoryArticles = () => {
  console.log("CategoryArticles render");
  
  // Get departmentId, categoryId, and articleId from the URL parameters
  const { departmentId, categoryId } = useParams();
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.categoryArticles.articles);
  const status = useSelector((state) => state.categoryArticles.status);

  useEffect(() => {
    // Dispatch action to fetch articles based on departmentId and categoryId
    dispatch(fetchArticlesByCategory(                                                                                        categoryId));
  }, [categoryId, dispatch]);

  if (status === 'loading') return <p>Loading articles...</p>;
  if (status === 'failed') return <p>Failed to load articles.</p>;

  return (
    <div>
      <h2>Articles for Category {categoryId}</h2>
      <ul>
        {articles.map((article) => (
          <li key={article.article_id}>
            {/* Link to the article with departmentId, categoryId, and articleId */}
            <Link to={`/department/${departmentId}/category/${categoryId}/article/${article.article_id}`}>
              {article.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryArticles;