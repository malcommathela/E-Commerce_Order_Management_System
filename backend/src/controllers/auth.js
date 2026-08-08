import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { user } from '../models/user.js';
import { sendEmail } from '../utils/email.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const JWT_EXPIRES_IN = '7d';
const COOKIE_NAME = 'oms_session';

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function setAuthCookie(res, token) {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

function clearAuthCookie(res) {
    res.clearCookie(COOKIE_NAME);
}

export const signup = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, role } = req.body;

        if (!username || !email || !password || password.length < 6 || !firstName || !lastName) {
            return res.status(400).json({ success: false, message: 'Username, email, password (min 6 chars), firstName and lastName are required' });
        }

        const existingEmail = await user.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const existingUsername = await user.findByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const code = generateCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const userId = await user.create({
            username,
            email,
            passwordHash,
            firstName,
            lastName,
            role,
            verificationCode: code,
            verificationExpiresAt: expiresAt
        });

        res.status(201).json({
            success: true,
            message: 'Sign up successful! Check your email for the verification code.',
            userId
        });

        sendEmail(email, 'Your verification code', `Your verification code is: ${code}`)
            .catch(err => console.error('Email send error:', err));

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ success: false, message: 'Email and code are required' });
        }

        const existingUser = await user.findByEmail(email);
        if (!existingUser) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        if (existingUser.EMAIL_VERIFIED === 1) {
            return res.status(400).json({ success: false, message: 'Email already verified' });
        }

        if (!existingUser.VERIFICATION_CODE || !existingUser.VERIFICATION_EXPIRES_AT) {
            return res.status(400).json({ success: false, message: 'No verification code found' });
        }

        if (new Date(existingUser.VERIFICATION_EXPIRES_AT) < new Date()) {
            return res.status(400).json({ success: false, message: 'Verification code expired' });
        }

        if (String(existingUser.VERIFICATION_CODE) !== String(code)) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

        await user.verifyEmail(existingUser.USER_ID);
        res.json({ success: true, message: 'Email verified successfully' });

    } catch (err) {
        console.error('Verify error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const resendEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const existingUser = await user.findByEmail(email);
        if (!existingUser) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        if (existingUser.EMAIL_VERIFIED === 1) {
            return res.status(400).json({ success: false, message: 'Email already verified' });
        }

        if (existingUser.VERIFICATION_EXPIRES_AT) {
            const secondsSince = (Date.now() - new Date(existingUser.VERIFICATION_EXPIRES_AT).getTime()) / 1000;
            if (secondsSince < -540) {
                return res.status(429).json({ success: false, message: 'Please wait before requesting a new code' });
            }
        }

        const code = generateCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await user.updateVerificationCode(existingUser.USER_ID, code, expiresAt);
        res.json({ success: true, message: 'Verification code resent' });

        sendEmail(email, 'Your verification code', `Your verification code is: ${code}`)
            .catch(err => console.error('Resend email error:', err));

    } catch (err) {
        console.error('Resend error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const existingUser = await user.findByEmail(email);
        if (!existingUser) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, existingUser.PASSWORD_HASH);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (existingUser.EMAIL_VERIFIED !== 1) {
            return res.status(403).json({ success: false, message: 'Email not verified' });
        }

        if (existingUser.IS_ACTIVE !== 1) {
            return res.status(403).json({ success: false, message: 'Account deactivated' });
        }

        const token = signToken({
            userId: existingUser.USER_ID,
            email: existingUser.EMAIL,
            role: existingUser.ROLE
        });

        setAuthCookie(res, token);
        await user.updateLastLogin(existingUser.USER_ID);

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                userId: existingUser.USER_ID,
                username: existingUser.USERNAME,
                email: existingUser.EMAIL,
                firstName: existingUser.FIRST_NAME,
                lastName: existingUser.LAST_NAME,
                role: existingUser.ROLE
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const logout = (req, res) => {
    clearAuthCookie(res);
    res.json({ success: true, message: 'Logged out successfully' });
};

export const me = async (req, res) => {
    try {
        const existingUser = await user.findById(req.user.userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            user: {
                userId: existingUser.USER_ID,
                username: existingUser.USERNAME,
                email: existingUser.EMAIL,
                firstName: existingUser.FIRST_NAME,
                lastName: existingUser.LAST_NAME,
                role: existingUser.ROLE,
                emailVerified: existingUser.EMAIL_VERIFIED,
                isActive: existingUser.IS_ACTIVE,
                lastLoginAt: existingUser.LAST_LOGIN_AT
            }
        });
    } catch (err) {
        console.error('Me error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};