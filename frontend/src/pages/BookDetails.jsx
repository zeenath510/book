import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import BookCard from "../components/BookCard";
import "../App.css";

const BookDetails = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [similarBooks, setSimilarBooks] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [reportReason, setReportReason] = useState("");
    const [showReportModal, setShowReportModal] = useState(false);
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch Book
                const bookRes = await fetch(`${import.meta.env.VITE_API_URL}/books/${id}`);
                const bookData = await bookRes.json();
                setBook(bookData);

                // Fetch Reviews
                const reviewRes = await fetch(`${import.meta.env.VITE_API_URL}/reviews/${id}`);
                const reviewData = await reviewRes.json();
                if (reviewData.success) setReviews(reviewData.data);

                // Fetch Similar
                const similarRes = await fetch(`${import.meta.env.VITE_API_URL}/books/similar/${id}`);
                const similarData = await similarRes.json();
                setSimilarBooks(similarData);

                if (token) {
                    const collRes = await fetch(`${import.meta.env.VITE_API_URL}/collections`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const collData = await collRes.json();
                    if (collData.success) setCollections(collData.data);
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id, token]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ rating, comment }),
            });
            const data = await res.json();
            if (data.success) {
                setReviews([data.data, ...reviews]);
                setMessage("Review added!");
                setComment("");
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Error submitting review");
        }
    };

    const handleReport = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/reports`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    targetType: "book",
                    targetId: id,
                    reason: reportReason
                })
            });
            const data = await res.json();
            if (data.success) {
                setMessage("Report submitted.");
                setShowReportModal(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleAddToCollection = async (collectionId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/collections/${collectionId}/add-book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ bookId: id })
            });
            const data = await res.json();
            if (data.success) {
                setMessage("Added to collection!");
                setShowCollectionModal(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) return <Layout><div>Loading...</div></Layout>;
    if (!book) return <Layout><div>Book not found</div></Layout>;

    return (
        <Layout>
            <div className="container" style={{ padding: "2rem" }}>
                <Link to="/" style={{ textDecoration: "none", color: "var(--primary-color)" }}>← Back</Link>
                <div style={{ display: "flex", gap: "2rem", marginTop: "1rem", flexWrap: "wrap" }}>
                    <img src={book.coverImage || "https://via.placeholder.com/300x450"} alt={book.title} style={{ maxWidth: "300px", borderRadius: "8px" }} />
                    <div style={{ flex: 1 }}>
                        <h1 style={{ color: "var(--primary-color)" }}>{book.title}</h1>
                        <p><strong>Author:</strong> {book.author}</p>
                        <p><strong>Genre:</strong> {book.genre}</p>
                        <p><strong>Year:</strong> {book.publishYear}</p>
                        <p style={{ marginTop: "1rem" }}>{book.description}</p>

                        <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                            <button
                                onClick={() => navigate(`/read/${id}`)}
                                style={{ padding: "0.8rem 1.5rem", background: "var(--primary-color)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" }}
                            >
                                📖 Read Book
                            </button>
                            <button
                                onClick={() => setShowCollectionModal(true)}
                                style={{ padding: "0.8rem 1.5rem", background: "white", color: "var(--primary-color)", border: "2px solid var(--primary-color)", borderRadius: "4px", cursor: "pointer", fontSize: "1rem" }}
                            >
                                ➕ Add to Collection
                            </button>
                        </div>

                        <button
                            onClick={() => setShowReportModal(true)}
                            style={{ marginTop: "1rem", background: "none", color: "red", border: "none", padding: "0", cursor: "pointer", fontSize: "0.9rem", textDecoration: "underline" }}
                        >
                            Report Book
                        </button>
                    </div>
                </div>

                {/* Similar Books */}
                <div style={{ marginTop: "3rem" }}>
                    <h3>You might also like</h3>
                    <div className="book-grid">
                        {similarBooks.map(b => <BookCard key={b._id} book={b} />)}
                    </div>
                </div>

                {/* Reviews Section */}
                <div style={{ marginTop: "3rem" }}>
                    <h3>Reviews</h3>
                    {user && (
                        <form onSubmit={handleSubmitReview} style={{ marginBottom: "2rem", background: "var(--card-bg)", padding: "1rem", borderRadius: "8px" }}>
                            <h4>Write a Review</h4>
                            <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: "0.5rem", marginRight: "1rem" }}>
                                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                            </select>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                required
                                style={{ width: "100%", height: "80px", marginTop: "0.5rem", padding: "0.5rem" }}
                            />
                            <button type="submit" style={{ marginTop: "0.5rem", padding: "0.5rem 1rem", backgroundColor: "var(--primary-color)", color: "white", border: "none", cursor: "pointer" }}>
                                Submit Review
                            </button>
                            {message && <p>{message}</p>}
                        </form>
                    )}

                    <div>
                        {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map((review) => (
                            <div key={review._id} style={{ background: "var(--card-bg)", padding: "1rem", marginBottom: "1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <strong>{review.user?.name || "User"}</strong>
                                    <span style={{ color: "orange" }}>{"★".repeat(review.rating)}</span>
                                </div>
                                <p style={{ marginTop: "0.5rem" }}>{review.comment}</p>
                                <small style={{ color: "gray" }}>{new Date(review.createdAt).toLocaleDateString()}</small>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Report Modal */}
                {showReportModal && (
                    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                        <div style={{ background: "var(--card-bg)", padding: "2rem", borderRadius: "8px", minWidth: "300px" }}>
                            <h3>Report Book</h3>
                            <textarea
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                placeholder="Reason for reporting..."
                                style={{ width: "100%", height: "100px", margin: "1rem 0" }}
                            />
                            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                                <button onClick={() => setShowReportModal(false)}>Cancel</button>
                                <button onClick={handleReport} style={{ background: "red", color: "white", border: "none", padding: "0.5rem 1rem" }}>Submit</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Collection Modal */}
                {showCollectionModal && (
                    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                        <div style={{ background: "var(--card-bg)", padding: "2rem", borderRadius: "8px", minWidth: "300px" }}>
                            <h3>Add to Collection</h3>
                            {collections.length === 0 ? (
                                <p>No collections found. <Link to="/collections">Create one</Link></p>
                            ) : (
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    {collections.map(c => (
                                        <li key={c._id} style={{ margin: "0.5rem 0" }}>
                                            <button
                                                onClick={() => handleAddToCollection(c._id)}
                                                style={{ width: "100%", padding: "0.5rem", textAlign: "left", cursor: "pointer" }}
                                            >
                                                {c.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button onClick={() => setShowCollectionModal(false)} style={{ marginTop: "1rem", width: "100%" }}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BookDetails;
