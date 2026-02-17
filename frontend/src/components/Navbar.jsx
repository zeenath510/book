import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Debounced Search
    React.useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (search.trim()) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/books/advanced-search?q=${search}`);
                    const data = await res.json();
                    if (data.success) {
                        setSearchResults(data.data.slice(0, 5)); // Limit to 5 results
                        setShowDropdown(true);
                    }
                } catch (err) {
                    console.error("Search error:", err);
                }
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        }, 300); // 300ms delay

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            setShowDropdown(false);
            window.location.href = `/?search=${search}`;
        }
    };

    const handleResultClick = (bookId) => {
        setShowDropdown(false);
        setSearch("");
        navigate(`/book/${bookId}`);
    };

    return (
        <nav className="navbar" style={{ backgroundColor: "var(--navbar-bg)", padding: "1rem 2rem", boxShadow: "var(--shadow)", position: "relative", zIndex: 1000 }}>
            <div className="navbar-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
                <Link to="/" className="navbar-logo" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary-color)", textDecoration: "none" }}>
                    BookRecs
                </Link>

                <div style={{ flex: 1, maxWidth: "400px", margin: "0 2rem", position: "relative" }}>
                    <form onSubmit={handleSearch} style={{ display: "flex" }}>
                        <input
                            type="text"
                            placeholder="Search books..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => search.trim() && setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay to allow click
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                borderRadius: "4px 0 0 4px",
                                border: "1px solid var(--border-color)",
                                outline: "none",
                                color: "var(--text-color)",
                                backgroundColor: "var(--bg-color)"
                            }}
                        />
                        <button type="submit" style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "var(--primary-color)",
                            color: "white",
                            border: "none",
                            borderRadius: "0 4px 4px 0",
                            cursor: "pointer"
                        }}>
                            Search
                        </button>
                    </form>

                    {/* Live Search Dropdown */}
                    {showDropdown && searchResults.length > 0 && (
                        <div style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            backgroundColor: "var(--bg-color)", // Use theme bg
                            border: "1px solid var(--border-color)",
                            borderRadius: "0 0 4px 4px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            zIndex: 1001,
                            marginTop: "4px",
                            color: "var(--text-color)"
                        }}>
                            {searchResults.map((book) => (
                                <div
                                    key={book._id}
                                    onClick={() => handleResultClick(book._id)}
                                    style={{
                                        padding: "0.75rem",
                                        cursor: "pointer",
                                        borderBottom: "1px solid var(--border-color)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px"
                                        // Hover effect handled best with CSS classes, simplified inline here
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                >
                                    {book.coverImage && (
                                        <img src={`${import.meta.env.VITE_API_URL}${book.coverImage}`} alt={book.title} style={{ width: "30px", height: "45px", objectFit: "cover", borderRadius: "2px" }} />
                                    )}
                                    <div>
                                        <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{book.title}</div>
                                        <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>{book.author}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="navbar-links" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <Link to="/" style={{ color: "var(--text-color)", textDecoration: "none" }}>Home</Link>

                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin/dashboard" style={{ color: "var(--text-color)", textDecoration: "none" }}>Admin</Link>
                            )}
                            <Link to="/profile" style={{ color: "var(--text-color)", textDecoration: "none" }}>Profile</Link>
                            <button onClick={handleLogout} style={{ background: "none", border: "none", color: "var(--text-color)", cursor: "pointer", fontSize: "1rem" }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ color: "var(--text-color)", textDecoration: "none" }}>Login</Link>
                            <Link to="/register" style={{ color: "var(--text-color)", textDecoration: "none" }}>Register</Link>
                        </>
                    )}

                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-color)" }}
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
