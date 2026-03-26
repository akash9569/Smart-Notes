import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
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
    const [position, setPosition] = useState({ bottom: 0, left: 0 });

    // Calculate position from anchor element
    useEffect(() => {
        if (isOpen && anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setPosition({
                bottom: window.innerHeight - rect.top + 8,
                left: rect.left,
            });
        }
    }, [isOpen, anchorRef]);

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

    const popoverContent = (
        <div
            ref={popoverRef}
            className="fixed z-[9999] bg-white dark:bg-[#202020] border border-gray-100 dark:border-[#333] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] text-gray-900 dark:text-gray-200 font-sans overflow-visible"
            style={{
                bottom: `${position.bottom}px`,
                left: `${position.left}px`,
                width: '300px',
            }}
        >
            <div className="p-2">
                <div className="px-3 pb-2 pt-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Account</div>

                {/* Profile Row — clicks to Account Info */}
                <div
                    onClick={() => { onNavigate('account-info'); onClose(); }}
                    className="flex items-center space-x-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-[#2c2c2c] rounded-xl cursor-pointer transition-colors mb-1 group"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm overflow-hidden ring-2 ring-white dark:ring-[#202020]">
                        {user?.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0) || 'A'
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {user?.name || 'User'}
                        </div>
                        <div className="text-[13px] text-gray-500 dark:text-gray-400 truncate">
                            {user?.email || 'user@example.com'}
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 flex-shrink-0 transition-colors" />
                </div>

                <div className="h-px bg-gray-100 dark:bg-[#333] my-1 mx-2" />

                {/* Menu Items */}
                <div className="space-y-0.5">
                    <button
                        onClick={() => { onNavigate('settings'); onClose(); }}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2c2c2c] rounded-xl text-sm transition-colors text-left text-gray-700 dark:text-gray-200"
                    >
                        <Settings className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                        <span className="font-medium">Settings</span>
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
                        className="w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2c2c2c] rounded-xl text-sm transition-colors text-left text-gray-700 dark:text-gray-200"
                    >
                        <Bell className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                        <span className="font-medium">Notifications</span>
                    </button>
                </div>

                <div className="h-px bg-gray-100 dark:bg-[#333] my-1 mx-2" />

                {/* Need Help — expandable submenu */}
                <div className="relative">
                    <button
                        onClick={() => setShowHelpMenu(!showHelpMenu)}
                        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2c2c2c] rounded-xl text-sm transition-colors text-left group text-gray-700 dark:text-gray-200"
                    >
                        <div className="flex items-center space-x-3">
                            <HelpCircle className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                            <span className="font-medium">Need help?</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform duration-200 ${showHelpMenu ? 'rotate-90' : ''}`} />
                    </button>

                    {showHelpMenu && (
                        <div className="absolute left-full bottom-0 ml-3 w-56 bg-white dark:bg-[#202020] border border-gray-100 dark:border-[#333] rounded-2xl shadow-xl py-2 z-50">
                            <a
                                href="/contact"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2c2c2c] rounded-xl text-sm text-gray-700 dark:text-gray-200 mx-1.5 transition-colors font-medium"
                            >
                                <MessageCircle className="w-4 h-4 text-gray-400" />
                                <span>Contact Us</span>
                            </a>
                            <a
                                href="/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2c2c2c] rounded-xl text-sm text-gray-700 dark:text-gray-200 mx-1.5 transition-colors font-medium"
                            >
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span>Privacy Policy</span>
                            </a>
                            <a
                                href="/terms"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2c2c2c] rounded-xl text-sm text-gray-700 dark:text-gray-200 mx-1.5 transition-colors font-medium"
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
                                className="w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#2c2c2c] rounded-xl text-sm text-gray-700 dark:text-gray-200 mx-1.5 transition-colors text-left font-medium"
                            >
                                <Keyboard className="w-4 h-4 text-gray-400" />
                                <span>Keyboard Shortcuts</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="h-px bg-gray-100 dark:bg-[#333] my-1 mx-2" />

                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/15 rounded-xl text-sm transition-colors text-left text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 group overflow-hidden"
                >
                    <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 flex-shrink-0" />
                    <span className="font-medium truncate">Sign out {user?.email?.split('@')[0]}</span>
                </button>
            </div>
        </div>
    );

    // Render via portal to escape sidebar's overflow-hidden
    return ReactDOM.createPortal(popoverContent, document.body);
};

export default ProfilePopover;
