// src/features/articles/ArticleSingle.js

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticleById, resetStatus } from './articleSingleSlice'; // Import resetStatus
import { useParams } from 'react-router-dom';

const ArticleSingle = () => {
    const { articleId } = useParams();
    const dispatch = useDispatch();
    const article = useSelector((state) => state.articleSingle.article);
    const status = useSelector((state) => state.articleSingle.status);
    const error = useSelector((state) => state.articleSingle.error);

    useEffect(() => {
        // Reset status whenever articleId changes
        dispatch(resetStatus());
    }, [articleId, dispatch]);

    useEffect(() => {
        if (status === 'idle' && articleId) {
            dispatch(fetchArticleById(articleId));
        }
    }, [status, dispatch, articleId]);

    if (status === 'loading') return <p>Loading...</p>;
    if (status === 'failed') return <p>Error: {error}</p>;

    if (!article) return <p>No article found.</p>;

    return (
        <div>
            <h2>{article.name}</h2>
            <p>{article.description}</p>
            <img src={article.image_1} alt={article.name} />
            <img src={article.image_2} alt={`${article.name} alternate`} />
        </div>
    );
};

export default ArticleSingle;