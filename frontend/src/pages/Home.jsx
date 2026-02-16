import React, { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import Layout from "../components/Layout";
import SearchPanel from "../components/SearchPanel";
import { fetchBooks } from "../services/api"; // Keep for initial load

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSearchMode, setIsSearchMode] = useState(false);

    useEffect(() => {
        // Check URL params for basic search
        const params = new URLSearchParams(window.location.search);
        const query = params.get("search");

        if (query) {
            handleSearch({ q: query });
        } else {
            loadInitialBooks();
        }
    }, []);

    const loadInitialBooks = async () => {
        setLoading(true);
        try {
            const data = await fetchBooks();
            setBooks(data);
            setIsSearchMode(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (filters) => {
        setLoading(true);
        setIsSearchMode(true);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/books/advanced-search?${queryParams}`);
            const result = await res.json();

            if (result.success) {
                setBooks(result.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container" style={{ padding: "2rem" }}>

                <div style={{ marginBottom: "2rem", textAlign: "center" }}>
                    <h1 style={{ fontSize: "2.5rem", color: "var(--primary-color)", marginBottom: "0.5rem" }}>
                        Discover Your Next Favorite Book
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "var(--text-color)", opacity: 0.8 }}>
                        Explore our curated collection of top-rated books.
                    </p>
                </div>

                <SearchPanel onSearch={handleSearch} />

                {loading ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2rem" }}>
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} style={{ height: "300px", background: "var(--card-bg)", borderRadius: "8px", animation: "pulse 1.5s infinite" }}></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {isSearchMode && (
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                <h3>Search Results: {books.length} found</h3>
                                <button onClick={loadInitialBooks} style={{ background: "none", border: "1px solid var(--primary-color)", color: "var(--primary-color)", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}>
                                    Clear Search
                                </button>
                            </div>
                        )}

                        {books.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "4rem" }}>
                                <h3>No books found matching your criteria.</h3>
                            </div>
                        ) : (
                            <div className="book-grid">
                                {books.map((book) => (
                                    <div key={book._id} style={{ position: "relative" }}>
                                        <BookCard book={book} />
                                        {book.computedScore !== undefined && (
                                            <div style={{
                                                position: "absolute",
                                                top: "-10px",
                                                right: "-10px",
                                                background: "var(--secondary-color)",
                                                color: "white",
                                                padding: "0.2rem 0.6rem",
                                                borderRadius: "12px",
                                                fontSize: "0.8rem",
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                                zIndex: 5
                                            }}>
                                                Match: {book.computedScore.toFixed(0)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Home;
