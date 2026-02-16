const Review = require("../models/Review");
const Book = require("../models/Book");

// @desc    Add a review
// @route   POST /api/reviews/:bookId
// @access  Private
const addReview = async (req, res) => {
    const { rating, comment } = req.body;
    const bookId = req.params.bookId;

    try {
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        const alreadyReviewed = await Review.findOne({
            user: req.user._id,
            book: bookId,
        });

        if (alreadyReviewed) {
            return res.status(400).json({ success: false, message: "Book already reviewed" });
        }

        const review = await Review.create({
            user: req.user._id,
            book: bookId,
            rating: Number(rating),
            comment,
        });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get reviews for a book
// @route   GET /api/reviews/:bookId
// @access  Public
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ book: req.params.bookId })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        if (!reviews) {
            return res.status(404).json({ success: false, message: "Reviews not found" });
        }

        // Calculate average rating
        const averageRating =
            reviews.length > 0
                ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
                : 0;

        res.json({
            success: true,
            count: reviews.length,
            averageRating: averageRating.toFixed(1),
            data: reviews,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { addReview, getReviews };
