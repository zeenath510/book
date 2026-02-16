const express = require("express"); const Book = require("../models/Book");

const router = express.Router();

router.get("/", async (req, res) => { try { const books = await Book.find(); res.json(books); } catch (error) { res.status(500).json({ error: error.message }); } });

router.post("/", async (req, res) => { try { const book = await Book.create(req.body); res.status(201).json(book); } catch (error) { res.status(500).json({ error: error.message }); } });

module.exports = router;
