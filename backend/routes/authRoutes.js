const express = require("express");
const router = express.Router();
const { registerUser, loginUser, setupAdmin } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/setup-admin", setupAdmin);

module.exports = router;
