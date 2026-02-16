import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Profile = () => {
    const { user, token } = useAuth();
    const { theme } = useTheme();
    const [profile, setProfile] = useState(null);
    const [genres, setGenres] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setProfile(data);
                setGenres(data.preferredGenres.join(", "));
            } catch (error) {
                console.error(error);
            }
        };

        if (token) fetchProfile();
    }, [token]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    preferredGenres: genres.split(",").map((g) => g.trim()),
                }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage("Profile updated successfully!");
                setProfile(data);
            } else {
                setMessage("Update failed");
            }
        } catch (error) {
            setMessage("Error updating profile");
        }
    };

    if (!profile) return <Layout><div>Loading...</div></Layout>;

    return (
        <Layout>
            <div className="container" style={{ maxWidth: "600px", margin: "2rem auto" }}>
                <h1 style={{ color: "var(--primary-color)" }}>User Profile</h1>
                <div className="card" style={{ padding: "2rem", background: "var(--card-bg)", borderRadius: "8px", marginTop: "1rem", boxShadow: "var(--shadow)" }}>
                    <div style={{ marginBottom: "1rem" }}>
                        <strong>Name:</strong> {profile.name}
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <strong>Email:</strong> {profile.email}
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <strong>Role:</strong> {profile.role}
                    </div>

                    <form onSubmit={handleUpdate}>
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem" }}>Preferred Genres (comma separated):</label>
                            <input
                                type="text"
                                value={genres}
                                onChange={(e) => setGenres(e.target.value)}
                                style={{ width: "100%", padding: "0.8rem", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                            />
                        </div>
                        <button type="submit" style={{ padding: "0.8rem 1.5rem", backgroundColor: "var(--primary-color)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                            Update Profile
                        </button>
                    </form>
                    {message && <p style={{ marginTop: "1rem", color: message.includes("success") ? "green" : "red" }}>{message}</p>}
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
