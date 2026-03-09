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
    X,
    DollarSign,
    Clock,
    Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfilePopover from './ProfilePopover';

const Sidebar = ({ activeView, setActiveView, onCreateNote, isOpen, onClose }) => {
    const { user } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const mainNav = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'timeline', label: 'Timeline', icon: Clock },
        // { id: 'shortcuts', label: 'Shortcuts', icon: Star },
    ];

    const workspaceNav = [
        { id: 'notes', label: 'Notes', icon: FileText },
        { id: 'tasks', label: 'Tasks', icon: CheckCircle },
        // { id: 'files', label: 'Files', icon: Files },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'journals', label: 'Journals', icon: Book },
    ];

    const toolsNav = [
        { id: 'sticky-notes', label: 'Sticky Notes', icon: Layout, badge: 'NEW' },
        { id: 'templates', label: 'Templates', icon: Layout, badge: 'NEW' },
        { id: 'notebooks', label: 'Notebooks', icon: Book },
        // { id: 'tags', label: 'Tags', icon: Tag },
        { id: 'expenses', label: 'Expenses', icon: DollarSign },
        { id: 'habits', label: 'Habit Tracker', icon: CheckCircle },
    ];

    const NavGroup = ({ items }) => (
        <div className="space-y-0.5 mb-4 px-2">
            {items.map((item) => {
                const isActive = activeView === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 group ${isActive
                            ? 'bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium'
                            : 'hover:bg-gray-100/80 dark:hover:bg-[#252525] text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            <item.icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110 text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'}`} />
                            <span>{item.label}</span>
                        </div>
                        {item.badge && (
                            <span className="text-[9px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/30">
                                {item.badge}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-[280px] lg:w-[260px] bg-[#fafafa] dark:bg-[#1a1a1a] h-screen flex flex-col border-r border-gray-200/80 dark:border-[#2a2a2a] flex-shrink-0 font-sans transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0 overflow-hidden
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            {/* Search Bar */}
            <div className="px-4 pt-5 pb-4 flex items-center gap-2">
                <div
                    className="relative group flex-1 cursor-text"
                    onClick={() => document.dispatchEvent(new CustomEvent('open-command-palette'))}
                >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
                    <div className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between transition-all shadow-sm">
                        <span>Search...</span>
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] rounded border border-gray-200 dark:border-[#333]">⌘K</kbd>
                    </div>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] rounded-xl transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Action Buttons */}
            <div className="px-4 mb-6">
                <button
                    onClick={onCreateNote}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl py-2 px-4 flex items-center justify-center space-x-2 transition-all duration-200 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 font-medium group"
                >
                    <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
                    <span>New Note</span>
                </button>
                <div className="flex space-x-2 mt-2">
                    <button
                        onClick={() => setActiveView('tasks')}
                        className="flex-1 bg-white dark:bg-[#222] hover:bg-gray-50 dark:hover:bg-[#282828] text-gray-700 dark:text-gray-300 rounded-xl py-2 px-2 flex items-center justify-center space-x-1.5 transition-all text-xs border border-gray-200 dark:border-[#333] shadow-sm hover:shadow group"
                    >
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-500 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Task</span>
                    </button>
                    <button
                        onClick={() => setActiveView('calendar')}
                        className="flex-1 bg-white dark:bg-[#222] hover:bg-gray-50 dark:hover:bg-[#282828] text-gray-700 dark:text-gray-300 rounded-xl py-2 px-2 flex items-center justify-center space-x-1.5 transition-all text-xs border border-gray-200 dark:border-[#333] shadow-sm hover:shadow group"
                    >
                        <Calendar className="w-3.5 h-3.5 text-purple-500 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Event</span>
                    </button>
                </div>
            </div>

            {/* Navigation Menu (Scrollable) */}
            <nav className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-6">
                <NavGroup items={mainNav} />
                <NavGroup items={workspaceNav} />
                <NavGroup items={toolsNav} />
                {/* <NavGroup items={teamNav} /> */}

                {/* <div className="px-2 mt-2">
                    <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm hover:bg-gray-100/80 dark:hover:bg-[#252525] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors group">
                        <div className="flex items-center space-x-3">
                            <MoreHorizontal className="w-4 h-4 group-hover:text-gray-600 dark:group-hover:text-gray-400" />
                            <span>More</span>
                        </div>
                    </button>
                </div> */}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 mt-auto border-t border-gray-200/80 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a]">
                <div
                    ref={profileRef}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-[#252525] rounded-xl cursor-pointer transition-all duration-200 group ${isProfileOpen ? 'bg-gray-100 dark:bg-[#252525]' : ''}`}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden ring-2 ring-white dark:ring-[#1a1a1a] group-hover:shadow-md transition-all">
                        {user?.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            getInitials(user?.name)
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user?.name || 'User'}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate leading-tight">
                            {user?.email || 'user@example.com'}
                        </div>
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
