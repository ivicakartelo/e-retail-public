import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchArticlesByDepartment } from './departmentArticlesSlice';
import './DepartmentArticlesList.css'; // for styling cards

const DepartmentArticlesList = () => {
  const dispatch = useDispatch();
  const { departmentId } = useParams();
  
  const articles = useSelector((state) => state.departmentArticles.articles);
  const status = useSelector((state) => state.departmentArticles.status);
  const error = useSelector((state) => state.departmentArticles.error);

  useEffect(() => {
    dispatch(fetchArticlesByDepartment(departmentId));
  }, [departmentId, dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div className="articles-grid">
      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        articles.map((article) => (
          <div key={article.article_id} className="article-card">
            <img
              src={`/assets/e_retail_public/articles/${article.image_1 || 'default.png'}`}
              alt={article.name}
              className="article-image"
            />
            <div className="article-info">
              <h3>{article.name}</h3>
              <p className="article-description">{article.description}</p>
              <p className="article-price">{parseFloat(article.price).toFixed(2)} €</p>
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DepartmentArticlesList;