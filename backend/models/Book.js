const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        genre: {
            type: String,
            required: true,
        },
        publisher: String,
        publishYear: Number,
        language: String,
        pageCount: Number,
        isbn: {
            type: String,
            unique: true,
        },
        tags: [String],
        description: String,
        coverImage: String,
        fileUrl: String,
    },
    { timestamps: true }
);

// Add text index for advanced search
bookSchema.index({ title: "text", author: "text", genre: "text", tags: "text" });

module.exports = mongoose.model("Book", bookSchema);
