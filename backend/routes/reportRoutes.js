const express = require("express");
const router = express.Router();
const {
    createReport,
    getReports,
    resolveReport,
} = require("../controllers/reportController");
const { verifyToken, adminOnly } = require("../middleware/authMiddleware");

router.route("/").post(verifyToken, createReport).get(verifyToken, adminOnly, getReports);
router.route("/:id/resolve").put(verifyToken, adminOnly, resolveReport);

module.exports = router;
