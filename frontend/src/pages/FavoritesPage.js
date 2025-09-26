import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Favorites from "../components/Favorites";
import "../styles/Favorites.css";

const FavoritesPage = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId || userId === "null" || userId === "undefined") {
            alert("You must be logged in to view your favorites.");
            setTimeout(() => navigate("/login"), 300);
        }
    }, [userId, navigate]);

    if (!userId || userId === "null" || userId === "undefined") {
        return null;
    }

    return (
        <div className="favorites-page">
            <h2>My Favorite Books</h2>
            <Favorites userId={userId} />
        </div>
    );
};

export default FavoritesPage;
