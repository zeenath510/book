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

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            // Simple client-side redirect to a search results page (to be implemented fully or query param)
            // For now, let's just log or maybe filter home if we had a context. 
            // Instructions said endpoint is /api/books/search?q=...
            // We probably need a SearchResults page or pass query to Home. 
            // For Ph3 step 4, we just made the endpoint. 
            // I will navigate to home with query param ?search=... and handle it there, or a new page.
            // Let's keep it simple: navigate to /?search=keyword
            window.location.href = `/?search=${search}`;
        }
    };

    return (
        <nav className="navbar" style={{ backgroundColor: "var(--navbar-bg)", padding: "1rem 2rem", boxShadow: "var(--shadow)" }}>
            <div className="navbar-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
                <Link to="/" className="navbar-logo" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary-color)", textDecoration: "none" }}>
                    BookRecs
                </Link>

                <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: "400px", margin: "0 2rem", display: "flex" }}>
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "0.5rem",
                            borderRadius: "4px 0 0 4px",
                            border: "1px solid var(--border-color)",
                            outline: "none"
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
