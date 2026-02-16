const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        books: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book",
            },
        ],
    },
    { timestamps: true }
);

// Ensure unique collection names per user
collectionSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Collection", collectionSchema);
