import React, { createContext, useContext, useState, useEffect } from 'react';
import { notesAPI } from '../api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [journals, setJournals] = useState([]); // Separate state for journals
    const [currentNote, setCurrentNote] = useState(null);
    const [activeJournal, setActiveJournal] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchNotes();
        } else {
            setNotes([]);
            setJournals([]);
            setCurrentNote(null);
        }
    }, [user]);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            let allNotes = [];
            if (user?.isOffline) {
                allNotes = JSON.parse(localStorage.getItem('offline_notes') || '[]');
            } else {
                const response = await notesAPI.getNotes();
                allNotes = response.data.data.notes;
            }

            // Separate journals and regular notes
            const regularNotes = allNotes.filter(note => !note.isJournal);
            const journalEntries = allNotes.filter(note => note.isJournal);

            setNotes(regularNotes);
            setJournals(journalEntries);
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const createNote = async (data) => {
        try {
            let newNote;
            if (user?.isOffline) {
                newNote = {
                    ...data,
                    _id: `offline_${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    user: user._id
                };
                const existingNotes = JSON.parse(localStorage.getItem('offline_notes') || '[]');
                const updatedNotes = [newNote, ...existingNotes];
                localStorage.setItem('offline_notes', JSON.stringify(updatedNotes));
            } else {
                const response = await notesAPI.createNote(data);
                newNote = response.data.data.note;
            }

            if (newNote.isJournal) {
                setJournals([newNote, ...journals]);
            } else {
                setNotes([newNote, ...notes]);
            }

            setCurrentNote(newNote);
            return newNote;
        } catch (error) {
            toast.error('Failed to create note');
            throw error;
        }
    };

    const updateNote = async (id, data) => {
        try {
            let updatedNote;
            if (user?.isOffline) {
                const existingNotes = JSON.parse(localStorage.getItem('offline_notes') || '[]');
                const index = existingNotes.findIndex(n => n._id === id);
                if (index !== -1) {
                    updatedNote = { ...existingNotes[index], ...data, updatedAt: new Date().toISOString() };
                    existingNotes[index] = updatedNote;
                    localStorage.setItem('offline_notes', JSON.stringify(existingNotes));
                } else {
                    throw new Error('Note not found locally');
                }
            } else {
                const response = await notesAPI.updateNote(id, data);
                updatedNote = response.data.data.note;
            }

            if (updatedNote.isJournal) {
                setJournals(journals.map(j => j._id === id ? updatedNote : j));
            } else {
                setNotes(notes.map(n => n._id === id ? updatedNote : n));
            }

            if (currentNote?._id === id) {
                setCurrentNote(updatedNote);
            }
            return updatedNote;
        } catch (error) {
            console.error('Failed to update note:', error);
            throw error;
        }
    };

    const deleteNote = async (id) => {
        try {
            if (user?.isOffline) {
                const existingNotes = JSON.parse(localStorage.getItem('offline_notes') || '[]');
                const filteredNotes = existingNotes.filter(n => n._id !== id);
                localStorage.setItem('offline_notes', JSON.stringify(filteredNotes));
            } else {
                await notesAPI.deleteNote(id);
            }

            // Try removing from both to be safe, though ID is unique
            setNotes(prevNotes => prevNotes.filter(n => n._id !== id));
            setJournals(prevJournals => prevJournals.filter(j => j._id !== id));

            if (currentNote?._id === id) {
                setCurrentNote(null);
            }
            toast.success('Note deleted');
        } catch (error) {
            console.error('Delete note error:', error);
            toast.error('Failed to delete note');
        }
    };

    const shareNote = async (id, email, permission) => {
        if (user?.isOffline) {
            toast.error('Sharing is not available offline');
            return;
        }
        try {
            const response = await notesAPI.shareNote(id, { email, permission });
            const updatedNote = response.data.data.note;

            if (updatedNote.isJournal) {
                setJournals(journals.map(j => j._id === id ? updatedNote : j));
            } else {
                setNotes(notes.map(n => n._id === id ? updatedNote : n));
            }

            if (currentNote?._id === id) {
                setCurrentNote(updatedNote);
            }
            toast.success(`Invitation sent to ${email}`);
            return updatedNote;
        } catch (error) {
            console.error('Share note error:', error);
            toast.error('Failed to share note');
            throw error;
        }
    };

    const getJournal = async (date) => {
        try {
            let allNotes = [];
            if (user?.isOffline) {
                allNotes = JSON.parse(localStorage.getItem('offline_notes') || '[]');
            } else {
                const response = await notesAPI.getNotes();
                allNotes = response.data.data.notes;
            }

            const journal = allNotes.find(note =>
                note.isJournal &&
                new Date(note.createdAt).toDateString() === new Date(date).toDateString()
            );
            return journal;
        } catch (error) {
            console.error('Failed to get journal:', error);
            return null;
        }
    };

    const clearActiveJournal = () => {
        setActiveJournal(null);
    };

    return (
        <NotesContext.Provider value={{
            notes,
            currentNote,
            setCurrentNote,
            loading,
            createNote,
            updateNote,
            deleteNote,
            shareNote,
            fetchNotes,
            activeJournal,
            setActiveJournal,
            getJournal,
            clearActiveJournal,
            journals // Expose journals state
        }}>
            {children}
        </NotesContext.Provider>
    );
};
