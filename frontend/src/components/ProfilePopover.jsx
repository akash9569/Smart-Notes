import React, { useRef, useEffect, useState } from 'react';
import {
    Settings,
    Bell,
    HelpCircle,
    LogOut,
    ChevronRight,
    MessageCircle,
    FileText,
    ExternalLink,
    Keyboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePopover = ({ isOpen, onClose, anchorRef, onNavigate }) => {
    const { user, logout } = useAuth();
    const popoverRef = useRef(null);
    const [showHelpMenu, setShowHelpMenu] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target) &&
                anchorRef.current && !anchorRef.current.contains(event.target)) {
                onClose();
                setShowHelpMenu(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, anchorRef]);

    useEffect(() => {
        if (!isOpen) setShowHelpMenu(false);
    }, [isOpen]);

    if (!isOpen) return null;

    const positionStyle = anchorRef.current
        ? {
            bottom: '60px',
            left: '12px',
            width: '280px'
        }
        : {};

    return (
        <div
            ref={popoverRef}
            className="absolute z-50 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-xl shadow-2xl text-gray-900 dark:text-gray-200 font-sans overflow-visible"
            style={positionStyle}
        >
            <div className="p-2">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Account</div>

                {/* Profile Row — clicks to Account Info */}
                <div
                    onClick={() => { onNavigate('account-info'); onClose(); }}
                    className="flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg cursor-pointer transition-colors mb-1"
                >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm overflow-hidden ring-2 ring-white dark:ring-[#1e1e1e]">
                        {user?.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0) || 'A'
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user?.name || 'User'}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                            {user?.email || 'user@example.com'}
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>

                <div className="h-px bg-gray-200 dark:bg-[#333] my-1 mx-2" />

                {/* Menu Items */}
                <div className="space-y-0.5">
                    <button
                        onClick={() => { onNavigate('settings'); onClose(); }}
                        className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg text-sm transition-colors text-left text-gray-700 dark:text-gray-200"
                    >
                        <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span>Settings</span>
                    </button>
                    <button
                        onClick={() => {
                            if (Notification.permission === 'granted') {
                                new Notification('Smart Notes', { body: 'Notifications are enabled! 🎉', icon: '/logo.png' });
                                toast.success('Notifications are active!', { icon: '🔔' });
                            } else if (Notification.permission === 'denied') {
                                toast.error('Notifications blocked. Enable them in browser settings.', { icon: '🔕' });
                            } else {
                                Notification.requestPermission().then(perm => {
                                    if (perm === 'granted') {
                                        new Notification('Smart Notes', { body: 'Notifications enabled! 🎉', icon: '/logo.png' });
                                        toast.success('Notifications enabled!', { icon: '🔔' });
                                    } else {
                                        toast('Notification permission denied', { icon: '🔕' });
                                    }
                                });
                            }
                            onClose();
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg text-sm transition-colors text-left text-gray-700 dark:text-gray-200"
                    >
                        <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span>Notifications</span>
                    </button>
                </div>

                <div className="h-px bg-gray-200 dark:bg-[#333] my-1 mx-2" />

                {/* Need Help — expandable submenu */}
                <div className="relative">
                    <button
                        onClick={() => setShowHelpMenu(!showHelpMenu)}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg text-sm transition-colors text-left group text-gray-700 dark:text-gray-200"
                    >
                        <div className="flex items-center space-x-3">
                            <HelpCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span>Need help?</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform duration-200 ${showHelpMenu ? 'rotate-90' : ''}`} />
                    </button>

                    {showHelpMenu && (
                        <div className="absolute left-full bottom-0 ml-2 w-52 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-xl shadow-xl py-1.5 z-50">
                            <a
                                href="/contact"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg text-sm text-gray-700 dark:text-gray-200 mx-1 transition-colors"
                            >
                                <MessageCircle className="w-4 h-4 text-gray-400" />
                                <span>Contact Us</span>
                            </a>
                            <a
                                href="/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg text-sm text-gray-700 dark:text-gray-200 mx-1 transition-colors"
                            >
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span>Privacy Policy</span>
                            </a>
                            <a
                                href="/terms"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg text-sm text-gray-700 dark:text-gray-200 mx-1 transition-colors"
                            >
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span>Terms of Service</span>
                            </a>
                            <button
                                onClick={() => {
                                    toast(
                                        <div className="text-sm">
                                            <div className="font-semibold mb-1">Keyboard Shortcuts</div>
                                            <div className="space-y-1 text-xs">
                                                <div><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+K</kbd> — Command Palette</div>
                                                <div><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+N</kbd> — New Note</div>
                                                <div><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+S</kbd> — Save</div>
                                            </div>
                                        </div>,
                                        { duration: 5000, style: { borderRadius: '12px', background: '#333', color: '#fff', maxWidth: '300px' } }
                                    );
                                    onClose();
                                    setShowHelpMenu(false);
                                }}
                                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg text-sm text-gray-700 dark:text-gray-200 mx-1 transition-colors text-left"
                            >
                                <Keyboard className="w-4 h-4 text-gray-400" />
                                <span>Keyboard Shortcuts</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="h-px bg-gray-200 dark:bg-[#333] my-1 mx-2" />

                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/15 rounded-lg text-sm transition-colors text-left text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400"
                >
                    <LogOut className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span>Sign out {user?.email?.split('@')[0]}</span>
                </button>
            </div>
        </div>
    );
};

export default ProfilePopover;
