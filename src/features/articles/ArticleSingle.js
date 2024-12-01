import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticleById } from './articleSingleSlice';
import { addToBasket } from '../basket/basketSlice'; // Import the addToBasket action
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './ArticleSingle.css'; // Import the CSS

const ArticleSingle = () => {
  const { articleId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const article = useSelector((state) => state.articleSingle.article);
  const status = useSelector((state) => state.articleSingle.status);
  const error = useSelector((state) => state.articleSingle.error);

  useEffect(() => {
    if (articleId) {
      dispatch(fetchArticleById(articleId));
    } else {
      console.error("No articleId found in URL parameters.");
    }
  }, [articleId, dispatch]);

  const handleAddToBasket = () => {
    if (!article || !article.article_id) {
      console.error('Invalid article object:', article);
      return; // Prevent dispatching if article_id is missing
    }
    dispatch(addToBasket(article));
    console.log('Added to basket:', article);
    navigate('/basket'); // Navigate to the basket page
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;
  if (!article) return <p>No article found.</p>;

  const price = article.price && !isNaN(article.price) ? Number(article.price).toFixed(2) : null;

  return (
    <div className="article-single">
      <h2>{article.name}</h2>
      <p>{article.description}</p>
      <p>
        <strong>Price:</strong> {price ? `$${price}` : 'Price not available'}
      </p>
      <div className="images-wrapper">
        <img
          src={article.image_1 
            ? `http://localhost:5000/assets/images/${article.image_1}` 
            : '/assets/images/placeholder.jpg'}
          alt={article.name}
          className="article-image"
        />
        <img
          src={article.image_2 
            ? `http://localhost:5000/assets/images/${article.image_2}` 
            : '/assets/images/placeholder.jpg'}
          alt={`${article.name} alternate`}
          className="article-image"
        />
      </div>
      <button className="add-to-basket" onClick={handleAddToBasket}>
        Add to Basket
      </button>
      <Link to="/" className="back-to-home">
        Back to Home
      </Link>
    </div>
  );
};

export default ArticleSingle;