const path = require("path");
const fs = require("fs");
const Book = require("../models/Book");

// @desc    Upload book PDF
// @route   POST /api/books/upload/:id
// @access  Private/Admin
const uploadBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a file" });
        }

        book.fileUrl = `/uploads/${req.file.filename}`;
        await book.save();

        res.json({
            success: true,
            fileUrl: book.fileUrl,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Download book PDF
// @route   GET /api/books/download/:id
// @access  Private
const downloadBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        if (!book.fileUrl) {
            return res.status(404).json({ success: false, message: "No file attached to this book" });
        }

        // specific validatino for pwa
        const filePath = path.join(__dirname, "..", book.fileUrl);

        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).json({ success: false, message: "File not found on server" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { uploadBook, downloadBook };
