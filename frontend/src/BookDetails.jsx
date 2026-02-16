import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./App.css";

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL;
        fetch(`${API_URL}/books`) // Fetching all and filtering locally or fetching specific if endpoint exists. 
            // Note: The provided bookRoutes only has GET / (all) and POST /. There is no GET /:id in the provided routes.
            // I will stick to what the user provided, but for details page, we usually need GET /:id.
            // Since the user provided "Exact templates" and bookRoutes.js only has `router.get("/", ...)` I might need to add `router.get("/:id")` or filter on client side.
            // However, standard practice is to have a detail endpoint. 
            // I will CHECK bookRoutes.js content again.
            // The user provided structure:
            // router.get("/", ...);
            // router.post("/", ...);
            // NO router.get("/:id"). 
            // This is a missing feature in the "Exact template". 
            // I will assume I should add it OR fetch all and find. fetching all is inefficient but matches the "Exact template" if I strictly follow "Use them without modification".
            // BUT, the user said "Clean architecture". Fetching all for details is bad.
            // I will add the route to the backend later if possible, or just fetch all here for now.
            // actually, looking at the template, maybe I missed it?
            // No, `router.get("/", ...)` returns all.
            // I'll update the backend route to include get by id, OR I will assume the user wants me to add it.
            // User said: "Use them without modification".
            // Use them without modification implies I should NOT add the route.
            // So I will fetch ALL books and find the one with the ID. 
            .then(res => res.json())
            .then(data => {
                const found = data.find(b => b._id === id);
                if (found) {
                    setBook(found);
                } else {
                    setError("Book not found");
                }
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
                {book.coverImage && (
                    <div className="details-image">
                        <img
                            src={book.coverImage}
                            alt={book.title}
                        />
                    </div>
                )}
                <div className="details-info">
                    <h1>{book.title}</h1>
                    <h3>by {book.author}</h3>
                    <p className="meta">
                        <strong>Genre:</strong> {book.genre} | <strong>Year:</strong>{" "}
                        {book.publishYear}
                    </p>
                    <p className="description">{book.description}</p>
                    {/* Download link removed as file handling is not in the base template. 
                        If coverImage is just a string, we assume it's a URL.
                    */}
                    {/* <a href="#" className="download-btn">Download Book</a> */}
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
