import React, { useState, useEffect } from 'react';
import { Plus, Search, LayoutGrid, Loader } from 'lucide-react';
import { stickyNotesAPI } from '../../api';
import StickyNoteCard from './StickyNoteCard';
import StickyNoteEditor from './StickyNoteEditor';
import toast from 'react-hot-toast';

const StickyNotesView = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await stickyNotesAPI.getStickyNotes();
            setNotes(response.data.data.notes);
        } catch (error) {
            console.error('Failed to fetch sticky notes', error);
            toast.error('Failed to load sticky notes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = () => {
        const newNote = {
            title: '',
            content: '',
            type: 'text',
            color: '#ffffff', // Default white
            isPinned: false
        };
        setSelectedNote(newNote);
        setIsEditorOpen(true);
    };

    const handleSaveNote = async (noteData) => {
        try {
            if (noteData._id) {
                // Update existing
                const response = await stickyNotesAPI.updateStickyNote(noteData._id, noteData);
                setNotes(notes.map(n => n._id === noteData._id ? response.data.data.note : n));
                toast.success('Note updated');
            } else {
                // Create new
                const response = await stickyNotesAPI.createStickyNote(noteData);
                setNotes([response.data.data.note, ...notes]);
                toast.success('Note created');
            }
        } catch (error) {
            console.error('Failed to save note', error);
            toast.error('Failed to save note');
        }
    };

    const handleDeleteNote = async (note) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await stickyNotesAPI.deleteStickyNote(note._id);
            setNotes(notes.filter(n => n._id !== note._id));
            toast.success('Note deleted');
            if (selectedNote?._id === note._id) {
                setIsEditorOpen(false);
                setSelectedNote(null);
            }
        } catch (error) {
            console.error('Failed to delete note', error);
            toast.error('Failed to delete note');
        }
    };

    const handlePinNote = async (note) => {
        try {
            const updatedNote = { ...note, isPinned: !note.isPinned };
            const response = await stickyNotesAPI.updateStickyNote(note._id, { isPinned: updatedNote.isPinned });
            setNotes(notes.map(n => n._id === note._id ? response.data.data.note : n));
            toast.success(updatedNote.isPinned ? 'Note pinned' : 'Note unpinned');
        } catch (error) {
            console.error('Failed to pin note', error);
            toast.error('Failed to update pin status');
        }
    };

    const filteredNotes = notes.filter(note => {
        const query = searchQuery.toLowerCase();
        const contentMatch = typeof note.content === 'string'
            ? note.content.toLowerCase().includes(query)
            : note.content.some(item => item.text.toLowerCase().includes(query));
        return note.title.toLowerCase().includes(query) || contentMatch;
    });

    const pinnedNotes = filteredNotes.filter(n => n.isPinned);
    const otherNotes = filteredNotes.filter(n => !n.isPinned);

    return (
        <div className="flex-1 h-full flex flex-col bg-gray-50 dark:bg-[#121212] overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl text-yellow-600 dark:text-yellow-400">
                            <LayoutGrid className="w-6 h-6" />
                        </span>
                        Sticky Notes
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Capture quick thoughts and ideas.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-[#252525] border-none rounded-xl text-sm focus:ring-2 focus:ring-yellow-500/50 w-64 transition-all"
                        />
                    </div>
                    <button
                        onClick={handleCreateNote}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-yellow-400/20 transition-all transform hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        New Note
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader className="w-8 h-8 animate-spin text-yellow-500" />
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Pinned Section */}
                        {pinnedNotes.length > 0 && (
                            <section>
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                    Pinned
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {pinnedNotes.map(note => (
                                        <StickyNoteCard
                                            key={note._id}
                                            note={note}
                                            onEdit={(n) => { setSelectedNote(n); setIsEditorOpen(true); }}
                                            onDelete={handleDeleteNote}
                                            onPin={handlePinNote}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Other Notes Section */}
                        <section>
                            {pinnedNotes.length > 0 && <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 mt-8">Others</h2>}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {otherNotes.map(note => (
                                    <StickyNoteCard
                                        key={note._id}
                                        note={note}
                                        onEdit={(n) => { setSelectedNote(n); setIsEditorOpen(true); }}
                                        onDelete={handleDeleteNote}
                                        onPin={handlePinNote}
                                    />
                                ))}
                            </div>
                            {otherNotes.length === 0 && pinnedNotes.length === 0 && (
                                <div className="text-center py-20 opacity-50">
                                    <LayoutGrid className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                                    <p className="text-lg text-gray-500">No sticky notes yet.</p>
                                    <button onClick={handleCreateNote} className="text-yellow-500 font-medium mt-2 hover:underline">Create one now</button>
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>

            {/* Editor Modal */}
            {isEditorOpen && (
                <StickyNoteEditor
                    note={selectedNote}
                    onClose={() => { setIsEditorOpen(false); setSelectedNote(null); }}
                    onSave={handleSaveNote}
                    onDelete={handleDeleteNote}
                />
            )}
        </div>
    );
};

export default StickyNotesView;
