import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Bell, Type, Clock, SortAsc, FileText, Palette, LayoutGrid, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsView = () => {
    const { isDark, toggleTheme } = useTheme();

    // Persist preferences in sessionStorage for per-tab isolation
    const [notifications, setNotifications] = useState(() => sessionStorage.getItem('pref_notifications') === 'true');
    const [fontSize, setFontSize] = useState(() => sessionStorage.getItem('pref_fontSize') || 'medium');
    const [autoSave, setAutoSave] = useState(() => sessionStorage.getItem('pref_autoSave') || '2');
    const [defaultView, setDefaultView] = useState(() => sessionStorage.getItem('pref_defaultView') || 'list');
    const [sortOrder, setSortOrder] = useState(() => sessionStorage.getItem('pref_sortOrder') || 'updated');
    const [spellCheck, setSpellCheck] = useState(() => sessionStorage.getItem('pref_spellCheck') !== 'false');

    const updatePref = (key, value, setter) => {
        sessionStorage.setItem(`pref_${key}`, value.toString());
        setter(value);
    };

    const Toggle = ({ enabled, onToggle }) => (
        <button
            onClick={onToggle}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${enabled
                ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30'
                : 'bg-gray-300 dark:bg-[#444]'
                }`}
        >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    );

    return (
        <div className="flex-1 bg-gray-50 dark:bg-[#141414] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 opacity-95" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0wLTR2LTJINDI0djJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

                <div className="relative px-4 sm:px-8 py-8">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            Settings
                        </h1>
                        <p className="text-white/60 text-sm mt-2 ml-[52px]">Customize your notes experience</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-5">

                {/* Appearance */}
                <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
                    <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-[#2a2a2a]">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Palette className="w-4 h-4 text-indigo-500" />
                            Appearance
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-[#2a2a2a]">
                        {/* Theme Toggle */}
                        <div className="px-5 sm:px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                    {isDark ? <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{isDark ? 'Dark Mode' : 'Light Mode'}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Switch between dark and light theme</div>
                                </div>
                            </div>
                            <Toggle enabled={isDark} onToggle={() => { toggleTheme(); toast.success(isDark ? 'Switched to Light Mode' : 'Switched to Dark Mode', { icon: isDark ? '☀️' : '🌙' }); }} />
                        </div>

                        {/* Font Size */}
                        <div className="px-5 sm:px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                                    <Type className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Font Size</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Default font size for notes editor</div>
                                </div>
                            </div>
                            <select
                                value={fontSize}
                                onChange={(e) => { updatePref('fontSize', e.target.value, setFontSize); toast.success(`Font size: ${e.target.value}`, { icon: '🔤' }); }}
                                className="px-3 py-1.5 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#444] rounded-lg text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                            >
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Editor Preferences */}
                <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
                    <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-[#2a2a2a]">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <AlignLeft className="w-4 h-4 text-indigo-500" />
                            Editor
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-[#2a2a2a]">
                        {/* Auto-save */}
                        <div className="px-5 sm:px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Auto-save Interval</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">How often notes are auto-saved</div>
                                </div>
                            </div>
                            <select
                                value={autoSave}
                                onChange={(e) => { updatePref('autoSave', e.target.value, setAutoSave); toast.success(`Auto-save: ${e.target.value}s`, { icon: '💾' }); }}
                                className="px-3 py-1.5 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#444] rounded-lg text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                            >
                                <option value="1">1 second</option>
                                <option value="2">2 seconds</option>
                                <option value="5">5 seconds</option>
                                <option value="10">10 seconds</option>
                            </select>
                        </div>

                        {/* Spell Check */}
                        <div className="px-5 sm:px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                    <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Spell Check</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Check spelling while typing</div>
                                </div>
                            </div>
                            <Toggle enabled={spellCheck} onToggle={() => { const val = !spellCheck; updatePref('spellCheck', val, setSpellCheck); toast.success(val ? 'Spell check enabled' : 'Spell check disabled', { icon: '✏️' }); }} />
                        </div>
                    </div>
                </div>

                {/* Notes Organization */}
                <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
                    <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-[#2a2a2a]">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4 text-indigo-500" />
                            Organization
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-[#2a2a2a]">
                        {/* Default View */}
                        <div className="px-5 sm:px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                                    <LayoutGrid className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Default View</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">How notes are displayed by default</div>
                                </div>
                            </div>
                            <select
                                value={defaultView}
                                onChange={(e) => { updatePref('defaultView', e.target.value, setDefaultView); toast.success(`Default view: ${e.target.value}`, { icon: '📋' }); }}
                                className="px-3 py-1.5 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#444] rounded-lg text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                            >
                                <option value="list">List View</option>
                                <option value="grid">Grid View</option>
                                <option value="compact">Compact View</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div className="px-5 sm:px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                                    <SortAsc className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Sort Notes By</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Default ordering of your notes</div>
                                </div>
                            </div>
                            <select
                                value={sortOrder}
                                onChange={(e) => { updatePref('sortOrder', e.target.value, setSortOrder); toast.success(`Sort by: ${e.target.value}`, { icon: '🔃' }); }}
                                className="px-3 py-1.5 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#444] rounded-lg text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                            >
                                <option value="updated">Last Updated</option>
                                <option value="created">Date Created</option>
                                <option value="title">Title (A-Z)</option>
                                <option value="title-desc">Title (Z-A)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden">
                    <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-[#2a2a2a]">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Bell className="w-4 h-4 text-indigo-500" />
                            Notifications
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-[#2a2a2a]">
                        <div className="px-5 sm:px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
                                    <Bell className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Get notified about shared notes and reminders</div>
                                </div>
                            </div>
                            <Toggle
                                enabled={notifications}
                                onToggle={() => {
                                    const newVal = !notifications;
                                    if (newVal && 'Notification' in window) {
                                        Notification.requestPermission().then(perm => {
                                            if (perm === 'granted') {
                                                updatePref('notifications', true, setNotifications);
                                                toast.success('Notifications enabled!', { icon: '🔔' });
                                            } else {
                                                toast.error('Browser blocked notifications. Please enable in browser settings.', { icon: '🔕' });
                                            }
                                        });
                                    } else {
                                        updatePref('notifications', newVal, setNotifications);
                                        toast.success(newVal ? 'Notifications on' : 'Notifications off', { icon: newVal ? '🔔' : '🔕' });
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
