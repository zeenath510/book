import React from 'react';
import Layout from '../components/Layout';

const AdminUsers = () => {
    // Placeholder data until we have a user fetch endpoint
    const users = [
        { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'User' },
        { _id: '2', name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
        { _id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    ];

    return (
        <Layout isAdmin={true}>
            <h1 style={{ marginBottom: '2rem' }}>Manage Users</h1>
            <div style={{ overflowX: 'auto', background: 'var(--card-bg)', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem' }}>ID</th>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>Role</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem' }}>{user._id}</td>
                                <td style={{ padding: '1rem' }}>{user.name}</td>
                                <td style={{ padding: '1rem' }}>{user.email}</td>
                                <td style={{ padding: '1rem' }}>{user.role}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button style={{ marginRight: '0.5rem', padding: '0.3rem 0.6rem', backgroundColor: 'var(--secondary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                                    <button style={{ padding: '0.3rem 0.6rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default AdminUsers;
