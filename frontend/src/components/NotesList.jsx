import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    ArrowDownUp,
    Pin,
    Trash2,
    FileText,
    Copy,
    Share2,
    X,
    Tag as TagIcon,
    ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const NotesList = ({ notes, currentNote, onSelectNote, onDeleteNote, onPinNote, onDuplicateNote }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('updated'); // 'updated', 'title', 'wordCount'
    const [selectedTags, setSelectedTags] = useState([]);
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Get all unique tags from notes
    const allTags = useMemo(() => {
        const tagSet = new Set();
        notes.forEach(note => {
            note.tags?.forEach(tag => {
                const tagName = typeof tag === 'object' ? tag.name : tag;
                if (tagName) tagSet.add(tagName);
            });
        });
        return Array.from(tagSet);
    }, [notes]);

    // Filter and sort notes
    const filteredAndSortedNotes = useMemo(() => {
        let filtered = notes;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(note =>
                note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.plainText?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Tag filter
        if (selectedTags.length > 0) {
            filtered = filtered.filter(note =>
                note.tags?.some(tag => {
                    const tagName = typeof tag === 'object' ? tag.name : tag;
                    return selectedTags.includes(tagName);
                })
            );
        }

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            // Pinned notes always first
            if (a.isPinned !== b.isPinned) {
                return a.isPinned ? -1 : 1;
            }

            // Then by selected sort
            switch (sortBy) {
                case 'title':
                    return (a.title || 'Untitled').localeCompare(b.title || 'Untitled');
                case 'wordCount':
                    return (b.wordCount || 0) - (a.wordCount || 0);
                case 'updated':
                default:
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
            }
        });

        return sorted;
    }, [notes, searchQuery, selectedTags, sortBy]);

    // Separate pinned and unpinned
    const pinnedNotes = filteredAndSortedNotes.filter(note => note.isPinned);
    const unpinnedNotes = filteredAndSortedNotes.filter(note => !note.isPinned);

    const formatDate = (date) => {
        const d = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) return 'Today';
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const NoteCard = ({ note }) => {
        const [showQuickActions, setShowQuickActions] = useState(false);

        return (
            <div
                onClick={() => onSelectNote(note)}
                onMouseEnter={() => setShowQuickActions(true)}
                onMouseLeave={() => setShowQuickActions(false)}
                className={`group relative bg-white dark:bg-[#252525] rounded-xl transition-all duration-200 cursor-pointer overflow-hidden ${currentNote?._id === note._id
                    ? 'ring-2 ring-blue-500 shadow-lg'
                    : 'hover:shadow-md border border-gray-200 dark:border-[#333]'
                    }`}
            >
                {/* Color label bar */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                    style={{ backgroundColor: note.color !== '#ffffff' ? note.color : '#e5e7eb' }}
                />

                {/* Main content */}
                <div className="pl-4 pr-3 py-4">
                    {/* Header */}
                    <div className="flex items-start gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                        <h3 className={`font-semibold text-sm flex-1 line-clamp-1 ${!note.title ? 'text-gray-400 italic' : 'text-gray-900 dark:text-white'
                            }`}>
                            {note.title || 'Untitled'}
                        </h3>
                        {note.isPinned && (
                            <Pin className="w-3.5 h-3.5 text-blue-500 fill-blue-500 flex-shrink-0" />
                        )}
                    </div>

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {note.tags.slice(0, 3).map((tag, idx) => {
                                const tagName = typeof tag === 'object' ? tag.name : tag;
                                return (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                    >
                                        {tagName}
                                    </span>
                                );
                            })}
                            {note.tags.length > 3 && (
                                <span className="text-[10px] text-gray-400">+{note.tags.length - 3}</span>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
                        <span>{formatDate(note.updatedAt)}</span>
                        {note.wordCount > 0 && (
                            <span>{note.wordCount} words</span>
                        )}
                    </div>
                </div>

                {/* Quick actions (visible on hover) */}
                <div className={`absolute top-2 right-2 flex items-center gap-1 transition-opacity duration-200 ${showQuickActions ? 'opacity-100' : 'opacity-0'
                    }`}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPinNote?.(note._id, !note.isPinned);
                        }}
                        className="p-1.5 rounded-lg bg-white dark:bg-[#2d2d2d] hover:bg-gray-100 dark:hover:bg-[#333] border border-gray-200 dark:border-[#444] shadow-sm transition-colors"
                        title={note.isPinned ? 'Unpin' : 'Pin'}
                    >
                        <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'text-blue-500 fill-blue-500' : 'text-gray-500'}`} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateNote?.(note._id);
                        }}
                        className="p-1.5 rounded-lg bg-white dark:bg-[#2d2d2d] hover:bg-gray-100 dark:hover:bg-[#333] border border-gray-200 dark:border-[#444] shadow-sm transition-colors"
                        title="Duplicate"
                    >
                        <Copy className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Share functionality - copy link to clipboard
                            const noteUrl = `${window.location.origin}/notes/${note._id}`;
                            navigator.clipboard.writeText(noteUrl)
                                .then(() => {
                                    toast.success('Link copied to clipboard!', {
                                        icon: '🔗',
                                        duration: 2000,
                                    });
                                })
                                .catch(err => {
                                    console.error('Failed to copy:', err);
                                    toast.error('Failed to copy link');
                                });
                        }}
                        className="p-1.5 rounded-lg bg-white dark:bg-[#2d2d2d] hover:bg-gray-100 dark:hover:bg-[#333] border border-gray-200 dark:border-[#444] shadow-sm transition-colors"
                        title="Share"
                    >
                        <Share2 className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Delete with toast confirmation
                            toast((t) => (
                                <div className="flex flex-col gap-2">
                                    <span className="font-medium">Delete this note?</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                onDeleteNote?.(note._id);
                                                toast.dismiss(t.id);
                                                toast.success('Note deleted');
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
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Notes</h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{notes.length}</span>
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
                                    onClick={() => { setSortBy('updated'); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#333] ${sortBy === 'updated' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    Last Updated
                                </button>
                                <button
                                    onClick={() => { setSortBy('title'); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#333] ${sortBy === 'title' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    Title (A-Z)
                                </button>
                                <button
                                    onClick={() => { setSortBy('wordCount'); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#333] ${sortBy === 'wordCount' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    Word Count
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
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-[#2d2d2d] border border-gray-200 dark:border-[#444] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Tag filters */}
                {allTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {allTags.slice(0, 5).map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${selectedTags.includes(tag)
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700'
                                    : 'bg-gray-100 dark:bg-[#2d2d2d] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#444] hover:bg-gray-200 dark:hover:bg-[#333]'
                                    }`}
                            >
                                <TagIcon className="w-3 h-3 mr-1" />
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-3">
                {filteredAndSortedNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-[#262626] rounded-full flex items-center justify-center mb-3">
                            <FileText className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-1">
                            {searchQuery || selectedTags.length > 0 ? 'No notes found' : 'No notes yet'}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {searchQuery || selectedTags.length > 0
                                ? 'Try adjusting your search or filters'
                                : 'Create your first note to get started'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 pt-3">
                        {/* Pinned notes section */}
                        {pinnedNotes.length > 0 && (
                            <>
                                <div className="flex items-center gap-2 px-2 mb-2">
                                    <Pin className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Pinned
                                    </span>
                                </div>
                                {pinnedNotes.map(note => (
                                    <NoteCard key={note._id} note={note} />
                                ))}

                                {unpinnedNotes.length > 0 && (
                                    <div className="h-px bg-gray-200 dark:bg-[#333] my-4" />
                                )}
                            </>
                        )}

                        {/* Regular notes */}
                        {unpinnedNotes.map(note => (
                            <NoteCard key={note._id} note={note} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesList;
