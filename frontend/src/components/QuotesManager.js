// src/components/QuotesManager.js
import { useState, useEffect } from 'react';
import { deleteQuote, editQuote } from '../api';
import '../styles/QuotesManager.css';

const QuotesManager = ({ quotes, refreshQuotes, onAddQuote }) => {
  const [quoteText, setQuoteText] = useState('');
  const [author, setAuthor] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [editQuoteId, setEditQuoteId] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!editQuoteId) {
      setQuoteText('');
      setAuthor('');
      setBookTitle('');
    }
  }, [editQuoteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quoteText || !author || !bookTitle) {
      alert('Please fill all fields');
      return;
    }

    if (editQuoteId) {
      await editQuote(editQuoteId, {
        quote: quoteText,
        author,
        bookTitle
      });
      setEditQuoteId(null);
    } else {
      await onAddQuote(quoteText, author, bookTitle);
    }

    setQuoteText('');
    setAuthor('');
    setBookTitle('');
    refreshQuotes();
  };

  const handleEdit = (quote) => {
    setEditQuoteId(quote._id);
    setQuoteText(quote.quote);
    setAuthor(quote.author);
    setBookTitle(quote.bookTitle);
  };

  const handleDelete = async (id) => {
    await deleteQuote(id);
    refreshQuotes();
  };

  const handleCancelEdit = () => {
    setEditQuoteId(null);
    setQuoteText('');
    setAuthor('');
    setBookTitle('');
  };

  return (
    <div className="quote-manager">
      <form onSubmit={handleSubmit} className="quote-form">
        <input
          type="text"
          placeholder="Quote"
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          disabled={!userId}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={!userId}
        />
        <input
          type="text"
          placeholder="Book Title"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
          disabled={!userId}
        />
        <div className="form-buttons">
          <button type="submit" disabled={!userId}>
            {editQuoteId ? 'Save Changes' : 'Add Quote'}
          </button>
          {editQuoteId && userId && (
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </div>
        {!userId && (
          <p className="login-warning-text">✨ You need to log in to write quotes ✨</p>
        )}
      </form>

      <div className="quote-list">
        {quotes.length === 0 ? (
          <p>No quotes added yet.</p>
        ) : (
          quotes.map((q, idx) => (
            <div className="quote-card" key={q._id}>
              <p>
                <strong>{idx + 1}.</strong> "{q.quote}" – {q.author} ({q.bookTitle})
              </p>
              {userId && (
                <div className="card-buttons">
                  <button onClick={() => handleEdit(q)}>✏️</button>
                  <button onClick={() => handleDelete(q._id)}>🗑️</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuotesManager;
