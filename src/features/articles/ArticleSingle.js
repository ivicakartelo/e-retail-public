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

    // Check if price is a valid number and not empty
    const price = article.price && !isNaN(article.price) ? Number(article.price).toFixed(2) : null;

    return (
        <div className="article-single">
            <h2>{article.name}</h2>
            <p>{article.description}</p>

            {/* Display Price */}
            <p><strong>Price:</strong> 
                {price ? `$${price}` : 'Price not available'}
            </p>

            {/* Image 1 */}
            <img
                src={article.image_1 
                    ? `http://localhost:5000/assets/images/${article.image_1}` 
                    : '/assets/images/placeholder.jpg'}
                alt={article.name}
                className="article-image"
            />
            
            {/* Image 2 */}
            <img
                src={article.image_2 
                    ? `http://localhost:5000/assets/images/${article.image_2}` 
                    : '/assets/images/placeholder.jpg'}
                alt={`${article.name} alternate`}
                className="article-image"
            />
            
            <Link to="/">Back to Home</Link>
        </div>
    );
};

export default ArticleSingle;