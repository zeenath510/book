import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Collections = () => {
    const { token } = useAuth();
    const [collections, setCollections] = useState([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchCollections();
    }, [token]);

    const fetchCollections = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/collections`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) setCollections(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createCollection = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/collections`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name }),
            });
            const data = await res.json();
            if (data.success) {
                setCollections([data.data, ...collections]);
                setName("");
                setMessage("Collection created!");
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Error creating collection");
        }
    };

    const deleteCollection = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/collections/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setCollections(collections.filter((c) => c._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            <div className="container" style={{ padding: "2rem" }}>
                <h1 style={{ color: "var(--primary-color)" }}>My Collections</h1>

                <form onSubmit={createCollection} style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="New Collection Name"
                        required
                        style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                    />
                    <button type="submit" style={{ padding: "0.5rem 1rem", backgroundColor: "var(--primary-color)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                        Create
                    </button>
                </form>
                {message && <p style={{ marginBottom: "1rem", color: "green" }}>{message}</p>}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                    {collections.map((collection) => (
                        <div key={collection._id} style={{ background: "var(--card-bg)", padding: "1.5rem", borderRadius: "8px", boxShadow: "var(--shadow)", position: "relative" }}>
                            <button
                                onClick={() => deleteCollection(collection._id)}
                                style={{ position: "absolute", top: "10px", right: "10px", background: "none", border: "none", cursor: "pointer", color: "red" }}
                            >
                                🗑️
                            </button>
                            <h3>{collection.name}</h3>
                            <p>{collection.books.length} books</p>
                            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", overflowX: "auto" }}>
                                {collection.books.map((book) => (
                                    <Link key={book._id} to={`/book/${book._id}`}>
                                        <img
                                            src={book.coverImage || "https://via.placeholder.com/50x75"}
                                            alt={book.title}
                                            style={{ width: "50px", height: "75px", objectFit: "cover", borderRadius: "4px" }}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Collections;
