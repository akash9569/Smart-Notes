import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    ArrowDownUp,
    FileText,
    Copy,
    ChevronDown,
    Book,
    Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const JournalsView = ({ journals, currentNote, onSelectNote, onDeleteNote }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date'); // 'date', 'title'
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Filter and sort journals
    const filteredAndSortedJournals = useMemo(() => {
        let filtered = journals;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(journal =>
                journal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                journal.plainText?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'title') {
                return (a.title || 'Untitled').localeCompare(b.title || 'Untitled');
            }
            // Default to date (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return sorted;
    }, [journals, searchQuery, sortBy]);

    const formatDate = (date) => {
        const d = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) return 'Today';
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const JournalCard = ({ journal }) => {
        return (
            <div
                onClick={() => onSelectNote(journal)}
                className={`group relative bg-white dark:bg-[#252525] rounded-xl transition-all duration-200 cursor-pointer overflow-hidden ${currentNote?._id === journal._id
                    ? 'ring-2 ring-pink-500 shadow-lg'
                    : 'hover:shadow-md border border-gray-200 dark:border-[#333]'
                    }`}
            >
                {/* Decoration bar */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-pink-400"
                />

                {/* Main content */}
                <div className="pl-4 pr-3 py-4">
                    {/* Header */}
                    <div className="flex items-start gap-2 mb-2">
                        <Book className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                        <h3 className={`font-semibold text-sm flex-1 line-clamp-1 ${!journal.title ? 'text-gray-400 italic' : 'text-gray-900 dark:text-white'
                            }`}>
                            {journal.title || 'Untitled Journal'}
                        </h3>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
                        <span>{formatDate(journal.createdAt)}</span>
                        {journal.wordCount > 0 && (
                            <span>{journal.wordCount} words</span>
                        )}
                    </div>
                </div>

                {/* Quick actions (visible on hover) */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Delete with toast confirmation
                            toast((t) => (
                                <div className="flex flex-col gap-2">
                                    <span className="font-medium">Delete this journal?</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                onDeleteNote?.(journal._id);
                                                toast.dismiss(t.id);
                                            }}
                                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => toast.dismiss(t.id)}
                                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ), {
                                duration: 5000,
                            });
                        }}
                        className="p-1.5 rounded-lg bg-white dark:bg-[#2d2d2d] hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-[#444] hover:border-red-300 dark:hover:border-red-800 shadow-sm transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-red-500" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full lg:w-[340px] bg-white dark:bg-[#191919] border-r border-gray-200 dark:border-[#333] flex flex-col h-full flex-shrink-0 transition-colors duration-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-[#333]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Journals</h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{journals.length}</span>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors"
                        >
                            <ArrowDownUp className="w-4 h-4" />
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {isSortOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2d2d2d] rounded-xl shadow-lg border border-gray-200 dark:border-[#444] py-2 z-10">
                                <button
                                    onClick={() => { setSortBy('date'); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#333] ${sortBy === 'date' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    Date (Newest)
                                </button>
                                <button
                                    onClick={() => { setSortBy('title'); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#333] ${sortBy === 'title' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    Title (A-Z)
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search bar */}
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search journals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-[#2d2d2d] border border-gray-200 dark:border-[#444] focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    />
                </div>
            </div>

            {/* Journals List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-3">
                {filteredAndSortedJournals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                        <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center mb-3">
                            <Book className="w-6 h-6 text-pink-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1">
                            {searchQuery ? 'No journals found' : 'No journals yet'}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {searchQuery
                                ? 'Try adjusting your search'
                                : 'Start your daily journal from the Calendar'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 pt-3">
                        {filteredAndSortedJournals.map(journal => (
                            <JournalCard key={journal._id} journal={journal} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalsView;
