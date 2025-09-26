import { useEffect, useState } from "react";
import { getFavorites, removeFavorite } from "../api";
import "../styles/Favorites.css";

const Favorites = ({ userId }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (!userId) return;

        getFavorites(userId)
            .then(response => {
                setFavorites(response.data);
            })
            .catch(error => console.error("Error fetching favorites:", error));
    }, [userId]);

    const handleRemoveFavorite = (bookId) => {
        removeFavorite(userId, bookId)
            .then(() => {
                setFavorites(prevFavorites =>
                    prevFavorites.filter(book => book._id.toString() !== bookId.toString())
                );
            })
            .catch(error => console.error("Error removing favorite:", error));
    };

    return (
        <div className="favorites-container">
            {favorites.length === 0 ? (
               <p className="no-favorites-text">No favorites yet. Click "Add to Favorites" on a book!</p>

            ) : (
                favorites.map(book => (
                    <div key={book._id} className="book-card">
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>
                        {book.thumbnail ? <img src={book.thumbnail} alt={book.title} className="book-image" /> : <p>No image available</p>}
                        <button className="remove-fav-btn" onClick={() => handleRemoveFavorite(book._id)}>
                        💔Remove from Favorites
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Favorites;
