import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { fetchBooks } from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0 // Mocked for now potentially
    });

    useEffect(() => {
        fetchBooks().then(data => {
            setStats(prev => ({ ...prev, totalBooks: data.length }));
        }).catch(err => console.error(err));
        // Mock user count or fetch if endpoint exists
        setStats(prev => ({ ...prev, totalUsers: 5 })); // Placeholder as per Phase 1 instruction to fetch dynamic (Books fetch works)
    }, []);

    const cardStyle = {
        background: 'var(--card-bg)',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: 'var(--shadow)',
        flex: 1,
        textAlign: 'center',
        minWidth: '200px'
    };

    return (
        <Layout isAdmin={true}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={cardStyle}>
                    <h3 style={{ color: 'var(--text-color)' }}>Total Books</h3>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)', margin: '1rem 0' }}>{stats.totalBooks}</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={{ color: 'var(--text-color)' }}>Total Users</h3>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--secondary-color)', margin: '1rem 0' }}>{stats.totalUsers}</p>
                </div>
                {/* Additional cards could go here */}
            </div>
        </Layout>
    );
};

export default AdminDashboard;
