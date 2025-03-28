// src/features/comments/CommentsList.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from './commentsSlice';
import './CommentsList.css';

// Star Rating Component (Reusable)
const StarRating = ({ rating = 0, interactive = false, onRate = () => {} }) => {
  return (
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
};

// Comment Excerpt Component
const CommentExcerpt = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(true);
  
  const {
    username = 'Anonymous',
    avatar = '/default-avatar.png',
    rating = 0,
    created_at = new Date().toISOString(),
    comment_text = '',
    replies = []
  } = comment;

  return (
    <div className={`comment ${comment.parent_comment_id ? 'reply' : ''}`}>
      <div className="comment-header">
        <img 
          src={avatar} 
          alt={`${username}'s avatar`}
          className="comment-avatar"
          onError={(e) => e.target.src = '/default-avatar.png'}
        />
        <div className="comment-user-info">
          <div className="username-rating">
            <strong className="username">{username}</strong>
            {rating > 0 && <StarRating rating={rating} />}
          </div>
          <span className="comment-date">
            {new Date(created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>
      
      <p className="comment-text">{comment_text}</p>
      
      {replies.length > 0 && (
        <div className="comment-replies">
          <button 
            onClick={() => setShowReplies(!showReplies)}
            className="toggle-replies"
            aria-expanded={showReplies}
          >
            {showReplies ? 'Hide replies' : `Show replies (${replies.length})`}
          </button>
          
          {showReplies && (
            <div className="replies-list">
              {replies.map(reply => (
                <CommentExcerpt 
                  key={reply.comment_id || `reply-${Math.random().toString(36).substr(2, 9)}`}
                  comment={reply} 
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Comment Form Component
const CommentForm = ({ articleId }) => {
  const dispatch = useDispatch();
  const { token, user = {} } = useSelector(state => state.login || {});
  const isLoggedIn = !!token;

  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [submissionError, setSubmissionError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError(null);
    
    if (!isLoggedIn) {
      setSubmissionError('Please login to post a review');
      return;
    }

    if (!text.trim()) {
      setSubmissionError('Comment text cannot be empty');
      return;
    }

    try {
      await dispatch(addComment({
        articleId,
        text: text.trim(),
        userId: user.user_id,
        rating: rating || null,
        username: user.username || 'Anonymous'
      })).unwrap();
      
      setText('');
      setRating(0);
    } catch (err) {
      setSubmissionError(err.payload?.error || 'Failed to post comment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <h3>Leave a Review</h3>
      
      <div className="current-user">
        <img 
          src={user.avatar || '/default-avatar.png'} 
          alt={user.username || 'User'} 
        />
        <span>{user.username || 'Anonymous'}</span>
      </div>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your thoughts about this product..."
        disabled={!isLoggedIn}
        rows={4}
      />
      
      <div className="rating-section">
        <label>Your Rating:</label>
        <StarRating 
          rating={rating} 
          interactive={isLoggedIn}
          onRate={setRating}
        />
      </div>

      {submissionError && (
        <div className="error-message" role="alert">
          {submissionError}
        </div>
      )}

      <button type="submit" disabled={!isLoggedIn || !text.trim()}>
        Post Review
      </button>
    </form>
  );
};

// Main Comments List Component
const CommentsList = ({ articleId }) => {
  const comments = useSelector(state => state.comments?.items || []);

  return (
    <div className="comments-list-container">
      <h2>Customer Reviews</h2>
      
      <CommentForm articleId={articleId} />
      
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map(comment => (
            <CommentExcerpt 
              key={comment.comment_id || `comment-${Math.random().toString(36).substr(2, 9)}`}
              comment={comment} 
            />
          ))
        ) : (
          <div className="no-comments">
            <p>No reviews yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsList;