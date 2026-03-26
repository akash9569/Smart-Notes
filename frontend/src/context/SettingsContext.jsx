import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    // Read from localStorage with defaults
    const [fontSize, setFontSizeState] = useState(() => localStorage.getItem('app_fontSize') || 'medium');
    const [autoSaveInterval, setAutoSaveIntervalState] = useState(() => localStorage.getItem('app_autoSaveInterval') || '2');
    const [spellCheck, setSpellCheckState] = useState(() => localStorage.getItem('app_spellCheck') !== 'false');
    const [defaultView, setDefaultViewState] = useState(() => localStorage.getItem('app_defaultView') || 'list');
    const [sortOrder, setSortOrderState] = useState(() => localStorage.getItem('app_sortOrder') || 'updated');
    const [pushNotifications, setPushNotificationsState] = useState(() => localStorage.getItem('app_pushNotifications') === 'true');

    // Wrappers to update state and localStorage simultaneously
    const setFontSize = (value) => {
        setFontSizeState(value);
        localStorage.setItem('app_fontSize', value);
    };

    const setAutoSaveInterval = (value) => {
        setAutoSaveIntervalState(value);
        localStorage.setItem('app_autoSaveInterval', value);
    };

    const setSpellCheck = (value) => {
        setSpellCheckState(value);
        localStorage.setItem('app_spellCheck', value.toString());
    };

    const setDefaultView = (value) => {
        setDefaultViewState(value);
        localStorage.setItem('app_defaultView', value);
    };

    const setSortOrder = (value) => {
        setSortOrderState(value);
        localStorage.setItem('app_sortOrder', value);
    };

    const setPushNotifications = (value) => {
        setPushNotificationsState(value);
        localStorage.setItem('app_pushNotifications', value.toString());
    };

    const value = {
        fontSize, setFontSize,
        autoSaveInterval, setAutoSaveInterval,
        spellCheck, setSpellCheck,
        defaultView, setDefaultView,
        sortOrder, setSortOrder,
        pushNotifications, setPushNotifications
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
