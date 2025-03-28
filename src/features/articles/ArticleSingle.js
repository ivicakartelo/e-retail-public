// src/features/articles/ArticleSingle.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticleById } from './articleSingleSlice';
import { addToBasket } from '../basket/basketSlice';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CommentsList from '../comments/CommentsList';
import { selectArticle, selectArticleStatus, selectArticleError } from './articleSelectors';
import './ArticleSingle.css';

const ArticleSingle = () => {
  const { articleId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use memoized selectors
  const article = useSelector(selectArticle);
  const status = useSelector(selectArticleStatus);
  const error = useSelector(selectArticleError);

  useEffect(() => {
    if (articleId) {
      dispatch(fetchArticleById(articleId));
    }
  }, [articleId, dispatch]);

  const handleAddToBasket = () => {
    if (article?.article_id) {
      dispatch(addToBasket(article));
      navigate('/basket');
    }
  };

  if (status === 'loading') return <div className="loading">Loading...</div>;
  if (status === 'failed') return <div className="error">Error: {error}</div>;
  if (!article) return <div className="error">No article found.</div>;

  const price = article.price && !isNaN(article.price) 
    ? Number(article.price).toFixed(2) 
    : null;

  return (
    <div className="article-single">
      <div className="article-content">
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

        <div className="text-content">
          <h2>{article.name}</h2>
          <p>{article.description}</p>
          <p><strong>Price:</strong> {price ? `$${price}` : 'Price not available'}</p>
          <button className="add-to-basket" onClick={handleAddToBasket}>
            Add to Basket
          </button>
          <Link to="/" className="back-to-home">
            Back to Home
          </Link>
        </div>
      </div>

      {/* Comments Section */}
      <div className="article-comments">
        <CommentsList articleId={articleId} />
      </div>
    </div>
  );
};

export default ArticleSingle;