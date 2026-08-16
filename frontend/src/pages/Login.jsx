import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../api/auth';
import './Auth.css';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, loginUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (isAuthenticated) return <Navigate to="/" replace />;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiLogin(form);
            loginUser(res.data);
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (err) {
            setError(err || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-left">
                <div className="auth-form-wrap">
                    <div className="auth-brand">
                        <span className="auth-brand-icon">🛒</span>
                        <span className="auth-brand-text">OrderMgr</span>
                    </div>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to manage your orders and inventory</p>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-input-group">
                            <label>Email</label>
                            <input
                                type="email" name="email" value={form.email}
                                onChange={handleChange} required
                                placeholder="you@company.com" autoComplete="email"
                            />
                        </div>
                        <div className="auth-input-group">
                            <label>Password</label>
                            <input
                                type="password" name="password" value={form.password}
                                onChange={handleChange} required
                                placeholder="••••••••" autoComplete="current-password"
                            />
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
                    </p>
                </div>
            </div>
            <div className="auth-right">
                <div className="auth-hero-content">
                    <h2>Streamline Your<br />Order Management</h2>
                    <p>Track inventory, manage customers, and process orders — all in one place.</p>
                    <div className="auth-features">
                        <span className="auth-tag">📦 Orders</span>
                        <span className="auth-tag">📋 Inventory</span>
                        <span className="auth-tag">👥 Customers</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;