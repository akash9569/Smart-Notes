import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        // Use sessionStorage for per-tab theme isolation
        const saved = sessionStorage.getItem('theme');
        if (saved) return saved === 'dark';
        // Fallback: check if localStorage has a preference (from before), then system
        const global = localStorage.getItem('theme');
        if (global) return global === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            sessionStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            sessionStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
