import React, { useState, useEffect } from 'react';
import {
    X,
    Book,
    Calendar,
    Tag,
    MoreHorizontal,
    Trash2,
    Edit2,
    Copy,
    Archive,
    Star,
    Share2,
    Lock,
    FileText,
    Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { notebooksAPI } from '../api';
import toast from 'react-hot-toast';

const NotebookDetailsPanel = ({ notebook, onClose, onUpdate, onDelete, onCreateNote, notes, onSelectNote, onDuplicate }) => {
    const [localNotebook, setLocalNotebook] = useState(notebook);
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const notebookNotes = notes?.filter(note => {
        const noteNotebookId = note.notebookId?._id || note.notebookId;
        return String(noteNotebookId) === String(notebook._id);
    }) || [];

    useEffect(() => {
        setLocalNotebook(notebook);
    }, [notebook]);

    if (!localNotebook) return null;

    const handleUpdate = async (updates) => {
        try {
            const updatedNotebook = await onUpdate(localNotebook._id, updates);
            setLocalNotebook(updatedNotebook);
            toast.success('Notebook updated');
        } catch (error) {
            console.error('Update failed:', error);
            toast.error('Failed to update notebook');
        }
    };

    const toggleFavorite = () => {
        handleUpdate({ isFavorite: !localNotebook.isFavorite });
    };

    const togglePublic = () => {
        handleUpdate({ isPublic: !localNotebook.isPublic });
    };

    const handleShare = () => {
        // Mock share functionality
        const url = `${window.location.origin}/notebooks/${localNotebook._id}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
    };

    const handleExport = () => {
        window.print();
    };

    return (
        <div className="w-full lg:w-96 bg-white dark:bg-[#1e1e1e] border-l border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-xl z-20 print-content">
            {/* Cover Header */}
            <div className={`h-32 w-full relative ${localNotebook.cover || 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}>
                <div className="absolute top-4 right-4 flex items-center gap-2 no-print">
                    <button
                        onClick={toggleFavorite}
                        className={`p-2 rounded-full backdrop-blur-md bg-black/20 hover:bg-black/30 transition-colors ${localNotebook.isFavorite ? 'text-yellow-400' : 'text-white'}`}
                    >
                        <Star className={`w-4 h-4 ${localNotebook.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full backdrop-blur-md bg-black/20 hover:bg-black/30 text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Icon */}
                <div className="absolute -bottom-8 left-8 w-16 h-16 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-lg flex items-center justify-center text-3xl border-4 border-white dark:border-[#1e1e1e]">
                    {localNotebook.icon || '📚'}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pt-12 pb-6 space-y-8">
                {/* Title & Description */}
                <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                        {isEditingTitle ? (
                            <input
                                type="text"
                                value={localNotebook.name}
                                onChange={(e) => setLocalNotebook({ ...localNotebook, name: e.target.value })}
                                onBlur={() => {
                                    handleUpdate({ name: localNotebook.name });
                                    setIsEditingTitle(false);
                                }}
                                autoFocus
                                className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                            />
                        ) : (
                            <h2
                                onClick={() => setIsEditingTitle(true)}
                                className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                {localNotebook.name}
                            </h2>
                        )}
                    </div>

                    <textarea
                        value={localNotebook.description || ''}
                        onChange={(e) => setLocalNotebook({ ...localNotebook, description: e.target.value })}
                        onBlur={() => handleUpdate({ description: localNotebook.description })}
                        placeholder="Add a description..."
                        className="w-full text-sm text-gray-600 dark:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none min-h-[60px]"
                    />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 no-print">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800/50">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{notebookNotes.length}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800/50">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Collaborators</div>
                        <div className="flex -space-x-2 mt-1">
                            <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-white dark:border-[#252525] flex items-center justify-center text-[10px] text-white font-bold">A</div>
                            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-[#252525] flex items-center justify-center text-[10px] text-white font-bold">+2</div>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800/50">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Size</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">2.4 MB</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800/50">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Updated</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {format(new Date(localNotebook.updatedAt), 'MMM d')}
                        </div>
                    </div>
                </div>

                {/* Permissions */}
                <div className="no-print">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Permissions</h3>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                <Lock className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {localNotebook.isPublic ? 'Public' : 'Private'}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {localNotebook.isPublic ? 'Anyone with link can view' : 'Only you can access'}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={togglePublic}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                            Change
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="no-print">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => onCreateNote({ notebookId: localNotebook._id })}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#252525] text-gray-700 dark:text-gray-300 transition-colors text-sm font-medium"
                        >
                            <Edit2 className="w-4 h-4 text-gray-400" />
                            Create Note in Notebook
                        </button>
                        <button
                            onClick={handleShare}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#252525] text-gray-700 dark:text-gray-300 transition-colors text-sm font-medium"
                        >
                            <Share2 className="w-4 h-4 text-gray-400" />
                            Share Notebook
                        </button>
                        <button
                            onClick={() => onDuplicate(localNotebook)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#252525] text-gray-700 dark:text-gray-300 transition-colors text-sm font-medium"
                        >
                            <Copy className="w-4 h-4 text-gray-400" />
                            Duplicate
                        </button>
                        <button
                            onClick={handleExport}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#252525] text-gray-700 dark:text-gray-300 transition-colors text-sm font-medium"
                        >
                            <Archive className="w-4 h-4 text-gray-400" />
                            Export as PDF
                        </button>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {localNotebook.tags?.map((tag, index) => (
                            <span key={index} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-[#252525] text-xs font-medium text-gray-600 dark:text-gray-400">
                                #{tag}
                            </span>
                        ))}
                        <button className="px-2.5 py-1 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 transition-colors flex items-center gap-1 no-print">
                            <Tag className="w-3 h-3" />
                            Add Tag
                        </button>
                    </div>
                </div>
            </div>

            {/* Notes List Section */}
            <div className="px-6 pb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes in this Notebook</h3>
                    <button
                        onClick={() => onCreateNote({ notebookId: localNotebook._id })}
                        className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium no-print"
                    >
                        <Plus className="w-3 h-3" /> New Note
                    </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {notebookNotes.length > 0 ? (
                        notebookNotes.map(note => (
                            <div
                                key={note._id}
                                onClick={() => onSelectNote(note)}
                                className="p-3 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800/50 hover:border-blue-200 dark:hover:border-blue-800 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-white dark:bg-[#1e1e1e] text-gray-400 group-hover:text-blue-500 transition-colors shadow-sm">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate mb-0.5">
                                            {note.title || 'Untitled Note'}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                            {note.plainText || 'No content'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
                                            <span>{format(new Date(note.updatedAt), 'MMM d, yyyy')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                            <p className="text-sm text-gray-500 mb-2">No notes yet</p>
                            <button
                                onClick={() => onCreateNote({ notebookId: localNotebook._id })}
                                className="text-xs text-blue-600 font-medium hover:underline"
                            >
                                Create your first note
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] no-print">
                <button
                    onClick={() => onDelete(localNotebook)}
                    className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Notebook
                </button>
            </div>
        </div>
    );
};

export default NotebookDetailsPanel;
