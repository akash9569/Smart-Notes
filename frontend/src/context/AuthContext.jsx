import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const response = await authAPI.getMe();
                setUser(response.data.data.user);
                localStorage.setItem('cached_user', JSON.stringify(response.data.data.user));
                // Ensure we are in ONLINE mode if successful
                localStorage.removeItem('isOfflineMode');
            } else {
                checkOfflineAuth();
            }
        } catch (error) {
            console.error('Auth check failed:', error);

            // Check if it's an Authentication Error (401)
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
                // Redirect to login handled by ProtectedRoute
            } else {
                // Must be a Network Error or Server Error (5xx)
                // Switch to Offline Mode but KEEP TOKENS for retry next time
                if (!localStorage.getItem('isOfflineMode')) {
                    const cachedUser = localStorage.getItem('cached_user');
                    if (cachedUser) {
                        const user = JSON.parse(cachedUser);
                        setUser({ ...user, isOffline: true });
                        localStorage.setItem('isOfflineMode', 'true');
                        toast.success('Backend unreachable. Switched to offline mode.');
                        return; // Successfully switched to offline, don't clear user
                    }
                    toast.error('Backend unreachable. Please login offline.');
                }
                checkOfflineAuth();
            }
        } finally {
            setLoading(false);
        }
    };

    const checkOfflineAuth = () => {
        const isOffline = localStorage.getItem('isOfflineMode') === 'true';
        if (isOffline) {
            const cachedUser = localStorage.getItem('cached_user');
            if (cachedUser) {
                setUser({ ...JSON.parse(cachedUser), isOffline: true });
            } else {
                setUser({
                    _id: 'offline_user',
                    name: 'Akash (Offline)',
                    email: 'akash@gmail.com',
                    isOffline: true
                });
            }
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { user, accessToken, refreshToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('cached_user', JSON.stringify(user));
            localStorage.removeItem('isOfflineMode'); // Ensure we clear offline mode on real login
            setUser(user);
            return user;
        } catch (error) {
            // Fallback for specific offline credentials
            if (email === 'akash@gmail.com' && password === '123456') {
                const offlineUser = {
                    _id: 'offline_user',
                    name: 'Akash (Offline)',
                    email: 'akash@gmail.com',
                    isOffline: true
                };
                localStorage.setItem('isOfflineMode', 'true');
                localStorage.setItem('cached_user', JSON.stringify(offlineUser));
                setUser(offlineUser);
                return offlineUser;
            }
            throw error;
        }
    };

    const signup = async (name, email, password) => {
        const response = await authAPI.signup({ name, email, password });
        const { user, accessToken, refreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.removeItem('isOfflineMode');
        setUser(user);
        return user;
    };

    const sendOtp = async (email) => {
        const response = await authAPI.forgotPassword({ email });
        return response.data;
    };

    const verifyOtp = async (email, otp) => {
        const response = await authAPI.verifyOtp({ email, otp });
        return response.data;
    };

    const resetPassword = async (email, otp, password) => {
        const response = await authAPI.resetPassword({ email, otp, password });
        const { user: updatedUser, accessToken, refreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('cached_user', JSON.stringify(updatedUser));
        localStorage.removeItem('isOfflineMode');
        setUser(updatedUser);
        return updatedUser;
    };

    const logout = async () => {
        try {
            if (!user?.isOffline) {
                await authAPI.logout();
            }
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('isOfflineMode');
            setUser(null);
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    // Auto-logout after 45 mins of inactivity
    useEffect(() => {
        let inactivityTimer;

        const handleActivity = () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            if (user) {
                // 45 minutes in milliseconds
                inactivityTimer = setTimeout(() => {
                    logout();
                    toast('Logged out due to inactivity', { icon: '⏲️', duration: 5000 });
                }, 45 * 60 * 1000);
            }
        };

        if (user) {
            handleActivity(); // Start timer initially
            window.addEventListener('mousemove', handleActivity);
            window.addEventListener('keydown', handleActivity);
            window.addEventListener('mousedown', handleActivity);
            window.addEventListener('touchstart', handleActivity);
            window.addEventListener('scroll', handleActivity);
        }

        return () => {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('mousedown', handleActivity);
            window.removeEventListener('touchstart', handleActivity);
            window.removeEventListener('scroll', handleActivity);
        };
        // We omit logout from dependencies intentionally to avoid re-binding on every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, sendOtp, verifyOtp, resetPassword, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
