import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticles } from './articlesSlice';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './ArticlesList.css';

const ArticleExcerpt = ({ article }) => (
  <div className="article-card">
    <h3>
      <Link to={`/article/${article.article_id}`}>{article.name}</Link> {/* Link to the specific article */}
    </h3>
    <p><strong>ID:</strong> {article.article_id}</p>
    <p><strong>Description:</strong> {article.description}</p>
    <p><strong>Price:</strong> ${Number(article.price).toFixed(2)}</p>

    {/* Display images with fallback */}
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
  </div>
);

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