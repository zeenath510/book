const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const { uploadBook, downloadBook } = require("../controllers/fileController");
const upload = require("../middleware/uploadMiddleware");
const { verifyToken, adminOnly } = require("../middleware/authMiddleware");

// File Routes
router.post("/upload/:id", verifyToken, adminOnly, upload.single("bookFile"), uploadBook);
router.get("/download/:id", verifyToken, downloadBook);

// Search & Similar
// Place advanced search BEFORE /:id to avoid collision if not careful, though here it is specific
router.get("/advanced-search", require("../controllers/searchController").advancedSearch);
router.get("/similar/:id", require("../controllers/searchController").getSimilarBooksEnhanced);
router.get("/search", getBooks); // keeping old simple search or just mapping it to GET /?

// @desc    Get all books
// @route   GET /api/books
// @access  Public
router.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ success: false, message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
router.post("/", verifyToken, adminOnly, async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
router.put("/:id", verifyToken, adminOnly, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            const updatedBook = await Book.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );
            res.json(updatedBook);
        } else {
            res.status(404).json({ success: false, message: "Book not found" });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
router.delete("/:id", verifyToken, adminOnly, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            await book.deleteOne();
            res.json({ success: true, message: "Book removed" });
        } else {
            res.status(404).json({ success: false, message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Search books
// @route   GET /api/books/search?q=keyword
// @access  Public
router.get("/search", async (req, res) => {
    const keyword = req.query.q
        ? {
            $or: [
                { title: { $regex: req.query.q, $options: "i" } },
                { author: { $regex: req.query.q, $options: "i" } },
                { genre: { $regex: req.query.q, $options: "i" } },
                { tags: { $regex: req.query.q, $options: "i" } },
            ],
        }
        : {};

    try {
        const books = await Book.find({ ...keyword });
        res.json(books);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get similar books
// @route   GET /api/books/similar/:id
// @access  Public
router.get("/similar/:id", async (req, res) => {
    try {
        const currentBook = await Book.findById(req.params.id);

        if (!currentBook) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        // Heuristic matching: Same Genre > Same Tags > Same Author
        const similarBooks = await Book.find({
            _id: { $ne: currentBook._id }, // Exclude current book
            $or: [
                { genre: currentBook.genre },
                { tags: { $in: currentBook.tags } },
                { author: currentBook.author },
            ],
        })
            .limit(4);

        res.json(similarBooks);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
