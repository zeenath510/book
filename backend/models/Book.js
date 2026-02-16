const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({ title: { type: String, required: true }, author: String, genre: String, publisher: String, publishYear: Number, language: String, pageCount: Number, isbn: { type: String, unique: true }, tags: [String], description: String, coverImage: String }, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
