// src/features/articles/articleSelectors.js
import { createSelector } from 'reselect';

// Selector to get article data
const getArticle = state => state.articleSingle?.article;

// Selector to get the article loading status
const getArticleStatus = state => state.articleSingle?.status;

// Selector to get the article error
const getArticleError = state => state.articleSingle?.error;

// Memoized selector for the article
export const selectArticle = createSelector(
  [getArticle],
  (article) => article || {}
);

// Memoized selector for the status
export const selectArticleStatus = createSelector(
  [getArticleStatus],
  (status) => status || 'idle'
);

// Memoized selector for the error
export const selectArticleError = createSelector(
  [getArticleError],
  (error) => error || null
);