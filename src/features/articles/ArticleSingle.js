// src/features/articles/ArticleSingle.js

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticleById } from './articleSingleSlice';
import { useParams, Link } from 'react-router-dom';

const ArticleSingle = () => {
    const { articleId } = useParams();
    const dispatch = useDispatch();
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

    if (status === 'loading') return <p>Loading...</p>;
    if (status === 'failed') return <p>Error: {error}</p>;
    if (!article) return <p>No article found.</p>;

    return (
        <div>
            <h2>{article.name}</h2>
            <p>{article.description}</p>
            <img src={article.image_1} alt={article.name} />
            <img src={article.image_2} alt={`${article.name} alternate`} />
            <Link to="/">Back to Home</Link>
        </div>
    );
};

export default ArticleSingle;