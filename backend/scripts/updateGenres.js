const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Book = require('../models/Book');

const updateGenres = async () => {
    try {
        await connectDB();

        const result = await Book.updateMany(
            { genre: { $exists: false } },
            { $set: { genre: 'Other' } }
        );

        console.log(`${result.modifiedCount} books updated with default genre.`);
    } catch (err) {
        console.error('Error updating genres:', err);
    } finally {
        mongoose.connection.close();
    }
};

updateGenres();
