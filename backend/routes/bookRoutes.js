const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// ✅ GET: Fetch all books
router.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ POST: Add a new book to the database
router.post("/add-book", async (req, res) => {
    try {
        const { title, author, thumbnail, summary, rating, amazonLink, genre } = req.body;

        if (!title || !author) {
            return res.status(400).json({ message: "Title and author are required!" });
        }

        const newBook = new Book({ title, author, thumbnail, summary, rating, amazonLink, genre });
        await newBook.save();

        res.status(201).json({ message: "Book added successfully!", book: newBook });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
