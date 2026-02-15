import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./App.css";

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/books/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch book details");
                }
                return res.json();
            })
            .then((data) => {
                setBook(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching book:", err);
                setError("Could not load book details.");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="container">Loading details...</div>;
    if (error) return <div className="container error">{error}</div>;
    if (!book) return <div className="container">Book not found</div>;

    return (
        <div className="container book-details-page">
            <Link to="/" className="back-link">
                &larr; Back to Home
            </Link>
            <div className="details-content">
                {book.cover_image && (
                    <div className="details-image">
                        <img
                            src={`http://localhost:3000${book.cover_image}`}
                            alt={book.title}
                        />
                    </div>
                )}
                <div className="details-info">
                    <h1>{book.title}</h1>
                    <h3>by {book.author}</h3>
                    <p className="meta">
                        <strong>Genre:</strong> {book.genre} | <strong>Year:</strong>{" "}
                        {book.published_year}
                    </p>
                    <p className="description">{book.description}</p>
                    <a
                        href={`http://localhost:3000/books/download/${book.bid}`}
                        className="download-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download Book
                    </a>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
