import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const sidebarStyle = {
        width: '250px',
        height: '100vh',
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border-color)',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'sticky',
        top: 0
    };

    const linkStyle = ({ isActive }) => ({
        textDecoration: 'none',
        color: isActive ? 'var(--primary-color)' : 'var(--text-color)',
        padding: '0.8rem 1rem',
        borderRadius: '4px',
        backgroundColor: isActive ? 'rgba(0,0,0,0.05)' : 'transparent',
        fontWeight: isActive ? 'bold' : 'normal'
    });

    return (
        <aside style={sidebarStyle}>
            <h3 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>Admin Panel</h3>
            <NavLink to="/admin/dashboard" style={linkStyle}>Dashboard</NavLink>
            <NavLink to="/admin/books" style={linkStyle}>Manage Books</NavLink>
            <NavLink to="/admin/users" style={linkStyle}>Manage Users</NavLink>
            <NavLink to="/admin/reports" style={linkStyle}>Reports</NavLink>
            <NavLink to="/" style={linkStyle}>Back to Home</NavLink>
        </aside>
    );
};

export default Sidebar;
