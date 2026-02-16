import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HTMLFlipBook from "react-pageflip";
import { pdfjs, Document, Page } from "react-pdf";
import { getOfflineBook, saveBookOffline, isBookOffline } from "../services/offlineStorage";
import { useAuth } from "../context/AuthContext";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set worker 
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const Reader = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [numPages, setNumPages] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(false);
    const bookRef = useRef();

    useEffect(() => {
        const loadBook = async () => {
            try {
                setLoading(true);
                // Check offline first
                const offlineBlob = await getOfflineBook(id);

                if (offlineBlob) {
                    setFile(offlineBlob);
                    setIsOffline(true);
                    setLoading(false);
                    return;
                }

                // Fetch properties to get URL (or directly download if we know route)
                // We need the book details first to get file URL or just try download endpoint
                // Let's try download endpoint directly which streams the file
                const response = await fetch(`${import.meta.env.VITE_API_URL}/books/download/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error("Failed to download book");

                const blob = await response.blob();
                setFile(blob);
                setLoading(false);

            } catch (error) {
                console.error("Error loading book:", error);
                setLoading(false);
            }
        };

        if (token) loadBook();
    }, [id, token]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleSaveOffline = async () => {
        if (file) {
            await saveBookOffline(id, file);
            setIsOffline(true);
            alert("Book saved for offline reading!");
        }
    };

    if (loading) return <div style={{ color: "white", padding: "2rem" }}>Loading Book...</div>;
    if (!file) return <div style={{ color: "white", padding: "2rem" }}>Could not load book. Ensure it has been uploaded.</div>;

    return (
        <div style={{ height: "100vh", background: "#333", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>

            {/* Controls */}
            <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10, display: "flex", gap: "1rem" }}>
                {!isOffline && (
                    <button onClick={handleSaveOffline} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
                        💾 Save Offline
                    </button>
                )}
                <button onClick={() => navigate(-1)} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
                    ❌ Close
                </button>
            </div>

            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div style={{ color: "white" }}>Loading PDF...</div>}
            >
                <HTMLFlipBook
                    width={400}
                    height={600}
                    showCover={true}
                    ref={bookRef}
                >
                    {/* Pages - Generating pages based on numPages */}
                    {Array.from(new Array(numPages), (el, index) => (
                        <div key={`page_${index + 1}`} className="page" style={{ background: "white", padding: "10px" }}>
                            <Page
                                pageNumber={index + 1}
                                width={400}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                            />
                            <div style={{ textAlign: "center", marginTop: "10px", fontSize: "12px", color: "#666" }}>
                                Page {index + 1}
                            </div>
                        </div>
                    ))}
                </HTMLFlipBook>
            </Document>
        </div>
    );
};

export default Reader;
