import api from './api';

const AUTH_URL = '/auth';

export const login = async (email, password) => {
    try {
        // Backend: POST /auth/login -> Returns String (Token)
        // Note: User prompt said "username", but LoginRequest.java has "email" and "password".
        // I must correct the frontend to send "email" instead of "username".
        const response = await api.post(`${AUTH_URL}/login`, { email, password });

        const token = response.data; // The string token
        if (token) {
            localStorage.setItem('token', token);
            // We need to get the user ID/Profile now because login only returned a token string.
            // Backend has GET /auth/me which returns User object.
            const meResponse = await api.get(`${AUTH_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const user = meResponse.data;
            if (user && user.id) {
                localStorage.setItem('userId', user.id);
                localStorage.setItem('username', user.username);
            }
            return user;
        }
        return null;
    } catch (error) {
        throw error;
    }
};

export const register = async (username, password, email) => {
    try {
        // Backend: POST /auth/register -> Returns User object
        const response = await api.post(`${AUTH_URL}/register`, { username, password, email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
};

export const getCurrentUser = () => {
    const id = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if (!id) return null;
    return { id, username };
};
