import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticlesByCategory } from './categoryArticlesSlice';
import './ArticlesList.css';

const CategoryArticles = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.categoryArticles.articles);
  const status = useSelector((state) => state.categoryArticles.status);
  const error = useSelector((state) => state.categoryArticles.error);

  useEffect(() => {
    dispatch(fetchArticlesByCategory(categoryId));
  }, [categoryId, dispatch]);

  if (status === 'loading') return <p>Loading articles...</p>;
  if (status === 'failed') return <p>Failed to load articles. Error: {error}</p>;

  return (
    <div>
      <h2>Articles for Category {categoryId}</h2>
      <div className="category-articles-grid">
        {articles.map((article) => (
          <div key={article.article_id} className="article-card">
            <Link to={`/article/${article.article_id}`}>
              <h3>{article.name}</h3>
            </Link>

            {/* Display Image 1 */}
            <img
              src={article.image_1
                ? `http://localhost:5000/assets/images/${article.image_1}`
                : '/assets/images/placeholder.jpg'}
              alt={article.name}
              className="article-image"
            />

            {/* Display Image 2 */}
            <img
              src={article.image_2
                ? `http://localhost:5000/assets/images/${article.image_2}`
                : '/assets/images/placeholder.jpg'}
              alt={`${article.name} alternate`}
              className="article-image"
            />

            <p>{article.description}</p>

            {/* Display Price */}
            <p><strong>Price:</strong> {article.price ? `$${Number(article.price).toFixed(2)}` : 'Price not available'}</p>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryArticles;