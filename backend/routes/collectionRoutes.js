const express = require("express");
const router = express.Router();
const {
    createCollection,
    getCollections,
    deleteCollection,
    addBookToCollection,
    removeBookFromCollection,
} = require("../controllers/collectionController");
const { verifyToken } = require("../middleware/authMiddleware");

router.route("/")
    .post(verifyToken, createCollection)
    .get(verifyToken, getCollections);

router.route("/:id")
    .delete(verifyToken, deleteCollection);

router.post("/:id/add-book", verifyToken, addBookToCollection);
router.delete("/:id/remove-book/:bookId", verifyToken, removeBookFromCollection);

module.exports = router;
