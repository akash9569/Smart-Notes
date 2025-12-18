import React, { useRef, useEffect } from 'react';
import {
    Settings,
    Bell,
    HelpCircle,
    LogOut,
    Info,
    ChevronRight,
    User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePopover = ({ isOpen, onClose, anchorRef, onNavigate }) => {
    const { user, logout } = useAuth();
    const popoverRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target) &&
                anchorRef.current && !anchorRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, anchorRef]);

    if (!isOpen) return null;

    // Calculate position based on anchor
    const positionStyle = anchorRef.current
        ? {
            bottom: '60px', // Fixed distance from bottom
            left: '12px',   // Align with sidebar padding
            width: '280px'  // Fixed width
        }
        : {};

    return (
        <div
            ref={popoverRef}
            className="absolute z-50 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-xl shadow-2xl text-gray-900 dark:text-gray-200 font-sans overflow-hidden animate-in fade-in zoom-in-95 duration-100"
            style={positionStyle}
        >
            <div className="p-2">
                <div className="px-3 py-2 text-xs font-medium text-gray-500">Account</div>

                <div className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg cursor-pointer transition-colors mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm overflow-hidden">
                        {user?.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0) || 'A'
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user?.name || 'User'}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                            {user?.email || 'user@example.com'}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-200 dark:bg-[#333] my-1 mx-2"></div>

                <div className="space-y-0.5">
                    <button
                        onClick={() => { onNavigate('settings'); onClose(); }}
                        className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg text-sm transition-colors text-left text-gray-700 dark:text-gray-200"
                    >
                        <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span>Account info...</span>
                    </button>
                    <button
                        onClick={() => { onNavigate('settings'); onClose(); }}
                        className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg text-sm transition-colors text-left text-gray-700 dark:text-gray-200"
                    >
                        <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span>Settings</span>
                    </button>
                    <button
                        onClick={() => { toast('No new notifications', { icon: '🔔', style: { borderRadius: '10px', background: '#333', color: '#fff' } }); onClose(); }}
                        className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg text-sm transition-colors text-left text-gray-700 dark:text-gray-200"
                    >
                        <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span>Notifications</span>
                    </button>
                </div>

                <div className="h-px bg-gray-200 dark:bg-[#333] my-1 mx-2"></div>

                <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg text-sm transition-colors text-left group text-gray-700 dark:text-gray-200">
                    <div className="flex items-center space-x-3">
                        <HelpCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span>Need help?</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                </button>

                <div className="h-px bg-gray-200 dark:bg-[#333] my-1 mx-2"></div>

                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg text-sm transition-colors text-left text-gray-700 dark:text-gray-200"
                >
                    <LogOut className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span>Sign out {user?.email?.split('@')[0]}</span>
                </button>
            </div>
        </div>
    );
};

export default ProfilePopover;
