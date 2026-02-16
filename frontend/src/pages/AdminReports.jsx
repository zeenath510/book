import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const AdminReports = () => {
    const { token } = useAuth();
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/reports`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (data.success) {
                    setReports(data.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchReports();
    }, [token]);

    const handleResolve = async (id, status) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/reports/${id}/resolve`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (data.success) {
                setReports(reports.map((r) => (r._id === id ? { ...r, status } : r)));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            <div className="container" style={{ padding: "2rem" }}>
                <h1 style={{ color: "var(--primary-color)", marginBottom: "1.5rem" }}>Content Reports</h1>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--card-bg)" }}>
                        <thead>
                            <tr style={{ background: "var(--primary-color)", color: "white" }}>
                                <th style={{ padding: "1rem", textAlign: "left" }}>Reporter</th>
                                <th style={{ padding: "1rem", textAlign: "left" }}>Target Type</th>
                                <th style={{ padding: "1rem", textAlign: "left" }}>Reason</th>
                                <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
                                <th style={{ padding: "1rem", textAlign: "left" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report._id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                                    <td style={{ padding: "1rem" }}>{report.reporter?.name || "Unknown"}</td>
                                    <td style={{ padding: "1rem" }}>{report.targetType}</td>
                                    <td style={{ padding: "1rem" }}>{report.reason}</td>
                                    <td style={{ padding: "1rem" }}>
                                        <span style={{
                                            padding: "0.25rem 0.5rem",
                                            borderRadius: "4px",
                                            background: report.status === "resolved" ? "green" : report.status === "dismissed" ? "gray" : "orange",
                                            color: "white",
                                            fontSize: "0.8rem"
                                        }}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "1rem" }}>
                                        {report.status === "pending" && (
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <button
                                                    onClick={() => handleResolve(report._id, "resolved")}
                                                    style={{ padding: "0.5rem", background: "green", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                                >
                                                    Resolve
                                                </button>
                                                <button
                                                    onClick={() => handleResolve(report._id, "dismissed")}
                                                    style={{ padding: "0.5rem", background: "red", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default AdminReports;
