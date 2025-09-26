import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getBooks, getBookDetails, addFavorite, getReviews, addReview, upvoteReview } from "../api";
import "../styles/Card.css";
import "../styles/Browse.css";

const BookManager = () => {
  const [books, setBooks] = useState([]);
  const [bookDetails, setBookDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const { bookId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  // Get search query from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search")?.toLowerCase() || "";

  // Fetch all books on mount
  useEffect(() => {
    getBooks()
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  // Fetch book details and reviews when bookId changes
  useEffect(() => {
    if (bookId) {
      getBookDetails(bookId)
        .then((res) => setBookDetails(res.data))
        .catch((err) => {
          console.error("Error fetching book details:", err);
          setBookDetails(null);
        });

      getReviews(bookId)
        .then((res) => setReviews(res.data))
        .catch((err) => console.error("Error fetching reviews:", err));
    } else {
      setBookDetails(null);
      setReviews([]);
    }
  }, [bookId]);

  const handleAddFav = async (bookId) => {
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

  const handleReviewChange = (e) => setNewReview(e.target.value);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) {
      alert("Please write a review before submitting.");
      return;
    }
    try {
      const response = await addReview(userId, bookId, newReview);
      setReviews((prev) => [response.data.review, ...prev]);
      setNewReview("");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review.");
    }
  };

  const handleUpvote = async (reviewId) => {
    if (!userId) {
      alert("Please log in to upvote!");
      return;
    }
    try {
      const res = await upvoteReview(reviewId, userId);
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId ? { ...r, upvotes: res.data.upvotes } : r
        )
      );
    } catch (err) {
      console.error("Failed to upvote review:", err);
      alert("Upvote failed.");
    }
  };

  // Filter books by search query (for when bookId is absent)
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="book-details-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>

      {!bookId ? (
        <div className="book-list">
          {filteredBooks.length ? (
            filteredBooks.map((b) => (
              <div
                key={b._id}
                className="book-card"
                onClick={() => navigate(`/books/${b._id}`)}
              >
                <img src={b.thumbnail} alt={b.title} className="card-thumbnail" />
                <h3>{b.title}</h3>
                <p>{b.author}</p>
              </div>
            ))
          ) : (
            <p className="no-books-text">📚 Book not present</p>
          )}
        </div>
      ) : bookDetails ? (
        <>
          <div className="details-layout">
            <img src={bookDetails.thumbnail} alt={bookDetails.title} className="details-image" />
            <div className="details-info">
              <h2>{bookDetails.title}</h2>
              <p><strong>Author:</strong> {bookDetails.author}</p>
              <p><strong>Summary:</strong> {bookDetails.summary}</p>
              <p>
                <strong>Rating:</strong> {bookDetails.rating}{" "}
                <span className="stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      style={{ color: i < Math.round(bookDetails.rating) ? "#FFD700" : "#ccc" }}
                    >
                      ★
                    </span>
                  ))}
                </span>
              </p>
              {bookDetails.amazonLink && (
                <a href={bookDetails.amazonLink} target="_blank" rel="noopener noreferrer">
                  Buy on Amazon
                </a>
              )}
              <button
                onClick={() => handleAddFav(bookDetails._id)}
                disabled={!userId}
                className="fav-btn"
              >
                ❤️ Add to Favorites
              </button>
            </div>
          </div>

          <div className="review-section">
            <h3>Write your review</h3>
            <form onSubmit={handleReviewSubmit}>
              <textarea
                value={newReview}
                onChange={handleReviewChange}
                placeholder="Write your review here..."
                className="review-textarea"
                rows="4"
              />
              <button type="submit" className="submit-review-btn">Submit Review</button>
            </form>

            {reviews.length > 0 && (
              <div className="reviews-list">
                <h3>Reviews:</h3>
                <ul>
                  {reviews.map((review, i) => (
                    <li key={i} className="review-item">
                      <p>{review.content}</p>
                      <div className="review-meta">
                        <small style={{ color: "#666" }}>
                          by <strong>{review.user?.name || "Unknown"}</strong> ·{" "}
                          {new Date(review.createdAt).toLocaleString()}
                        </small>
                        <div className="upvote-section">
                          <button
                            className="upvote-btn"
                            disabled={!userId || review.upvotes?.includes(userId)}
                            onClick={() => handleUpvote(review._id)}
                          >
                            👍 {review.upvotes?.length || 0}
                          </button>
                        </div>
                      </div>
                      {/* Show rating as repeated stars */}
                      {review.rating && (
                        <span style={{ color: "#FFD700", marginLeft: "5px" }}>
                          {Array.from({ length: review.rating }, () => "★").join("")}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="loading-text">Loading book details…</p>
      )}
    </div>
  );
};

export default BookManager;
