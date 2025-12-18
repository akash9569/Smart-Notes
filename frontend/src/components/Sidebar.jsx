import React, { useState, useRef } from 'react';
import {
    Home,
    Star,
    FileText,
    CheckCircle,
    Files,
    Calendar,
    Layout,
    Book,
    Tag,
    Users,
    Box,
    MoreHorizontal,
    Search,
    Plus,
    ChevronDown,
    Settings,
    Zap,
    X,
    DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfilePopover from './ProfilePopover';

const Sidebar = ({ activeView, setActiveView, onCreateNote, isOpen, onClose }) => {
    const { user } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const menuItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'shortcuts', label: 'Shortcuts', icon: Star },
        { id: 'notes', label: 'Notes', icon: FileText },
        { id: 'tasks', label: 'Tasks', icon: CheckCircle },
        { id: 'files', label: 'Files', icon: Files },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'journals', label: 'Journals', icon: Book },
        { id: 'sticky-notes', label: 'Sticky Notes', icon: Layout, badge: 'NEW' },
        { id: 'templates', label: 'Templates', icon: Layout, badge: 'NEW' },
        { id: 'notebooks', label: 'Notebooks', icon: Book },
        { id: 'tags', label: 'Tags', icon: Tag },
        { id: 'expenses', label: 'Expenses', icon: DollarSign },
        { id: 'habits', label: 'Habit Tracker', icon: CheckCircle },
        { id: 'shared', label: 'Shared with me', icon: Users },
        { id: 'spaces', label: 'Spaces', icon: Box },
    ];

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-[280px] lg:w-[240px] bg-gray-50 dark:bg-[#191919] h-screen flex flex-col border-r border-gray-200 dark:border-[#333] flex-shrink-0 text-gray-600 dark:text-gray-400 font-sans transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            {/* Search Bar */}
            <div className="px-3 pt-4 pb-2 flex items-center gap-2">
                <div className="relative group flex-1">
                    <Search className="absolute left-2.5 top-2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#262626] border border-gray-200 dark:border-transparent focus:border-gray-300 dark:focus:border-[#444] rounded-md text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all"
                    />
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-[#333] rounded-md"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* New Note Button */}
            <div className="px-3 mb-2">
                <button
                    onClick={onCreateNote}
                    className="w-full bg-[#00a82d] hover:bg-[#008f26] text-white rounded-md py-1.5 px-4 flex items-center justify-center space-x-2 transition-colors shadow-sm font-medium"
                >
                    <FileText className="w-4 h-4" />
                    <span>Note</span>
                </button>
                <div className="flex space-x-2 mt-2">
                    <button
                        onClick={() => setActiveView('tasks')}
                        className="flex-1 bg-white dark:bg-[#262626] hover:bg-gray-100 dark:hover:bg-[#333] text-gray-700 dark:text-gray-300 rounded-md py-1.5 px-2 flex items-center justify-center space-x-1.5 transition-colors text-xs border border-gray-200 dark:border-[#333]"
                    >
                        <CheckCircle className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                        <span>Task</span>
                    </button>
                    <button
                        onClick={() => setActiveView('calendar')}
                        className="flex-1 bg-white dark:bg-[#262626] hover:bg-gray-100 dark:hover:bg-[#333] text-gray-700 dark:text-gray-300 rounded-md py-1.5 px-2 flex items-center justify-center space-x-1.5 transition-colors text-xs border border-gray-200 dark:border-[#333]"
                    >
                        <Calendar className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
                        <span>Event</span>
                    </button>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar py-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors ${activeView === item.id
                            ? 'bg-gray-200 dark:bg-[#333] text-gray-900 dark:text-white font-medium'
                            : 'hover:bg-gray-200 dark:hover:bg-[#262626] hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            <item.icon className={`w-4 h-4 ${activeView === item.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                            <span>{item.label}</span>
                        </div>
                        {item.badge && (
                            <span className="text-[10px] bg-blue-50 dark:bg-[#333] text-blue-600 dark:text-blue-400 px-1 rounded border border-blue-100 dark:border-blue-900/30">
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}

                <button className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-[#262626] hover:text-gray-900 dark:hover:text-gray-200 transition-colors mt-4">
                    <div className="flex items-center space-x-3">
                        <MoreHorizontal className="w-4 h-4" />
                        <span>More</span>
                    </div>
                </button>
            </nav>

            {/* Footer / User */}
            <div className="p-3 mt-auto space-y-3">
                <div
                    ref={profileRef}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center space-x-3 px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-[#262626] rounded-md cursor-pointer transition-colors ${isProfileOpen ? 'bg-gray-200 dark:bg-[#262626]' : ''}`}
                >
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                        {user?.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0) || 'A'
                        )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate flex-1">
                        {user?.email?.split('@')[0] || 'User'}
                    </span>
                    <div className="relative">
                        <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-1 -right-1 border-2 border-gray-50 dark:border-[#191919]"></div>
                        <Zap className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Profile Popover */}
            <ProfilePopover
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                anchorRef={profileRef}
                onNavigate={setActiveView}
            />
        </aside>
    );
};

export default Sidebar;
