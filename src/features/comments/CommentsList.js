import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, fetchComments } from './commentsSlice';
import './CommentsList.css';

const StarRating = ({ rating = 0, interactive = false, onRate = () => {} }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`star ${star <= rating ? 'filled' : ''}`}
        onClick={() => interactive && onRate(star)}
        disabled={!interactive}
        aria-label={`Rate ${star} star`}
      >
        ★
      </button>
    ))}
  </div>
);

const CommentExcerpt = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(true);
  const {
    name = 'Anonymous',  // Default to 'Anonymous' if no name
    rating = 0,
    created_at = new Date().toISOString(),
    comment_text = '',
    replies = []
  } = comment || {};

  return (
    <div className={`comment ${comment?.parent_comment_id ? 'reply' : ''}`}>
      <div className="comment-header">
        <div className="comment-user-info">
          <strong className="username">{name}</strong> {/* Display the commenter's name */}
          {rating > 0 && <StarRating rating={rating} />}
          <span className="comment-date">
            {new Date(created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
      <p className="comment-text">{comment_text}</p>
      {replies.length > 0 && (
        <div className="comment-replies">
          <button onClick={() => setShowReplies(!showReplies)} className="toggle-replies">
            {showReplies ? 'Hide replies' : `Show replies (${replies.length})`}
          </button>
          {showReplies && replies.map(reply => (
            <CommentExcerpt key={reply.comment_id || `reply-${Math.random().toString(36).substr(2, 9)}`} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentForm = ({ articleId }) => {
  const dispatch = useDispatch();
  const { token, user = {} } = useSelector(state => state.login ?? {}); // Ensure to access the correct state for user
  const isLoggedIn = !!token;
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return setError('Please login to post a review');
    if (!text.trim()) return setError('Comment text cannot be empty');
    try {
      await dispatch(addComment({
        articleId,
        text: text.trim(),
        userId: user.user_id,
        rating: rating || null,
        name: user.name || 'Anonymous'  // Ensure the name is set properly
      })).unwrap();
      setText('');
      setRating(0);
    } catch (err) {
      setError(err.payload?.error || 'Failed to post comment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <h3>Leave a Review</h3>
      <div className="current-user">
        <span>{user?.name || 'Anonymous'}</span> {/* Display the logged-in user's name */}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your thoughts..."
        disabled={!isLoggedIn}
        rows={4}
      />
      <div className="rating-section">
        <label>Your Rating:</label>
        <StarRating rating={rating} interactive={isLoggedIn} onRate={setRating} />
      </div>
      {error && <div className="error-message" role="alert">{error}</div>}
      <button type="submit" disabled={!isLoggedIn || !text.trim()}>Post Review</button>
    </form>
  );
};

const CommentsList = ({ articleId }) => {
  const dispatch = useDispatch();
  const comments = useSelector(state => state.comments?.items || []);
  const status = useSelector(state => state.comments?.status);

  useEffect(() => {
    dispatch(fetchComments(articleId));
  }, [dispatch, articleId]);

  return (
    <div className="comments-list-container">
      <h2>Customer Reviews</h2>
      <CommentForm articleId={articleId} />
      <div className="comments-list">
        {status === 'loading' ? (
          <p>Loading comments...</p>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <CommentExcerpt key={comment.comment_id || `comment-${Math.random().toString(36).substr(2, 9)}`} comment={{ ...comment, name: comment.name || 'Anonymous' }} />
          ))
        ) : (
          <div className="no-comments"><p>No reviews yet. Be the first to share your thoughts!</p></div>
        )}
      </div>
    </div>
  );
};

export default CommentsList;