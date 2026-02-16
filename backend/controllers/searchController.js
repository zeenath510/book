const Book = require("../models/Book");
const Review = require("../models/Review");

// Helper to calculate score
const calculateScore = (book, query, rating) => {
    let score = 0;
    const q = query.toLowerCase();

    // Title Match (Weight 3)
    if (book.title.toLowerCase().includes(q)) score += 3;

    // Genre Match (Weight 2) - Normalized
    if (book.genre.toLowerCase() === q) score += 2;

    // Tag Overlap (Weight 2 per tag)
    // Assuming query might be a tag or contained in tags... 
    // Simplified: Check if query is in tags
    if (book.tags.some(tag => tag.toLowerCase().includes(q))) score += 2;

    // Rating (Weight 1)
    if (rating) {
        score += (rating * 1);
    }

    return score;
}

// @desc    Advanced Search with Ranking
// @route   GET /api/books/advanced-search
// @access  Public
const advancedSearch = async (req, res) => {
    const { q, genre, minRating, year, tags } = req.query;

    try {
        let query = {};

        // 1. Base Filtering
        if (q) {
            // using text index if available, or regex
            // Since we added text index, let's use $text for efficiency if query is complex, 
            // but strictly following logic: "Perform base Mongo query using filters" -> then score.
            // The prompt asks for "Score = (title match x 3)..." which implies post-processing or aggregate.
            // Let's use Regex for flexible matching to capture partials which $text might miss on standard config.
            query.$or = [
                { title: { $regex: q, $options: "i" } },
                { author: { $regex: q, $options: "i" } },
                { genre: { $regex: q, $options: "i" } },
                { tags: { $regex: q, $options: "i" } }
            ];
        }

        if (genre) query.genre = genre;
        if (year) query.publishYear = Number(year);
        if (tags) {
            const tagArray = tags.split(",");
            query.tags = { $in: tagArray };
        }

        // 2. Fetch Books
        const books = await Book.find(query).lean();

        // 3. Attach Ratings & Compute Score
        const booksWithScore = await Promise.all(books.map(async (book) => {
            const reviews = await Review.find({ book: book._id });
            const avgRating = reviews.length > 0
                ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                : 0;

            // Filter by minRating if specified
            if (minRating && avgRating < Number(minRating)) return null;

            let score = 0;
            const searchTerm = q ? q : "";

            // Scoring Logic
            if (searchTerm) {
                if (book.title.toLowerCase().includes(searchTerm.toLowerCase())) score += 3;
                if (book.genre.toLowerCase().includes(searchTerm.toLowerCase())) score += 2;
                if (book.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))) score += 2;
            }

            // Add Rating to Score
            score += avgRating;

            return { ...book, avgRating, computedScore: score };
        }));

        // 4. Filter nulls (from minRating) and Sort
        const results = booksWithScore
            .filter(b => b !== null)
            .sort((a, b) => b.computedScore - a.computedScore);

        res.json({ success: true, count: results.length, data: results });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Similar Books (Enhanced)
// @route   GET /api/books/similar/:id
// @access  Public
const getSimilarBooksEnhanced = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ success: false, message: "Book not found" });

        // Find match candidates: same genre OR common tags OR same author
        const candidates = await Book.find({
            _id: { $ne: book._id },
            $or: [
                { genre: book.genre },
                { author: book.author },
                { tags: { $in: book.tags } }
            ]
        }).lean();

        // Scoring
        // +2 same genre, +1 same author, +1 per matching tag
        const scoredCandidates = candidates.map(c => {
            let score = 0;
            if (c.genre === book.genre) score += 2;
            if (c.author === book.author) score += 1;

            const commonTags = c.tags.filter(tag => book.tags.includes(tag));
            score += commonTags.length; // +1 per tag

            return { ...c, similarityScore: score };
        });

        // Sort by score desc, take top 6
        const topBooks = scoredCandidates
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, 6);

        res.json(topBooks);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { advancedSearch, getSimilarBooksEnhanced };
