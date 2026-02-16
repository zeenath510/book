import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        const res = await login(email, password);
        if (res.success) {
            // Redirect based on role is handled in ProtectedRoute usually but user object might not be updated immediately in component state
            // We can check local storage or rely on AuthContext if it returns user
            // Re-reading user from context here might be stale closure, but let's see. 
            // Better to redirect to home and let protected route or Navbar handle role visibility.
            const user = JSON.parse(localStorage.getItem("user"));
            if (user?.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } else {
            setLocalError(res.message);
        }
    };

    return (
        <Layout>
            <div className="container" style={{ maxWidth: '400px', margin: '2rem auto' }}>
                <div className="card" style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Login</h2>
                    {localError && <div className="error" style={{ marginBottom: '1rem', textAlign: 'center' }}>{localError}</div>}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                                required
                            />
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '0.8rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Login
                        </button>
                    </form>
                    <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Register</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
