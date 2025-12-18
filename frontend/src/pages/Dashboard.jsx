import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import Sidebar from '../components/Sidebar';
import NotesList from '../components/NotesList';
import RichTextEditor from '../components/RichTextEditor';
import HomeView from '../components/HomeView';
import CalendarView from '../components/CalendarView';
import TasksView from '../components/TasksView';
import NotebooksView from '../components/NotebooksView';
import SettingsView from '../components/SettingsView';
import TemplatesView from '../components/TemplatesView';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Chatbot from '../components/Chatbot';
import NotePropertiesPanel from '../components/NotePropertiesPanel';
import ExpensesView from '../components/ExpensesView';
import HabitTracker from '../components/HabitTracker';
import StickyNotesView from '../components/StickyNotes/StickyNotesView';
import JournalsView from '../components/JournalsView';
import {
    Maximize2,
    MoreHorizontal,
    Share,
    Link,
    Star,
    Clock,
    Info,
    Lock,
    ChevronDown,
    Copy,
    ExternalLink,
    FileInput,
    Files,
    Tag,
    FileText,
    Pin,
    ChevronsUpDown,
    Search,
    History,
    Printer,
    Trash,
    UserPlus,
    ArrowRight,
    Palette,
    Menu,
    ArrowLeft,

    Settings,
    X,
    Globe,
    Book
} from 'lucide-react';
import toast from 'react-hot-toast';

// Helper to strip HTML for plain text preview
const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
};

const Dashboard = () => {
    const { user } = useAuth();
    const {
        notes,
        createNote,
        updateNote,
        deleteNote,
        currentNote,
        setCurrentNote,
        loading,
        shareNote,
        activeJournal,
        clearActiveJournal,
        setActiveJournal,
        journals
    } = useNotes();

    const [activeView, setActiveView] = useState('home'); // Default to home
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Menu States
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const shareRef = React.useRef(null);
    const accessMenuRef = React.useRef(null);
    const moreMenuRef = React.useRef(null);
    const colorPickerRef = React.useRef(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);

    // Properties Panel State
    const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(false);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareRef.current && !shareRef.current.contains(event.target)) {
                setIsShareOpen(false);
            }
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
                setIsMoreMenuOpen(false);
            }
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
                setIsColorPickerOpen(false);
            }
            if (accessMenuRef.current && !accessMenuRef.current.contains(event.target)) {
                setIsAccessMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Auto-hide journal when navigating away or switching notes
    useEffect(() => {
        if (activeJournal) {
            // Clear active journal if user navigates to different view
            if (activeView !== 'notes') {
                clearActiveJournal();
            }
            // Clear active journal if user selects different note
            if (currentNote && currentNote._id !== activeJournal._id) {
                clearActiveJournal();
            }
        }
    }, [activeView, currentNote, activeJournal, clearActiveJournal]);

    // Hide journal when tab/window loses focus
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && activeJournal) {
                clearActiveJournal();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [activeJournal, clearActiveJournal]);

    // Sync state with current note
    useEffect(() => {
        if (currentNote) {
            setTitle(currentNote.title);
            setContent(currentNote.content || '');
        } else {
            setTitle('');
            setContent('');
        }
    }, [currentNote]);

    // Auto-save logic
    useEffect(() => {
        if (!currentNote) return;

        const timer = setTimeout(async () => {
            if (title !== currentNote.title || content !== (currentNote.content || '')) {
                setIsSaving(true);
                try {
                    await updateNote(currentNote._id, {
                        title,
                        content,
                        plainText: stripHtml(content)
                    });
                } catch (error) {
                    console.error('Auto-save failed', error);
                } finally {
                    setIsSaving(false);
                }
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [title, content, currentNote, updateNote]);

    const handleCreateNote = async (initialData = {}) => {
        try {
            // Create note with default title or provided data
            const newNote = await createNote({
                title: initialData.title || 'Untitled',
                content: initialData.content || '',
                notebookId: initialData.notebookId || null,
            });
            setActiveView('notes'); // Switch to notes view
        } catch (error) {
            console.error('Failed to create note', error);
        }
    };

    const handleDeleteNote = (id) => {
        const note = notes.find(n => n._id === id) || journals.find(j => j._id === id);
        setNoteToDelete(note);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteNote = async () => {
        if (noteToDelete) {
            await deleteNote(noteToDelete._id);
            setIsDeleteModalOpen(false);
            setNoteToDelete(null);
        }
    };

    const handleShare = () => {
        if (!currentNote) return;
        const noteUrl = `${window.location.origin}/notes/${currentNote._id}`;
        navigator.clipboard.writeText(noteUrl)
            .then(() => {
                toast.success('Link copied to clipboard!', {
                    icon: '🔗',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
                setIsShareOpen(false);
            })
            .catch(() => {
                toast.error('Failed to copy link');
            });
    };

    const handleInvite = async () => {
        if (!inviteEmail || !currentNote) return;
        try {
            await shareNote(currentNote._id, inviteEmail, 'view');
            setInviteEmail('');
            // Toast is handled in context
        } catch (error) {
            // Error handled in context
        }
    };

    const handlePinNote = async () => {
        if (!currentNote) return;
        try {
            await updateNote(currentNote._id, { isPinned: !currentNote.isPinned });
            toast.success(currentNote.isPinned ? 'Note unpinned' : 'Note pinned', {
                icon: '📌',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        } catch (error) {
            console.error('Failed to pin note', error);
            toast.error('Failed to update pin status');
        }
    };

    const handleColorChange = async (color) => {
        if (!currentNote) return;
        try {
            await updateNote(currentNote._id, { color });
            setIsColorPickerOpen(false);
        } catch (error) {
            console.error('Failed to change color', error);
            toast.error('Failed to update color');
        }
    };

    const handlePinNoteFromList = async (noteId, shouldPin) => {
        try {
            await updateNote(noteId, { isPinned: shouldPin });
            toast.success(shouldPin ? 'Note pinned' : 'Note unpinned', {
                icon: '📌',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        } catch (error) {
            console.error('Failed to pin note', error);
            toast.error('Failed to update pin status');
        }
    };

    const handleDuplicateNote = async (noteId) => {
        try {
            const noteToDuplicate = notes.find(n => n._id === noteId);
            if (noteToDuplicate) {
                await createNote({
                    title: `${noteToDuplicate.title} (Copy)`,
                    content: noteToDuplicate.content,
                    color: noteToDuplicate.color,
                    tags: noteToDuplicate.tags,
                });
                toast.success('Note duplicated!', {
                    icon: '✨',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            }
        } catch (error) {
            console.error('Failed to duplicate note', error);
            toast.error('Failed to duplicate note');
        }
    };

    const colors = [
        '#ffffff', // Default White
        '#f28b82', // Red
        '#fbbc04', // Orange
        '#fff475', // Yellow
        '#ccff90', // Green
        '#a7ffeb', // Teal
        '#cbf0f8', // Blue
        '#aecbfa', // Dark Blue
        '#d7aefb', // Purple
        '#fdcfe8', // Pink
        '#e6c9a8', // Brown
        '#e8eaed', // Gray
    ];

    const [isZenMode, setIsZenMode] = useState(false);

    // Handle Esc key to exit Zen Mode
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape' && isZenMode) {
                setIsZenMode(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isZenMode]);

    // Render the main content based on active view
    const renderMainContent = () => {
        switch (activeView) {
            case 'home':
                return <HomeView setActiveView={setActiveView} onCreateNote={handleCreateNote} />;
            case 'calendar':
                return <CalendarView
                    onSelectNote={(note) => {
                        setCurrentNote(note);
                        setActiveView('notes');
                    }}
                />;
            case 'tasks':
                return <TasksView />;
            case 'notebooks':
                return <NotebooksView
                    onCreateNote={handleCreateNote}
                    notes={notes}
                    onSelectNote={(note) => {
                        setCurrentNote(note);
                        setActiveView('notes');
                    }}
                />;
            case 'templates':
                return <TemplatesView onCreateNote={handleCreateNote} />;
            case 'settings':
                return <SettingsView />;
            case 'expenses':
                return <ExpensesView />;
            case 'habits':
                return <HabitTracker />;

            case 'sticky-notes':
                return <StickyNotesView />;
            case 'journals':
                return (
                    <div className="flex flex-1 h-full overflow-hidden relative">
                        {/* Middle Pane: Journals List */}
                        <div className={`${isZenMode ? 'hidden' : (currentNote ? 'hidden lg:flex' : 'flex')} w-full lg:w-auto h-full border-r border-gray-200 dark:border-[#333]`}>
                            <JournalsView
                                journals={journals}
                                currentNote={currentNote}
                                onSelectNote={(note) => {
                                    setCurrentNote(note);
                                    setActiveJournal(note); // Set as active journal so privacy indicator shows
                                }}
                                onDeleteNote={handleDeleteNote}
                            />
                        </div>

                        {/* Right Pane: Editor or Empty State */}
                        <div className={`${!currentNote ? 'hidden lg:flex' : 'flex'} flex-1 flex-col bg-white dark:bg-[#1a1a1a] h-full overflow-hidden relative w-full`}>
                            {currentNote ? (
                                <>
                                    {/* Editor Toolbar / Header - Hidden in Zen Mode */}
                                    {!isZenMode && (
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1a1a1a] no-print">
                                            <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-sm overflow-hidden">
                                                {/* Mobile Back Button */}
                                                <button
                                                    onClick={() => setCurrentNote(null)}
                                                    className="lg:hidden p-1 -ml-1 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-full text-gray-600 dark:text-gray-300"
                                                >
                                                    <ArrowLeft className="w-5 h-5" />
                                                </button>

                                                <button
                                                    onClick={() => setIsZenMode(true)}
                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg transition-colors hidden lg:block"
                                                    title="Enter Zen Mode"
                                                >
                                                    <Maximize2 className="w-4 h-4 cursor-pointer hover:text-gray-700 dark:text-gray-200" />
                                                </button>
                                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden lg:block"></div>
                                                <div className="flex items-center space-x-1 overflow-hidden">
                                                    <span className="hover:underline cursor-pointer hidden sm:inline">Journals</span>
                                                    <span className="text-gray-400 hidden sm:inline">›</span>
                                                    <span className="text-gray-900 dark:text-white font-medium truncate max-w-[150px] sm:max-w-[200px]">{title || 'Untitled'}</span>
                                                </div>
                                            </div>
                                            {/* Reuse existing toolbar actions */}
                                            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                                                <button
                                                    onClick={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)}
                                                    className={`p-2 rounded-lg transition-colors ${isPropertiesPanelOpen
                                                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                        }`}
                                                    title={isPropertiesPanelOpen ? "Hide properties" : "Show properties"}
                                                >
                                                    <Info className="w-4 h-4" />
                                                </button>
                                                <div className="relative" ref={moreMenuRef}>
                                                    <button
                                                        onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                                                        className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                    {/* Reuse More Menu (simplified for implementation speed, ideally separate component) */}
                                                    {isMoreMenuOpen && (
                                                        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-200 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                                                            <div className="px-2 py-1">
                                                                <button onClick={() => { setIsPropertiesPanelOpen(true); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <Settings className="w-4 h-4 text-gray-400" /> <span>Properties</span>
                                                                </button>
                                                                <button onClick={() => { handleDeleteNote(currentNote._id); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 text-red-500 hover:text-red-600">
                                                                    <Trash className="w-4 h-4" /> <span>Move to Trash</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Editor Content */}
                                    <div className="flex-1 overflow-hidden flex flex-col print-content">
                                        {!isZenMode && (
                                            <div className="px-4 sm:px-8 pt-8 pb-4">
                                                {/* Privacy Indicator */}
                                                <div className="mb-4 flex items-center gap-2 text-sm no-print">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 rounded-full border border-pink-200 dark:border-pink-800">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="font-medium">Private Journal</span>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    placeholder="Title"
                                                    className="w-full text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white placeholder-gray-300 border-none focus:outline-none bg-transparent"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 overflow-hidden">
                                            <RichTextEditor
                                                key={currentNote._id}
                                                content={currentNote.content}
                                                onChange={setContent}
                                                isZenMode={isZenMode}
                                                onToggleZenMode={() => setIsZenMode(!isZenMode)}
                                                isSaving={isSaving}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* Empty State */
                                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#1a1a1a] p-4 text-center">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 bg-pink-50 dark:bg-pink-900/20 rounded-2xl shadow-sm flex items-center justify-center">
                                        <Book className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Select a journal to view
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs text-center">
                                        Select a journal entry from the list or create a new one from the Calendar.
                                    </p>
                                </div>
                            )}
                        </div>
                        {/* Properties Panel */}
                        {currentNote && isPropertiesPanelOpen && !isZenMode && (
                            <NotePropertiesPanel
                                note={currentNote}
                                onUpdate={async (updates) => {
                                    try {
                                        await updateNote(currentNote._id, updates);
                                    } catch (error) {
                                        console.error('Failed to update note', error);
                                        toast.error('Failed to update note');
                                    }
                                }}
                                onClose={() => setIsPropertiesPanelOpen(false)}
                            />
                        )}
                    </div>
                );
            case 'notes':
                return (
                    <div className="flex flex-1 h-full overflow-hidden relative">
                        {/* Middle Pane: Notes List */}
                        <div className={`${isZenMode ? 'hidden' : (currentNote ? 'hidden lg:flex' : 'flex')} w-full lg:w-auto h-full border-r border-gray-200 dark:border-[#333]`}>
                            <NotesList
                                notes={notes}
                                currentNote={currentNote}
                                onSelectNote={setCurrentNote}
                                onDeleteNote={handleDeleteNote}
                                onPinNote={handlePinNoteFromList}
                                onDuplicateNote={handleDuplicateNote}
                            />
                        </div>

                        {/* Right Pane: Editor or Empty State */}
                        <div className={`${!currentNote ? 'hidden lg:flex' : 'flex'} flex-1 flex-col bg-white dark:bg-[#1a1a1a] h-full overflow-hidden relative w-full`}>
                            {currentNote ? (
                                <>
                                    {/* Editor Toolbar / Header - Hidden in Zen Mode */}
                                    {!isZenMode && (
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1a1a1a] no-print">
                                            <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-sm overflow-hidden">
                                                {/* Mobile Back Button */}
                                                <button
                                                    onClick={() => setCurrentNote(null)}
                                                    className="lg:hidden p-1 -ml-1 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-full text-gray-600 dark:text-gray-300"
                                                >
                                                    <ArrowLeft className="w-5 h-5" />
                                                </button>

                                                <button
                                                    onClick={() => setIsZenMode(true)}
                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg transition-colors hidden lg:block"
                                                    title="Enter Zen Mode"
                                                >
                                                    <Maximize2 className="w-4 h-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200" />
                                                </button>
                                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden lg:block"></div>
                                                <div className="flex items-center space-x-1 overflow-hidden">
                                                    <span className="hover:underline cursor-pointer hidden sm:inline">First Notebook</span>
                                                    <span className="text-gray-400 hidden sm:inline">›</span>
                                                    <span className="text-gray-900 dark:text-white font-medium truncate max-w-[150px] sm:max-w-[200px]">{title || 'Untitled'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                                                {/* Pin Button */}
                                                <button
                                                    onClick={handlePinNote}
                                                    className={`p-2 rounded-lg transition-colors ${currentNote.isPinned
                                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                        }`}
                                                    title={currentNote.isPinned ? "Unpin note" : "Pin note"}
                                                >
                                                    <Pin className={`w-4 h-4 ${currentNote.isPinned ? 'fill-current' : ''}`} />
                                                </button>

                                                {/* Properties Panel Toggle */}
                                                <button
                                                    onClick={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)}
                                                    className={`p-2 rounded-lg transition-colors ${isPropertiesPanelOpen
                                                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                        }`}
                                                    title={isPropertiesPanelOpen ? "Hide properties" : "Show properties"}
                                                >
                                                    <Info className="w-4 h-4" />
                                                </button>

                                                {/* Color Picker */}
                                                <div className="relative" ref={colorPickerRef}>
                                                    <button
                                                        onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                                                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                        title="Change color"
                                                    >
                                                        <Palette className="w-4 h-4" />
                                                    </button>

                                                    {isColorPickerOpen && (
                                                        <div className="absolute top-full right-0 mt-2 p-3 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl border border-gray-200 dark:border-[#333] z-50 w-48 grid grid-cols-4 gap-2">
                                                            {colors.map((color) => (
                                                                <button
                                                                    key={color}
                                                                    onClick={() => handleColorChange(color)}
                                                                    className={`w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform ${currentNote.color === color ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#1e1e1e]' : ''
                                                                        }`}
                                                                    style={{ backgroundColor: color }}
                                                                    title={color}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Share Button & Menu */}
                                                <div className="relative" ref={shareRef}>
                                                    <button
                                                        onClick={() => setIsShareOpen(!isShareOpen)}
                                                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${isShareOpen
                                                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                            }`}
                                                        title="Share note"
                                                    >
                                                        <Share className="w-4 h-4" />
                                                        <span className="text-sm font-medium hidden sm:inline">Share</span>
                                                    </button>

                                                    {isShareOpen && (
                                                        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white rounded-xl shadow-2xl border border-gray-200 dark:border-[#333] p-5 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                                            <div className="flex items-center justify-between mb-5">
                                                                <h3 className="font-semibold text-lg">Share Note</h3>
                                                                <button onClick={() => setIsShareOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                                                    <X className="w-5 h-5" />
                                                                </button>
                                                            </div>

                                                            <div className="flex space-x-2 mb-6">
                                                                <div className="flex-1 relative">
                                                                    <input
                                                                        type="email"
                                                                        value={inviteEmail}
                                                                        onChange={(e) => setInviteEmail(e.target.value)}
                                                                        placeholder="Add people, groups, or emails"
                                                                        className="w-full bg-gray-50 dark:bg-[#2d2d2d] border border-gray-200 dark:border-[#444] rounded-lg pl-3 pr-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                                                        onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={handleInvite}
                                                                    disabled={!inviteEmail}
                                                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                                                                >
                                                                    Invite
                                                                </button>
                                                            </div>

                                                            <div className="mb-6">
                                                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">People with access</div>
                                                                <div className="flex items-center justify-between group p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] rounded-lg transition-colors cursor-default">
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-[#1e1e1e]">
                                                                            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{user?.name || 'User'} <span className="text-gray-500 font-normal">(you)</span></div>
                                                                            <div className="text-xs text-gray-500">{user?.email || 'user@example.com'}</div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-[#333] px-2 py-1 rounded-full">Owner</span>
                                                                </div>
                                                                {currentNote.sharedWith && currentNote.sharedWith.map((share, index) => (
                                                                    <div key={index} className="flex items-center justify-between group p-2 -mx-2 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] rounded-lg transition-colors cursor-default mt-1">
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-[#1e1e1e]">
                                                                                {share.email.charAt(0).toUpperCase()}
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{share.email}</div>
                                                                                <div className="text-xs text-gray-500 capitalize">{share.permission}</div>
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-[#333] px-2 py-1 rounded-full">Guest</span>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <div className="border-t border-gray-200 dark:border-[#333] pt-4 flex items-center justify-between">
                                                                <div className="relative" ref={accessMenuRef}>
                                                                    <button
                                                                        onClick={() => setIsAccessMenuOpen(!isAccessMenuOpen)}
                                                                        className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#2d2d2d]"
                                                                    >
                                                                        {currentNote.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                                                        <span>{currentNote.isPublic ? 'Anyone with the link' : 'Restricted access'}</span>
                                                                        <ChevronDown className="w-3 h-3" />
                                                                    </button>

                                                                    {isAccessMenuOpen && (
                                                                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-200 dark:border-[#333] py-1 z-50">
                                                                            <button
                                                                                onClick={() => {
                                                                                    updateNote(currentNote._id, { isPublic: false });
                                                                                    setIsAccessMenuOpen(false);
                                                                                    toast.success('Access restricted');
                                                                                }}
                                                                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] flex items-center space-x-2 text-gray-700 dark:text-gray-200"
                                                                            >
                                                                                <Lock className="w-4 h-4" />
                                                                                <span>Restricted</span>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    updateNote(currentNote._id, { isPublic: true });
                                                                                    setIsAccessMenuOpen(false);
                                                                                    toast.success('Link is now public');
                                                                                }}
                                                                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] flex items-center space-x-2 text-gray-700 dark:text-gray-200"
                                                                            >
                                                                                <Globe className="w-4 h-4" />
                                                                                <span>Anyone with link</span>
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    onClick={handleShare}
                                                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#2d2d2d] hover:border-gray-300 dark:hover:border-[#555] transition-all text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                                                >
                                                                    <Link className="w-4 h-4" />
                                                                    <span>Copy link</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* More Actions Menu */}
                                                <div className="relative" ref={moreMenuRef}>
                                                    <button
                                                        onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                                                        className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>

                                                    {isMoreMenuOpen && (
                                                        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-200 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                                            <div className="px-2 py-1">
                                                                <button onClick={() => { setIsPropertiesPanelOpen(true); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <Settings className="w-4 h-4 text-gray-400" /> <span>Properties</span>
                                                                </button>
                                                                <button onClick={() => { toast('Opened in Lite editor', { icon: '📝' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <ExternalLink className="w-4 h-4 text-gray-400" /> <span>Open in Lite editor</span>
                                                                </button>
                                                            </div>
                                                            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                                                            <div className="px-2 py-1">
                                                                <button onClick={() => { handleShare(); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <Share className="w-4 h-4 text-gray-400" /> <span>Share</span>
                                                                </button>
                                                                <button onClick={() => { handleShare(); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <Link className="w-4 h-4 text-gray-400" /> <span>Copy link</span>
                                                                </button>
                                                            </div>
                                                            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                                                            <div className="px-2 py-1">
                                                                <button onClick={() => { toast('Move feature coming soon!', { icon: '🚚' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <FileInput className="w-4 h-4 text-gray-400" /> <span>Move</span>
                                                                </button>
                                                                <button onClick={() => { toast('Copy to feature coming soon!', { icon: '📋' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <Copy className="w-4 h-4 text-gray-400" /> <span>Copy to</span>
                                                                </button>
                                                                <button onClick={() => { toast('Note duplicated!', { icon: '✨' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <Files className="w-4 h-4 text-gray-400" /> <span>Duplicate</span>
                                                                </button>
                                                            </div>
                                                            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                                                            <div className="px-2 py-1">
                                                                <button onClick={() => { toast('Edit tags feature coming soon!', { icon: '🏷️' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <Tag className="w-4 h-4 text-gray-400" /> <span>Edit tags</span>
                                                                </button>
                                                                <button onClick={() => { toast('Saved as template!', { icon: '💾' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <FileText className="w-4 h-4 text-gray-400" /> <span>Save as Template</span>
                                                                </button>
                                                            </div>
                                                            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                                                            <div className="px-2 py-1">
                                                                <button onClick={() => { toast('Added to shortcuts!', { icon: '⭐' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <Star className="w-4 h-4 text-gray-400" /> <span>Add to Shortcuts</span>
                                                                </button>
                                                                <button onClick={() => { handlePinNote(); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <Pin className="w-4 h-4 text-gray-400" /> <span>{currentNote.isPinned ? 'Unpin from Notebook' : 'Pin to Notebook'}</span>
                                                                </button>
                                                                <button onClick={() => { toast('Pinned to home!', { icon: '🏠' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <Pin className="w-4 h-4 text-gray-400" /> <span>Pin to Home</span>
                                                                </button>
                                                            </div>
                                                            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                                                            <div className="px-2 py-1">
                                                                <button onClick={() => { setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <ChevronsUpDown className="w-4 h-4 text-gray-400" /> <span>Collapsible sections</span>
                                                                </button>
                                                            </div>
                                                            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                                                            <div className="px-2 py-1">
                                                                <button onClick={() => { toast('Find feature coming soon!', { icon: '🔍' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <Search className="w-4 h-4 text-gray-400" /> <span>Find in note</span>
                                                                </button>
                                                                <button onClick={() => { toast('Note info: Created just now', { icon: 'ℹ️' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <Info className="w-4 h-4 text-gray-400" /> <span>Note info</span>
                                                                </button>
                                                                <button onClick={() => { toast('History feature coming soon!', { icon: 'clock' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <History className="w-4 h-4 text-gray-400" /> <span>Note history</span>
                                                                </button>
                                                            </div>
                                                            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                                                            <div className="px-2 py-1">
                                                                <button onClick={() => { window.print(); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3">
                                                                    <Printer className="w-4 h-4 text-gray-400" /> <span>Print</span>
                                                                </button>
                                                                <button onClick={() => { handleDeleteNote(currentNote._id); setIsMoreMenuOpen(false); }} className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
                                                                    <Trash className="w-4 h-4" /> <span>Move to Trash</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Editor Content */}
                                    <div className="flex-1 overflow-hidden flex flex-col print-content">
                                        {!isZenMode && (
                                            <div className="px-4 sm:px-8 pt-8 pb-4">
                                                {/* Privacy Indicator for Journals */}
                                                {activeJournal && currentNote?.isJournal && (
                                                    <div className="mb-4 flex items-center gap-2 text-sm no-print">
                                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 rounded-full border border-pink-200 dark:border-pink-800 animate-fadeIn">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="font-medium">Private</span>
                                                            <span className="text-pink-600/70 dark:text-pink-400/70">•</span>
                                                            <span className="text-xs">Only visible while viewing</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <input
                                                    type="text"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    placeholder="Title"
                                                    className="w-full text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white placeholder-gray-300 border-none focus:outline-none bg-transparent"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 overflow-hidden">
                                            <RichTextEditor
                                                key={currentNote._id}
                                                content={currentNote.content || ''}
                                                onChange={setContent}
                                                template={currentNote.template || 'blank'}
                                                onTemplateChange={(newTemplate) => updateNote(currentNote._id, { template: newTemplate })}
                                                isZenMode={isZenMode}
                                                onToggleZenMode={() => setIsZenMode(!isZenMode)}
                                                isSaving={isSaving}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* Empty State - Green Icon */
                                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#1a1a1a] p-4 text-center">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 bg-white dark:bg-[#262626] rounded-2xl shadow-sm flex items-center justify-center">
                                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Select a note to view
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs text-center mb-8">
                                        Choose a note from the list, or create a new one to get started.
                                    </p>
                                    <button
                                        onClick={handleCreateNote}
                                        className="bg-[#00a82d] hover:bg-[#008f26] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center space-x-2"
                                    >
                                        <FileText className="w-4 h-4" />
                                        <span>Create New Note</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Properties Panel */}
                        {currentNote && isPropertiesPanelOpen && !isZenMode && (
                            <NotePropertiesPanel
                                note={currentNote}
                                onUpdate={async (updates) => {
                                    try {
                                        await updateNote(currentNote._id, updates);
                                    } catch (error) {
                                        console.error('Failed to update note', error);
                                        toast.error('Failed to update note');
                                    }
                                }}
                                onClose={() => setIsPropertiesPanelOpen(false)}
                            />
                        )}
                    </div >
                );
        }
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-white dark:bg-[#1a1a1a] overflow-hidden font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {!isZenMode && (
                <Sidebar
                    activeView={activeView}
                    setActiveView={(view) => {
                        setActiveView(view);
                        setIsSidebarOpen(false); // Close sidebar on mobile when view changes
                    }}
                    onCreateNote={handleCreateNote}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Header */}
                {!isZenMode && (
                    <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] z-30">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="font-semibold text-gray-900 dark:text-white capitalize">{activeView}</span>
                        <div className="w-8"></div> {/* Spacer for centering */}
                    </div>
                )}

                {renderMainContent()}
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteNote}
                noteTitle={noteToDelete?.title}
            />

            {/* Friendly AI Chatbot */}
            <Chatbot />
        </div>
    );
};

export default Dashboard;
