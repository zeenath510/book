const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({ name: { type: String, required: true }, email: { type: String, required: true, unique: true }, contactNumber: String, password: { type: String, required: true }, preferredGenre: String, role: { type: String, default: "user" } }, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
