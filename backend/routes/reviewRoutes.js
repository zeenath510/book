const express = require("express");
const router = express.Router();
const { addReview, getReviews } = require("../controllers/reviewController");
const { verifyToken } = require("../middleware/authMiddleware");

router.route("/:bookId").post(verifyToken, addReview).get(getReviews);

module.exports = router;
