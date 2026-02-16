const Collection = require("../models/Collection");

// @desc    Create a collection
// @route   POST /api/collections
// @access  Private
const createCollection = async (req, res) => {
    const { name } = req.body;

    try {
        const existingCollection = await Collection.findOne({
            user: req.user._id,
            name,
        });

        if (existingCollection) {
            return res.status(400).json({ success: false, message: "Collection already exists" });
        }

        const collection = await Collection.create({
            user: req.user._id,
            name,
            books: [],
        });

        res.status(201).json({ success: true, data: collection });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get user collections
// @route   GET /api/collections
// @access  Private
const getCollections = async (req, res) => {
    try {
        const collections = await Collection.find({ user: req.user._id })
            .populate("books", "title coverImage author")
            .sort({ createdAt: -1 });

        res.json({ success: true, count: collections.length, data: collections });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a collection
// @route   DELETE /api/collections/:id
// @access  Private
const deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!collection) {
            return res.status(404).json({ success: false, message: "Collection not found" });
        }

        await collection.deleteOne();
        res.json({ success: true, message: "Collection deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add book to collection
// @route   POST /api/collections/:id/add-book
// @access  Private
const addBookToCollection = async (req, res) => {
    const { bookId } = req.body;

    try {
        const collection = await Collection.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!collection) {
            return res.status(404).json({ success: false, message: "Collection not found" });
        }

        if (collection.books.includes(bookId)) {
            return res.status(400).json({ success: false, message: "Book already in collection" });
        }

        collection.books.push(bookId);
        await collection.save();

        res.json({ success: true, data: collection });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Remove book from collection
// @route   DELETE /api/collections/:id/remove-book/:bookId
// @access  Private
const removeBookFromCollection = async (req, res) => {
    try {
        const collection = await Collection.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!collection) {
            return res.status(404).json({ success: false, message: "Collection not found" });
        }

        collection.books = collection.books.filter(
            (book) => book.toString() !== req.params.bookId
        );
        await collection.save();

        res.json({ success: true, data: collection });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCollection,
    getCollections,
    deleteCollection,
    addBookToCollection,
    removeBookFromCollection,
};
