import api from './apiService';

export const login = (credentials) => api.post('/auth/login', credentials);
export const signup = (data) => api.post('/auth/signup', data);
export const verifyEmail = (data) => api.post('/auth/verify-email', data);
export const resendEmail = (data) => api.post('/auth/resend-email', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');