import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup as apiSignup } from '../api/auth';
import './Auth.css';

const Signup = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) return <Navigate to="/" replace />;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiSignup(form);
            navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
        } catch (err) {
            setError(err || 'Signup failed');
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
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Get started with your order management system</p>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-row">
                            <div className="auth-input-group">
                                <label>First Name</label>
                                <input name="first_name" value={form.first_name} onChange={handleChange} required />
                            </div>
                            <div className="auth-input-group">
                                <label>Last Name</label>
                                <input name="last_name" value={form.last_name} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="auth-input-group">
                            <label>Username</label>
                            <input name="username" value={form.username} onChange={handleChange} required />
                        </div>
                        <div className="auth-input-group">
                            <label>Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="auth-input-group">
                            <label>Password</label>
                            <input
                                type="password" name="password" value={form.password}
                                onChange={handleChange} required minLength={6}
                            />
                        </div>

                        {error && <div className="auth-error">{error}</div>}

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Creating account…' : 'Create Account'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                    </p>
                </div>
            </div>
            <div className="auth-right">
                <div className="auth-hero-content">
                    <h2>Join Thousands of<br />Businesses</h2>
                    <p>Start managing your e-commerce operations efficiently today.</p>
                    <div className="auth-features">
                        <span className="auth-tag">🚀 Fast Setup</span>
                        <span className="auth-tag">🔒 Secure</span>
                        <span className="auth-tag">📊 Analytics</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;