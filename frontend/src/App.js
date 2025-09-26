import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import './styles/App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import BookManager from './components/BookManager';
import FavoritesPage from './pages/FavoritesPage';
import Quotes from './pages/Quotes';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';

// Move logic into a component that has access to useNavigate
const AppWrapper = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (newTerm) => {
    setSearchTerm(newTerm);
  };

  // Register keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      switch (e.key) {
        case '/':
          e.preventDefault();
          const searchInput = document.querySelector(".search-input");
          if (searchInput) searchInput.focus();
          break;
        case 'f':
          navigate("/favorites");
          break;
        case 'b':
          navigate("/browse");
          break;
        case 'h':
          navigate("/");
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse searchTerm={searchTerm} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/books/:bookId" element={<BookManager />} />
        <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        <Route path="/quotes" element={<ProtectedRoute><Quotes /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
