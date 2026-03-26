import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { useSettings } from '../context/SettingsContext';
import Sidebar from '../components/Sidebar';

import NotesList from '../components/NotesList';
import RichTextEditor from '../components/RichTextEditor';
import PrintPreviewModal from '../components/PrintPreviewModal';
import { printNote } from '../utils/printNote';
import HomeView from '../components/HomeView';
import CalendarView from '../components/CalendarView';
import TasksView from '../components/TasksView';
import NotebooksView from '../components/NotebooksView';
import SettingsView from '../components/SettingsView';
import AccountInfoView from '../components/AccountInfoView';
import TemplatesView from '../components/TemplatesView';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Chatbot from '../components/Chatbot';
import NotePropertiesPanel from '../components/NotePropertiesPanel';
import ExpensesView from '../components/ExpensesView';
import HabitTracker from '../components/HabitTracker';
import TimelineView from '../components/TimelineView';
import StickyNotesView from '../components/StickyNotes/StickyNotesView';
import JournalsView from '../components/JournalsView';
import JournalEntry from '../components/JournalEntry';
import {
    Maximize2,
    MoreHorizontal,
    Share2,
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
    const navigate = useNavigate();
    const location = useLocation();

    // ... existing hooks
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
    const { autoSaveInterval } = useSettings();

    const [activeView, setActiveView] = useState('home');

    // Sync View with URL
    useEffect(() => {
        const path = location.pathname.substring(1); // /tasks -> tasks
        if (path && path !== '') {
            // Mapping special cases if needed, else exact match
            // /notes/:id is handled by note selection logic ideally, 
            // but for now let's just switch view.

            // If path contains slash, take first part? e.g. notes/123 -> notes
            const view = path.split('/')[0];
            setActiveView(view);
        } else {
            setActiveView('home');
        }

        // Handle Command Palette Actions
        if (location.state?.action === 'create' && path.startsWith('notes')) {
            handleCreateNote();
            // Clear state?
            window.history.replaceState({}, document.title);
        }
    }, [location]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Menu States
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isDashboardPrintOpen, setIsDashboardPrintOpen] = useState(false);
    const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false);
    const [editingAccessForIndex, setEditingAccessForIndex] = useState(null);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const shareRef = React.useRef(null);
    const accessMenuRef = React.useRef(null);
    const guestAccessMenuRef = React.useRef(null);
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
                setEditingAccessForIndex(null);
                setIsAccessMenuOpen(false);
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
            if (guestAccessMenuRef.current && !guestAccessMenuRef.current.contains(event.target)) {
                setEditingAccessForIndex(null);
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
        }, parseInt(autoSaveInterval || 2) * 1000);

        return () => clearTimeout(timer);
    }, [title, content, currentNote, updateNote, autoSaveInterval]);

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
            case 'timeline':
                return <TimelineView />;
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
            case 'account-info':
                return <AccountInfoView />;
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
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1a1a1a] no-print relative z-30">
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
                                        <div className="flex-1 overflow-hidden flex flex-col">
                                            <JournalEntry
                                                note={currentNote}
                                                onUpdate={async (updates) => {
                                                    await updateNote(currentNote._id, updates);
                                                }}
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
                        <div className={`${!currentNote ? 'hidden lg:flex' : 'flex'} flex-1 flex-col bg-white dark:bg-[#111111] h-full overflow-hidden relative w-full`}>
                            {currentNote ? (
                                <>
                                    {/* Editor Toolbar / Header - Hidden in Zen Mode */}
                                    {!isZenMode && (
                                        <div className="px-5 py-2.5 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md no-print relative z-30 transition-colors duration-300">
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
                                                <div className="flex items-center space-x-1.5 overflow-hidden text-[13px]">
                                                    <span className="text-gray-900 dark:text-gray-100 font-semibold truncate max-w-[150px] sm:max-w-[200px] tracking-wide">{title || 'Untitled'}</span>
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
                                                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-200 ${isShareOpen
                                                            ? 'bg-blue-700 text-white shadow-inner'
                                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
                                                            }`}
                                                        title="Share note"
                                                    >
                                                        <Share2 className="w-4 h-4" />
                                                        <span className="text-[13px] font-semibold hidden sm:inline tracking-wide">Share</span>
                                                    </button>

                                                    {isShareOpen && (
                                                        <div className="absolute top-full right-0 mt-2 w-80 sm:w-[440px] bg-white dark:bg-[#242424] text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl border border-gray-200 dark:border-[#333] p-0 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right flex flex-col font-sans">

                                                            {/* Header */}
                                                            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                                                                <h3 className="font-normal text-[22px] tracking-tight">Share</h3>
                                                                <button onClick={() => setIsShareOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333] p-2 rounded-full transition-colors flex items-center justify-center">
                                                                    <X className="w-5 h-5" />
                                                                </button>
                                                            </div>

                                                            {/* Input Section */}
                                                            <div className="px-6 pb-5">
                                                                <div className="flex items-center bg-white dark:bg-[#1e1e1e] border border-gray-400 dark:border-[#555] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 rounded-lg overflow-hidden transition-all duration-200">
                                                                    <input
                                                                        type="email"
                                                                        value={inviteEmail}
                                                                        onChange={(e) => setInviteEmail(e.target.value)}
                                                                        placeholder="Add people, groups, or emails"
                                                                        className="flex-1 bg-transparent pl-3 pr-3 py-3 text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none"
                                                                        onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                                                                    />
                                                                    <div className="pr-2 flex items-center">
                                                                        <button
                                                                            onClick={handleInvite}
                                                                            disabled={!inviteEmail}
                                                                            className="h-[36px] bg-blue-600 hover:bg-blue-700 disabled:bg-transparent disabled:text-gray-400 text-white px-4 rounded-full text-[14px] font-medium transition-colors"
                                                                        >
                                                                            Invite
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* People with access */}
                                                            <div className="px-6 pb-4 flex-1 overflow-y-visible max-h-[220px] custom-scrollbar">
                                                                <div className="text-[14px] font-medium text-gray-900 dark:text-gray-200 mb-3">People with access</div>

                                                                <div className="flex items-center justify-between group py-2">
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="w-10 h-10 shrink-0 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-[16px]">
                                                                            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <div className="text-[14px] font-medium text-gray-900 dark:text-gray-100 truncate">{user?.name || 'User'} <span className="text-gray-500 font-normal ml-1">(you)</span></div>
                                                                            <div className="text-[13px] text-gray-500 truncate">{user?.email || 'user@example.com'}</div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-[13px] text-gray-500 pr-2 shrink-0">Owner</span>
                                                                </div>

                                                                {currentNote.sharedWith && currentNote.sharedWith.map((share, index) => (
                                                                    <div key={index} className="flex items-center justify-between group py-2">
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className="w-10 h-10 shrink-0 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-[16px]">
                                                                                {share.email.charAt(0).toUpperCase()}
                                                                            </div>
                                                                            <div className="min-w-0">
                                                                                <div className="text-[14px] font-medium text-gray-900 dark:text-gray-100 truncate">{share.email}</div>
                                                                                <div className="text-[13px] text-gray-500 capitalize truncate">{share.permission === 'view' ? 'Viewer' : 'Editor'}</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="shrink-0 flex items-center space-x-2 pr-2">
                                                                            <div className="flex bg-gray-100 dark:bg-[#333] p-1 rounded-lg">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        if (share.permission !== 'view') {
                                                                                            const newSharedWith = [...currentNote.sharedWith];
                                                                                            newSharedWith[index].permission = 'view';
                                                                                            updateNote(currentNote._id, { sharedWith: newSharedWith });
                                                                                            toast.success('Permission updated to Viewer');
                                                                                        }
                                                                                    }}
                                                                                    className={`text-[12px] font-medium px-2.5 py-1 rounded-md transition-all ${share.permission === 'view' ? 'bg-white dark:bg-[#444] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-[#444]/50'}`}
                                                                                >
                                                                                    Viewer
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        if (share.permission !== 'edit') {
                                                                                            const newSharedWith = [...currentNote.sharedWith];
                                                                                            newSharedWith[index].permission = 'edit';
                                                                                            updateNote(currentNote._id, { sharedWith: newSharedWith });
                                                                                            toast.success('Permission updated to Editor');
                                                                                        }
                                                                                    }}
                                                                                    className={`text-[12px] font-medium px-2.5 py-1 rounded-md transition-all ${share.permission === 'edit' ? 'bg-white dark:bg-[#444] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-[#444]/50'}`}
                                                                                >
                                                                                    Editor
                                                                                </button>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => {
                                                                                    const newSharedWith = currentNote.sharedWith.filter((_, i) => i !== index);
                                                                                    updateNote(currentNote._id, { sharedWith: newSharedWith });
                                                                                    toast.success('Access removed');
                                                                                }}
                                                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                                title="Remove access"
                                                                            >
                                                                                <X className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {/* General Access & Copy Link Footer */}
                                                            <div className="bg-[#f8f9fa] dark:bg-[#1f1f1f] p-4 px-6 flex items-center justify-between border-t border-gray-200 dark:border-[#333] rounded-b-2xl">
                                                                <div className="flex items-center space-x-3 overflow-hidden">
                                                                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#e8eaed] dark:bg-[#333] flex items-center justify-center text-gray-700 dark:text-gray-300">
                                                                        {currentNote.isPublic ? <Globe className="w-[18px] h-[18px]" /> : <Lock className="w-[18px] h-[18px]" />}
                                                                    </div>
                                                                    <div className="relative overflow-hidden" ref={accessMenuRef}>
                                                                        <button
                                                                            onClick={() => setIsAccessMenuOpen(!isAccessMenuOpen)}
                                                                            className="flex items-center space-x-1 text-[14px] font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-[#333] py-0.5 px-1.5 -ml-1.5 rounded transition-colors"
                                                                        >
                                                                            <span className="truncate">{currentNote.isPublic ? 'Anyone with the link' : 'Restricted'}</span>
                                                                            <ChevronDown className="w-3 h-3 text-gray-500 shrink-0" />
                                                                        </button>
                                                                        <div className="text-[12px] text-gray-500 mt-0.5 truncate pr-2">
                                                                            {currentNote.isPublic ? 'Anyone on the internet with the link can view' : 'Only people with access can open with the link'}
                                                                        </div>
                                                                        {isAccessMenuOpen && (
                                                                            <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-[#2a2a2a] rounded-xl shadow-lg border border-gray-100 dark:border-[#444] py-1.5 z-50">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        updateNote(currentNote._id, { isPublic: false });
                                                                                        setIsAccessMenuOpen(false);
                                                                                        toast.success('Access restricted');
                                                                                    }}
                                                                                    className="w-full text-left px-4 py-2 text-[14px] hover:bg-gray-50 dark:hover:bg-[#3a3a3a] flex items-center justify-between group"
                                                                                >
                                                                                    <div>
                                                                                        <div className="font-medium text-gray-900 dark:text-gray-100">Restricted</div>
                                                                                        <div className="text-gray-500 dark:text-gray-400 text-[12px] group-hover:text-gray-600 dark:group-hover:text-gray-300">Only people with access can open</div>
                                                                                    </div>
                                                                                    {!currentNote.isPublic && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>}
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        updateNote(currentNote._id, { isPublic: true });
                                                                                        setIsAccessMenuOpen(false);
                                                                                        toast.success('Link is now public');
                                                                                    }}
                                                                                    className="w-full text-left px-4 py-2 text-[14px] hover:bg-gray-50 dark:hover:bg-[#3a3a3a] flex items-center justify-between group"
                                                                                >
                                                                                    <div>
                                                                                        <div className="font-medium text-gray-900 dark:text-gray-100">Anyone with the link</div>
                                                                                        <div className="text-gray-500 dark:text-gray-400 text-[12px] group-hover:text-gray-600 dark:group-hover:text-gray-300">Anyone on the internet can view</div>
                                                                                    </div>
                                                                                    {currentNote.isPublic && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>}
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(`${window.location.origin}/notes/${currentNote._id}`);
                                                                        toast.success('Link copied to clipboard');
                                                                    }}
                                                                    className="shrink-0 ml-3 py-2 px-4 rounded-full border border-gray-300 dark:border-[#4b4b4b] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] hover:border-gray-400 dark:hover:border-[#666] transition-colors text-[14px] font-medium text-blue-600 dark:text-blue-400 flex items-center space-x-2"
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
                                                        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-200 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-[#333] py-2 z-50 max-h-[85vh] overflow-y-auto custom-scrollbar font-sans">

                                                            <div className="px-2">
                                                                <button onClick={() => { setIsPropertiesPanelOpen(true); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <Settings className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Properties</span>
                                                                </button>
                                                                <button onClick={() => { toast('Opened in Lite editor', { icon: '📝' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Open in Lite editor</span>
                                                                </button>
                                                            </div>

                                                            <div className="h-px bg-gray-100 dark:bg-[#333] my-1.5 mx-2" />

                                                            <div className="px-2">
                                                                <button onClick={() => { setIsShareOpen(true); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <Share2 className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Share</span>
                                                                </button>
                                                                <button onClick={() => { handleShare(); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <Link className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Copy link</span>
                                                                </button>
                                                            </div>

                                                            <div className="h-px bg-gray-100 dark:bg-[#333] my-1.5 mx-2" />

                                                            <div className="px-2">
                                                                <button onClick={() => { toast('Move feature coming soon!', { icon: '🚚' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <FileInput className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Move</span>
                                                                </button>
                                                                <button onClick={() => { toast('Copy to feature coming soon!', { icon: '📋' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Copy to</span>
                                                                </button>
                                                                <button onClick={() => { handleDuplicateNote(currentNote._id); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <Files className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Duplicate</span>
                                                                </button>
                                                            </div>

                                                            <div className="h-px bg-gray-100 dark:bg-[#333] my-1.5 mx-2" />

                                                            <div className="px-2">
                                                                <button onClick={() => { toast('Edit tags feature coming soon!', { icon: '🏷️' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <Tag className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Edit tags</span>
                                                                </button>
                                                                <button onClick={() => { toast('Saved as template!', { icon: '💾' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <FileText className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Save as Template</span>
                                                                </button>
                                                            </div>

                                                            <div className="h-px bg-gray-100 dark:bg-[#333] my-1.5 mx-2" />

                                                            <div className="px-2">
                                                                <button onClick={() => { toast('Added to shortcuts!', { icon: '⭐' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <Star className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Add to Shortcuts</span>
                                                                </button>
                                                                <button onClick={() => { handlePinNote(); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <Pin className={`w-4 h-4 ${currentNote.isPinned ? 'fill-current text-blue-500' : 'text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'} transition-colors`} /> <span className="text-gray-700 dark:text-gray-200">{currentNote.isPinned ? 'Unpin from Notebook' : 'Pin to Notebook'}</span>
                                                                </button>
                                                                <button onClick={() => { toast('Pinned to home!', { icon: '🏠' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <Pin className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Pin to Home</span>
                                                                </button>
                                                            </div>

                                                            <div className="h-px bg-gray-100 dark:bg-[#333] my-1.5 mx-2" />

                                                            <div className="px-2">
                                                                <button onClick={() => { setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <ChevronsUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Collapsible sections</span>
                                                                </button>
                                                            </div>

                                                            <div className="h-px bg-gray-100 dark:bg-[#333] my-1.5 mx-2" />

                                                            <div className="px-2">
                                                                <button onClick={() => { toast('Find feature coming soon!', { icon: '🔍' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Find in note</span>
                                                                </button>
                                                                <button onClick={() => { setIsPropertiesPanelOpen(true); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <Info className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Note info</span>
                                                                </button>
                                                                <button onClick={() => { toast('History feature coming soon!', { icon: 'clock' }); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <History className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Note history</span>
                                                                </button>
                                                            </div>

                                                            <div className="h-px bg-gray-100 dark:bg-[#333] my-1.5 mx-2" />

                                                            <div className="px-2">
                                                                <button onClick={() => { setIsDashboardPrintOpen(true); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                                                    <Printer className="w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" /> <span className="text-gray-700 dark:text-gray-200">Print</span>
                                                                </button>
                                                                <button onClick={() => { handleDeleteNote(currentNote._id); setIsMoreMenuOpen(false); }} className="w-full text-left px-3 py-2 text-[14px] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center space-x-3 text-red-600 dark:text-red-400 transition-colors group mt-1">
                                                                    <Trash className="w-4 h-4 text-red-500 dark:text-red-400" /> <span>Move to Trash</span>
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
                                                noteTitle={title}
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
        <>
            <PrintPreviewModal
                isOpen={isDashboardPrintOpen}
                onClose={() => setIsDashboardPrintOpen(false)}
                html={content || currentNote?.content || ''}
                title={title || currentNote?.title || 'Untitled Note'}
            />
            <div className="flex h-screen bg-white dark:bg-[#1a1a1a] overflow-hidden font-sans print-root">
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
        </>
    );
};

export default Dashboard;
