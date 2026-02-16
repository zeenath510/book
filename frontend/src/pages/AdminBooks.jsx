import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const AdminBooks = () => {
    const { token } = useAuth();
    const [books, setBooks] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/books`);
            const data = await res.json();
            setBooks(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUploadClick = (id) => {
        setSelectedBookId(id);
        setShowUploadModal(true);
        setMessage("");
        setFile(null);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const submitUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("bookFile", file);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/books/upload/${selectedBookId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setMessage("File uploaded successfully!");
                setTimeout(() => setShowUploadModal(false), 1500);
            } else {
                setMessage(data.message || "Upload failed");
            }
        } catch (error) {
            setMessage("Error uploading file");
            console.error(error);
        }
    };

    return (
        <Layout>
            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--primary-color)' }}>Manage Books</h1>
                    <button style={{ padding: '0.8rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add New Book</button>
                </div>

                <div style={{ overflowX: 'auto', background: 'var(--card-bg)', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-color)' }}>
                                <th style={{ padding: '1rem' }}>Cover</th>
                                <th style={{ padding: '1rem' }}>Title</th>
                                <th style={{ padding: '1rem' }}>Author</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map(book => (
                                <tr key={book._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <img src={book.coverImage || 'https://via.placeholder.com/50'} alt={book.title} style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-color)' }}>{book.title}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-color)' }}>{book.author}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => handleUploadClick(book._id)}
                                            style={{ marginRight: '0.5rem', padding: '0.3rem 0.6rem', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Upload PDF
                                        </button>
                                        <button style={{ marginRight: '0.5rem', padding: '0.3rem 0.6rem', backgroundColor: 'var(--secondary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                                        <button style={{ padding: '0.3rem 0.6rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showUploadModal && (
                    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                        <div style={{ background: "var(--card-bg)", padding: "2rem", borderRadius: "8px", minWidth: "300px" }}>
                            <h3 style={{ color: 'var(--text-color)' }}>Upload Book PDF</h3>
                            <form onSubmit={submitUpload}>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    style={{ margin: "1rem 0", display: "block" }}
                                />
                                {message && <p style={{ color: message.includes("success") ? "green" : "red", marginBottom: "1rem" }}>{message}</p>}
                                <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                                    <button type="button" onClick={() => setShowUploadModal(false)} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>Cancel</button>
                                    <button type="submit" style={{ background: "var(--primary-color)", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}>Upload</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AdminBooks;
