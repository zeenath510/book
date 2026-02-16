import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, isAdmin = false }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {!isAdmin && <Navbar />}

            <div style={{ display: 'flex', flex: 1 }}>
                {isAdmin && <Sidebar />}
                <main style={{
                    flex: 1,
                    padding: '2rem',
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-color)'
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
