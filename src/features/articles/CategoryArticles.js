import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticlesByCategory } from './categoryArticlesSlice';
import { addToBasket } from '../basket/basketSlice'; // Import the addToBasket action
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CategoryArticles.css';

const CategoryArticles = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const articles = useSelector((state) => state.categoryArticles.articles);
  const status = useSelector((state) => state.categoryArticles.status);
  const error = useSelector((state) => state.categoryArticles.error);

  useEffect(() => {
    dispatch(fetchArticlesByCategory(categoryId));
  }, [categoryId, dispatch]);

  const handleAddToBasket = (article) => {
    if (!article.article_id) {
      console.error('Invalid article object:', article);
      return; // Prevent dispatching if article_id is missing
    }
    dispatch(addToBasket(article));
    console.log('Added to basket:', article);
    navigate('/basket'); // Navigate to basket page
  };

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

            <div className="article-images-wrapper">
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
            </div>

            <p>{article.description}</p>

            {/* Display Price */}
            <p>
              <strong>Price:</strong>{' '}
              {article.price ? `$${Number(article.price).toFixed(2)}` : 'Price not available'}
            </p>

            {/* Add to Basket Button */}
            <button
              className="add-to-basket"
              onClick={() => handleAddToBasket(article)}
            >
              Add to Basket
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryArticles;