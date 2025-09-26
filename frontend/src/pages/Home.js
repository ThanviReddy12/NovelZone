import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

/* 📖 Importing Book Images */
import book1a from "../images/image2.jpg";
import book1b from "../images/image3.jpg";
import book1c from "../images/image4.jpg";

import book2a from "../images/image5.jpg";
import book2b from "../images/image6.jpg";
import book2c from "../images/image7.jpg";

import book3a from "../images/image8.jpg";
import book3b from "../images/image9.jpg";
import book3c from "../images/image10.jpg";

/* 🔄 Featured Books Data */
const featuredBooks = [
    [book1a, book1b, book1c],
    [book2a, book2b, book2c],
    [book3a, book3b, book3c]
];

const Home = () => {
    const navigate = useNavigate();
    const [currentBookIndexes, setCurrentBookIndexes] = useState([0, 0, 0]);

    /* 🔄 Change Book Image on Click */
    const changeBook = (cardIndex) => {
        setCurrentBookIndexes((prevIndexes) => {
            const updatedIndexes = [...prevIndexes];
            updatedIndexes[cardIndex] = (updatedIndexes[cardIndex] + 1) % featuredBooks[cardIndex].length;
            return updatedIndexes;
        });
    };

    return (
        <div className="home-bg">
            <div className="home-overlay" />

            {/* ✨ Title & Tagline */}
            <section className="title-section">
                <h1 className="title">NovelZone</h1>
                <p className="tagline">Your Next Favorite Book Awaits.</p>
            </section>

            {/* 🎯 Browse Button */}
            <div className="browse-btn-container">
                <button className="browse-btn" onClick={() => navigate("/browse")}>
                    Browse
                </button>
            </div>

            {/* 📚 Featured Books */}
            <section className="featured">
                <h2>📚 Featured Books</h2>
                <div className="book-cards">
                    {featuredBooks.map((bookSet, index) => (
                        <div key={index} className="book-card" onClick={() => changeBook(index)}>
                            <img src={bookSet[currentBookIndexes[index]]} alt={`Featured Book ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </section>

            {/* 💬 Testimonials */}
            <section className="testimonial-section">
                <div className="testimonial-card">
                    <p className="testimonial">
                        “NovelZone helped me find amazing books I’d never heard of before!”
                    </p>
                    <p className="reader">— Happy Reader</p>
                </div>
                <div className="testimonial-card">
                    <p className="testimonial">
                        “A perfect place to discover hidden gems and timeless classics.”
                    </p>
                    <p className="reader">— Bookworm Bliss</p>
                </div>
            </section>

            {/* 💡 Why Choose NovelZone? */}
            <section className="why-novelzone">
                <h2>💡 Why Choose NovelZone?</h2>
                <div className="features">
                    <div className="feature-box">📖 Browse 15+ Books</div>
                    <div className="feature-box">❤️ Save Your Favorites</div>
                    <div className="feature-box">🗂️ Curated Collections</div>
                    <div className="feature-box">⚡ Easy to Use</div>
                </div>
            </section>
        </div>
    );
};

export default Home;
