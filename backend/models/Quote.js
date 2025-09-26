// backend/models/Quote.js
const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookTitle:  { type: String, required: true },
    author:     { type: String, required: true },
    quote:      { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);
