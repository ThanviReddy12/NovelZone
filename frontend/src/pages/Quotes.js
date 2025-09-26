// src/pages/Quotes.js
import { useState, useEffect, useCallback } from 'react';
import { getQuotes, addQuote } from '../api';
import QuotesManager from '../components/QuotesManager';
import '../styles/App.css';

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const userId = localStorage.getItem('userId');

  const fetchQuotes = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await getQuotes(userId);
      setQuotes(res.data);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleAddQuote = async (quote, author, bookTitle) => {
    try {
      await addQuote(userId, quote, author, bookTitle);
      fetchQuotes();
    } catch (error) {
      console.error('Failed to add quote:', error);
    }
  };

  return (
    <div className="quotes-page">
      <h2>My Quotes</h2>
      <QuotesManager
        quotes={quotes}
        refreshQuotes={fetchQuotes}
        onAddQuote={handleAddQuote}
      />
    </div>
  );
};

export default Quotes;
