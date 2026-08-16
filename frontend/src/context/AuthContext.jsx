import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, logout as apiLogout } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const res = await getMe();
                setUser(res.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const loginUser = (userData) => setUser(userData);

    const logout = async () => {
        try {
            await apiLogout();
        } catch (e) {
            console.error(e);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);