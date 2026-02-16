const express = require("express");
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

router
    .route("/profile")
    .get(verifyToken, getUserProfile)
    .put(verifyToken, updateUserProfile);

module.exports = router;
