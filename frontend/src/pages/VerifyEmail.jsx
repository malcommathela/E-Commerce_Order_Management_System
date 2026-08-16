import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail, resendEmail } from '../api/auth';
import './Auth.css';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const inputsRef = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) setError('No email provided. Please start from signup.');
    }, [email]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        setError('');
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newCode = [...code];
        paste.split('').forEach((char, i) => { if (i < 6) newCode[i] = char; });
        setCode(newCode);
        const nextEmpty = newCode.findIndex((c) => !c);
        const focusIndex = nextEmpty === -1 ? 5 : nextEmpty;
        setTimeout(() => inputsRef.current[focusIndex]?.focus(), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullCode = code.join('');
        if (fullCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }
        setLoading(true);
        try {
            await verifyEmail({ email, code: fullCode });
            setMessage('Email verified! Redirecting to login…');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err || 'Invalid code');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) return;
        setLoading(true);
        try {
            await resendEmail({ email });
            setMessage('New code sent!');
            setError('');
        } catch (err) {
            setError(err || 'Failed to resend');
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
                    <h1 className="auth-title">Verify Your Email</h1>
                    <p className="auth-subtitle">
                        Enter the 6-digit code sent to<br />
                        <strong style={{ color: '#111827' }}>{email}</strong>
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="code-inputs">
                            {code.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => (inputsRef.current[i] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    onPaste={handlePaste}
                                    className="code-input"
                                />
                            ))}
                        </div>

                        {error && <div className="auth-error">{error}</div>}
                        {message && <div className="auth-success">{message}</div>}

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Verifying…' : 'Verify Email'}
                        </button>
                    </form>

                    <button onClick={handleResend} className="auth-resend" disabled={loading}>
                        Resend Code
                    </button>
                </div>
            </div>
            <div className="auth-right">
                <div className="auth-hero-content">
                    <h2>Almost There</h2>
                    <p>Verify your email to secure your account and get full access to the dashboard.</p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;