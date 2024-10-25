import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticles } from './articlesSlice';
import './ArticlesList.css';

const ArticleExcerpt = ({ article }) => (
  <div className="article-card">
    <h3>{article.name}</h3>
    <p>{article.description}</p>
  </div>
);

export const ArticlesList = () => {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.articles.articles);
  const status = useSelector((state) => state.articles.status);
  const error = useSelector((state) => state.articles.error);

  useEffect(() => {
    if (status === 'idle') {
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