const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');

// POST /api/reviews/add-review
router.post('/add-review', async (req, res) => {
  try {
    const { userId, bookId, content, rating } = req.body;

    if (!userId || !bookId || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found or unauthorized' });
    }

    const newReview = new Review({
      user: userId,
      book: bookId,
      content,
      rating: rating || 0,
      upvotes: 0,
      upvotedBy: []
    });

    await newReview.save();
    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reviews/:bookId
router.get('/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.find({ book: bookId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/reviews/upvote/:reviewId
router.patch('/upvote/:reviewId', async (req, res) => {
  try {
    const { userId } = req.body;
    const { reviewId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: 'Invalid or missing user ID' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.upvotedBy.includes(userId)) {
      return res.status(400).json({ message: 'You have already upvoted this review' });
    }

    review.upvotes += 1;
    review.upvotedBy.push(userId);
    await review.save();

    res.status(200).json({ message: 'Upvoted successfully', upvotes: review.upvotes });
  } catch (err) {
    console.error('Error upvoting review:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
