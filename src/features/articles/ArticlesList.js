import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticles } from './articlesSlice';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { addToBasket } from '../basket/basketSlice'; // Import the action
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ArticlesList.css';

const ArticleExcerpt = ({ article }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleAddToBasket = () => {
    if (!article.article_id) {
      console.error('Invalid article object:', article);
      return; // Prevent dispatching if article_id is missing
    }
    dispatch(addToBasket(article));
    console.log('Added to basket:', article);
    navigate('/basket');
  };
  

  return (
    <div className="article-card">
      <h3>
        <Link to={`/article/${article.article_id}`}>{article.name}</Link>
      </h3>
      <p><strong>Price:</strong> ${Number(article.price).toFixed(2)}</p>
      <div className="article-images">
        <img
          src={article.image_1 ? `http://localhost:5000/assets/images/${article.image_1}` : '/assets/images/placeholder.jpg'}
          alt={`${article.name} - image_1`}
        />
        <img
          src={article.image_2 ? `http://localhost:5000/assets/images/${article.image_2}` : '/assets/images/placeholder.jpg'}
          alt={`${article.name} - image_2`}
        />
      </div>
      <button className="add-to-basket" onClick={handleAddToBasket}>
        Add to Basket
      </button>
    </div>
  );
};

export const ArticlesList = () => {
  console.log("ArticlesList render");
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.articles.articles);
  const status = useSelector((state) => state.articles.status);
  const error = useSelector((state) => state.articles.error);

  useEffect(() => {
    if (status === 'idle') {
      console.log(status);
      dispatch(fetchArticles());
    }
  }, [status, dispatch]);

  let content;

  if (status === 'loading') {
    content = <h2>Loading articles...</h2>;
  } else if (status === 'succeeded') {
    content = (
      <div className="articles-grid">
        {articles.map((article) => (
          <ArticleExcerpt key={article.article_id} article={article} />
        ))}
      </div>
    );
  } else if (status === 'failed') {
    content = <div className="error-message">Error: {error}</div>;
  }

  return (
    <section className="articles-list">
      <h1>Articles</h1>
      {content}
    </section>
  );
};