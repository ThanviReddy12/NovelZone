// backend/routes/quoteRoutes.js
const express = require("express");
const router  = express.Router();
const Quote   = require("../models/Quote");

// GET all quotes for a user
router.get("/:userId", async (req, res) => {
    try {
        const quotes = await Quote.find({ user: req.params.userId });
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// POST add a new quote
router.post("/add-quote", async (req, res) => {
    const { userId, quote, author, bookTitle } = req.body;
    try {
        const newQuote = new Quote({ user: userId, quote, author, bookTitle });
        await newQuote.save();
        res.status(201).json(newQuote);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// PUT edit an existing quote
router.put("/edit-quote/:id", async (req, res) => {
    const { quote, author, bookTitle } = req.body;
    try {
        const updated = await Quote.findByIdAndUpdate(
            req.params.id,
            { quote, author, bookTitle },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Quote not found" });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// DELETE a quote
router.delete("/delete-quote/:id", async (req, res) => {
    try {
        await Quote.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
