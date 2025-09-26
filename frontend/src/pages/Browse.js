import React, { useState, useEffect } from "react";
import {
  getBooks,
  addFavorite,
  addReview,
  getReviews,
  upvoteReview,
} from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegThumbsUp, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "../styles/Browse.css";

const Browse = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(3);
  const [selectedSort, setSelectedSort] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [reviewCounts, setReviewCounts] = useState({});

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get("search")?.trim().toLowerCase() || "";

  useEffect(() => {
    const fetchBooksAndReviews = async () => {
      try {
        const res = await getBooks();
        setBooks(res.data);

        const counts = {};
        await Promise.all(
          res.data.map(async (book) => {
            try {
              const rev = await getReviews(book._id);
              counts[book._id] = rev.data.length;
            } catch {
              counts[book._id] = 0;
            }
          })
        );
        setReviewCounts(counts);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooksAndReviews();
  }, []);

  const openModal = async (book) => {
    setSelectedBook(book);
    setModalVisible(true);
    setNewReview("");
    setNewRating(3);
    try {
      const res = await getReviews(book._id);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setReviews([]);
    }
  };

  const closeModal = () => setModalVisible(false);

  const handleAddToFavorites = async (bookId) => {
    if (!userId) {
      alert("Please log in to add favorites!");
      navigate("/login");
      return;
    }

    try {
      await addFavorite(userId, bookId);
      alert("Added to favorites!");
    } catch (err) {
      alert("Failed to add to favorites.");
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please login to submit a review.");
      return;
    }

    if (!newReview.trim()) {
      alert("Please write a review.");
      return;
    }

    try {
      await addReview(userId, selectedBook._id, newReview, newRating);
      const res = await getReviews(selectedBook._id);
      setReviews(res.data);
      setNewReview("");
      setNewRating(3);
      setReviewCounts((prev) => ({
        ...prev,
        [selectedBook._id]: res.data.length,
      }));
    } catch (err) {
      const status = err.response?.status;
      alert(status === 401 ? "You must be logged in to submit a review." : "Failed to submit review.");
      console.error("Review submit failed:", err);
    }
  };

  const handleUpvote = async (reviewId) => {
    if (!userId) {
      alert("Please log in to upvote.");
      return;
    }

    try {
      const res = await upvoteReview(reviewId, userId);
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, upvotes: res.data.upvotes } : r))
      );
    } catch (err) {
      alert("Cannot upvote more than once.");
      console.error("Failed to upvote:", err);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} color="#FFD700" />);
      } else if (rating + 0.5 >= i) {
        stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
      } else {
        stars.push(<FaRegStar key={i} color="#ccc" />);
      }
    }
    return <span className="stars">{stars}</span>;
  };

  const renderReviewStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} color="#FFD700" />);
      } else if (rating + 0.5 >= i) {
        stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
      } else {
        stars.push(<FaRegStar key={i} color="#ccc" />);
      }
    }
    return <span style={{ marginLeft: "8px" }}>{stars}</span>;
  };

  const genres = Array.from(
    new Set(
      books.flatMap(book => book.genre?.split(",").map(g => g.trim()) || [])
    )
  ).sort();

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                          book.author.toLowerCase().includes(searchTerm);

    const bookGenres = book.genre?.split(",").map(g => g.trim()) || [];
    const matchesGenre = selectedGenre === "All" || bookGenres.includes(selectedGenre);

    return matchesSearch && matchesGenre;
  });

  const sortBooks = (booksToSort) => {
    switch (selectedSort) {
      case "title":
        return [...booksToSort].sort((a, b) => a.title.localeCompare(b.title));
      case "rating":
        return [...booksToSort].sort((a, b) => b.rating - a.rating);
      case "reviews":
        return [...booksToSort].sort((a, b) => (reviewCounts[b._id] || 0) - (reviewCounts[a._id] || 0));
      default:
        return booksToSort;
    }
  };

  const displayedBooks = sortBooks(filteredBooks);

  return (
    <div className="browse-container">
      <h1>Browse Books</h1>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="genre-select">Genre: </label>
          <select
            id="genre-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="filter-select"
          >
            <option value="All">All</option>
            {genres.map((genre, idx) => (
              <option key={idx} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select">Sort by: </label>
          <select
            id="sort-select"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Books</option>
            <option value="title">Title (A-Z)</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="reviews">Most Reviews</option>
          </select>
        </div>
      </div>

      <div className="book-grid">
        {displayedBooks.length === 0 ? (
          <p className="no-books-text">No books found matching your search and filters.</p>
        ) : (
          displayedBooks.map(book => (
            <div className="book-card" key={book._id}>
              <img
                src={book.thumbnail}
                alt={book.title}
                className="book-image"
                onClick={() => openModal(book)}
              />
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
              <button onClick={() => handleAddToFavorites(book._id)} className="fav-btn">
                ❤️ Add to Favorites
              </button>
            </div>
          ))
        )}
      </div>

      {modalVisible && selectedBook && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-left">
              <img src={selectedBook.thumbnail} alt={selectedBook.title} />
            </div>
            <div className="modal-right">
              <h3>{selectedBook.title}</h3>
              <p><strong>Author:</strong> {selectedBook.author}</p>
              <p><strong>Summary:</strong> {selectedBook.summary}</p>
              <p><strong>Genre:</strong> {selectedBook.genre?.split(",").map(g => g.trim()).join(", ") || "N/A"}</p>
              <p>
                <strong>Rating:</strong> {selectedBook.rating} {renderStars(selectedBook.rating)}
              </p>
              {selectedBook.amazonLink && (
                <a href={selectedBook.amazonLink} target="_blank" rel="noopener noreferrer">
                  Buy on Amazon
                </a>
              )}

              <div className="review-section">
                <h4>Write your review</h4>
                <form onSubmit={handleReviewSubmit}>
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Write your review here..."
                    className="review-textarea"
                    rows="4"
                    disabled={!userId}
                  />
                  <label>
                    Rating:
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      disabled={!userId}
                    >
                      {[1, 2, 3, 3.5, 4, 4.5, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" className="submit-review-btn" disabled={!userId}>
                    Submit Review
                  </button>
                  {!userId && <p className="login-to-review">Login to submit a review.</p>}
                </form>

                <p style={{ marginTop: "10px", fontWeight: "bold" }}>
                  Total Reviews: {reviewCounts[selectedBook._id] || 0}
                </p>

                {reviews.length > 0 && (
                  <div className="reviews-list">
                    <h4>Reviews:</h4>
                    <ul>
                      {reviews.map((review) => (
                        <li key={review._id} className="review-item">
                          <div>
                            <strong>{review.user?.name || "Anonymous"}</strong>
                            {renderReviewStars(review.rating)}
                          </div>
                          <div style={{ marginTop: "6px", whiteSpace: "pre-wrap" }}>
                            {review.content}
                          </div>
                          <div
                            onClick={() => handleUpvote(review._id)}
                            className="upvote-button"
                            title="Upvote this review"
                          >
                            <FaRegThumbsUp />
                            {review.upvotes || 0}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
