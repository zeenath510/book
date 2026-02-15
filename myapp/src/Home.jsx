import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/books")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch books");
                }
                return res.json();
            })
            .then((data) => {
                setBooks(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching books:", err);
                setError("Could not load books. Please try again later.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="container">Loading books...</div>;
    if (error) return <div className="container error">{error}</div>;

    return (
        <div className="container">
            <h1>Book Recommendations</h1>
            <div className="book-grid">
                {books.map((book) => (
                    <div key={book.bid} className="book-card">
                        {book.cover_image && (
                            <img
                                src={`http://localhost:3000${book.cover_image}`}
                                alt={book.title}
                                className="book-cover"
                            />
                        )}
                        <div className="book-info">
                            <h2>{book.title}</h2>
                            <p className="author">by {book.author}</p>
                            <Link to={`/book/${book.bid}`} className="details-link">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
