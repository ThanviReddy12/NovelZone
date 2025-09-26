import axios from 'axios';

// Set the base URL for your API
const API_BASE_URL = 'http://localhost:5000/api';

// Axios instance with baseURL for cleaner calls
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Optional: if your backend uses cookies/sessions
});

// ------------------------------
// Books
// ------------------------------
export const getBooks = () => api.get('/books');
export const getBookDetails = (bookId) => api.get(`/books/${bookId}`);

// ------------------------------
// Authentication
// ------------------------------
export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password });

export const signupUser = (name, email, password) =>
  api.post('/auth/signup', { name, email, password });

// ------------------------------
// Favorites
// ------------------------------
export const addFavorite = (userId, bookId) =>
  api.post('/favorites/add-favorite', { userId, bookId });

export const getFavorites = (userId) =>
  api.get(`/favorites/${userId}`);

export const removeFavorite = (userId, bookId) =>
  api.delete('/favorites/remove-favorite', {
    params: { userId, bookId }
  });

// ------------------------------
// Reviews
// ------------------------------
export const getReviews = (bookId) =>
  api.get(`/reviews/${bookId}`);

export const addReview = (userId, bookId, content, rating = 0) =>
  api.post('/reviews/add-review', { userId, bookId, content, rating });

export const upvoteReview = (reviewId, userId) =>
  api.patch(`/reviews/upvote/${reviewId}`, { userId });

// ------------------------------
// Quotes
// ------------------------------
export const getQuotes = (userId) =>
  api.get(`/quotes/${userId}`);

export const addQuote = (userId, quote, author, bookTitle) =>
  api.post('/quotes/add-quote', { userId, quote, author, bookTitle });

export const deleteQuote = (quoteId) =>
  api.delete(`/quotes/delete-quote/${quoteId}`);

export const editQuote = (quoteId, updatedData) =>
  api.put(`/quotes/edit-quote/${quoteId}`, updatedData);
