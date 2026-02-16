import React, { useState } from 'react';

const SearchPanel = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        q: "",
        genre: "",
        minRating: "",
        year: "",
        tags: ""
    });

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    return (
        <form onSubmit={handleSubmit} style={{
            background: "var(--card-bg)",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            boxShadow: "var(--shadow)",
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"
        }}>
            <input
                name="q"
                placeholder="Keywords..."
                value={filters.q}
                onChange={handleChange}
                style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--border-color)" }}
            />
            <select name="genre" value={filters.genre} onChange={handleChange} style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--border-color)" }}>
                <option value="">All Genres</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery">Mystery</option>
            </select>
            <input
                name="year"
                type="number"
                placeholder="Year"
                value={filters.year}
                onChange={handleChange}
                style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--border-color)" }}
            />
            <select name="minRating" value={filters.minRating} onChange={handleChange} style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--border-color)" }}>
                <option value="">Min Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
            </select>
            <input
                name="tags"
                placeholder="Tags (comma separated)"
                value={filters.tags}
                onChange={handleChange}
                style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--border-color)" }}
            />
            <button type="submit" style={{
                padding: "0.5rem 1rem",
                backgroundColor: "var(--primary-color)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                gridColumn: "1 / -1"
            }}>
                Search
            </button>
        </form>
    );
};

export default SearchPanel;
