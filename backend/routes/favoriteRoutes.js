const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");

// ✅ GET: Fetch all favorites for a user (with book info)
router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId || userId === "null" || userId === "undefined") {
            return res.status(400).json({ message: "User ID is required!" });
        }

        const favorites = await Favorite.find({ user: userId }).populate("book");
        const books = favorites.filter(fav => fav.book).map(fav => fav.book); // remove nulls if book is deleted

        res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ POST: Add book to favorites (No duplicates allowed)
router.post("/add-favorite", async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        if (!userId || !bookId) {
            return res.status(400).json({ message: "User ID and Book ID are required!" });
        }

        const existingFavorite = await Favorite.findOne({ user: userId, book: bookId });
        if (existingFavorite) {
            return res.status(200).json({ message: "Book already in favorites!" });
        }

        const newFavorite = new Favorite({ user: userId, book: bookId });
        await newFavorite.save();

        res.status(201).json({ message: "Book added to favorites!", favorite: newFavorite });
    } catch (error) {
        console.error("Error adding book to favorites:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
router.delete("/remove-favorite", async (req, res) => {
    console.log("Received request:", req.query); // ✅ Debugging

    const { userId, bookId } = req.query;

    if (!userId || !bookId) {
        return res.status(400).json({ message: "User ID and Book ID are required!" });
    }

    const removedFavorite = await Favorite.findOneAndDelete({ user: userId, book: bookId });

    if (!removedFavorite) {
        return res.status(404).json({ message: "Favorite not found!" });
    }

    res.status(200).json({ message: "Book removed from favorites!" });
});


module.exports = router;
