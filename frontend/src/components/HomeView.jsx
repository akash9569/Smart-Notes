import React, { useState, useEffect } from 'react';
import {
    Plus,
    FileText,
    CheckSquare,
    Book,
    Calendar,
    Clock,
    ArrowRight,
    Star,
    Layout,
    Wallet,
    Activity,
    StickyNote,
    TrendingUp,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';
import { tasksAPI, habitsAPI, expensesAPI, stickyNotesAPI } from '../api';
import { format, isToday } from 'date-fns';

const HomeView = ({ setActiveView, onCreateNote }) => {
    const { notes, setCurrentNote } = useNotes();
    const { user } = useAuth();
    const [greeting, setGreeting] = useState('');

    // Module Data States
    const [tasks, setTasks] = useState([]);
    const [habits, setHabits] = useState([]);
    const [expenses, setExpenses] = useState({ totalBalance: 0, monthlyExpenses: 0 });
    const [stickyNotes, setStickyNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');

        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [tasksRes, habitsRes, expensesRes, stickyRes] = await Promise.allSettled([
                tasksAPI.getTasks(),
                habitsAPI.getHabits(),
                expensesAPI.getStats(),
                stickyNotesAPI.getStickyNotes()
            ]);

            if (tasksRes.status === 'fulfilled') setTasks(tasksRes.value.data.data.tasks || []);
            if (habitsRes.status === 'fulfilled') setHabits(habitsRes.value.data || []);
            if (expensesRes.status === 'fulfilled') setExpenses(expensesRes.value.data.data.summary || { totalBalance: 0, monthlyExpenses: 0 });
            if (stickyRes.status === 'fulfilled') setStickyNotes(stickyRes.value.data.data.notes || []);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Derived Stats
    const recentNotes = notes
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 4);

    const favorites = notes.filter(n => n.isFavorite).slice(0, 3);

    const todaysTasks = tasks.filter(t => !t.completed && (isToday(new Date(t.dueDate)) || !t.dueDate)).slice(0, 3);
    const pinnedSticky = stickyNotes.find(n => n.isPinned) || stickyNotes[0];
    const todayHabits = habits.filter(h => {
        // Simplified logic: Check if habit is scheduled for today (assuming daily for now or checking days array)
        // For MPV dashboard, just showing total active habits
        return h.active !== false;
    });
    const completedHabitsCount = todayHabits.filter(h =>
        h.completedDates && h.completedDates.some(d => isToday(new Date(d)))
    ).length;

    return (
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB] dark:bg-[#111827] p-8">
            <div className="max-w-8xl mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
                            {greeting}, {user?.name || 'Akash Singh'} <span className="opacity-50">👋</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-normal">
                            Here's your overview for today
                        </p>
                    </div>
                    <div className="text-right hidden md:block pb-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 opacity-80">
                            {format(new Date(), 'eeee, MMMM do')}
                        </p>
                    </div>
                </div>

                {/* Module Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Expenses Widget */}
                    <div onClick={() => setActiveView('expenses')} className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</span>
                            <Wallet className="w-5 h-5 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 p-1 rounded-md" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            ₹{expenses.totalBalance.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <ArrowRight className="w-3 h-3 rotate-45 text-red-500" />
                            ₹{expenses.monthlyExpenses.toLocaleString()} spent this month
                        </div>
                    </div>

                    {/* Habits Widget */}
                    <div onClick={() => setActiveView('habits')} className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Habits Today</span>
                            <Activity className="w-5 h-5 text-blue-500 bg-blue-50 dark:bg-blue-900/20 p-1 rounded-md" />
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{completedHabitsCount}</span>
                            <span className="text-sm text-gray-400 mb-1">/ {todayHabits.length} completed</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 mt-3 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${todayHabits.length ? (completedHabitsCount / todayHabits.length) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Pending Tasks Widget */}
                    <div onClick={() => setActiveView('tasks')} className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Due</span>
                            <CheckSquare className="w-5 h-5 text-purple-500 bg-purple-50 dark:bg-purple-900/20 p-1 rounded-md" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {todaysTasks.length}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            Pending for today
                        </div>
                    </div>
                </div>

                {/* Quick Actions Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <button
                        onClick={() => onCreateNote({ title: '', content: '' })}
                        className="h-24 p-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg shadow-blue-900/10 hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-between group relative overflow-hidden"
                    >
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-lg tracking-wide">New Note</span>
                        </div>
                        <Plus className="w-24 h-24 absolute -right-4 -bottom-4 text-white opacity-10 group-hover:scale-110 transition-transform duration-500" />
                    </button>

                    <button
                        onClick={() => setActiveView('stickyNotes')}
                        className="h-24 p-5 bg-white dark:bg-[#1F2937] border border-gray-100 dark:border-gray-700 hover:border-yellow-200 dark:hover:border-yellow-900/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-4 group"
                    >
                        <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <StickyNote className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">Sticky Notes</span>
                    </button>

                    <button
                        onClick={() => setActiveView('journals')}
                        className="h-24 p-5 bg-white dark:bg-[#1F2937] border border-gray-100 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-900/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-4 group"
                    >
                        <div className="w-10 h-10 bg-pink-50 dark:bg-pink-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Book className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Journal</span>
                    </button>

                    <button
                        onClick={() => setActiveView('calendar')}
                        className="h-24 p-5 bg-white dark:bg-[#1F2937] border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-900/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-4 group"
                    >
                        <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Calendar</span>
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Recent Notes & Tasks */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Notes Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    Recently Edited
                                </h2>
                                <button
                                    onClick={() => setActiveView('notes')}
                                    className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                >
                                    View all
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recentNotes.length > 0 ? recentNotes.map(note => (
                                    <div
                                        key={note._id}
                                        onClick={() => {
                                            setCurrentNote(note);
                                            setActiveView('notes');
                                        }}
                                        className="bg-white dark:bg-[#1F2937] p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-blue-500/20 dark:hover:border-blue-500/30 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-40 relative"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`p-1.5 rounded-lg transition-colors ${note.isFavorite ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                                                {note.isFavorite ? <Star className="w-4 h-4 fill-current" /> : <FileText className="w-4 h-4" />}
                                            </div>
                                            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                                                {format(new Date(note.updatedAt), 'MMM d')}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {note.title || 'Untitled Note'}
                                        </h3>

                                    </div>
                                )) : (
                                    <div className="col-span-2 py-12 text-center bg-white dark:bg-[#1F2937] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                        <p className="text-gray-500 font-medium">No notes created yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tasks List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-gray-400" />
                                    Upcoming Tasks
                                </h2>
                                <button
                                    onClick={() => setActiveView('tasks')}
                                    className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                >
                                    Manage
                                </button>
                            </div>
                            <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                                {todaysTasks.length > 0 ? (
                                    todaysTasks.map((task, idx) => (
                                        <div key={task._id} className={`p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors ${idx !== todaysTasks.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
                                            <div className={`w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center`}>
                                            </div>
                                            <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">{task.title}</span>
                                            {task.priority && (
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-600' :
                                                    task.priority === 'Medium' ? 'bg-orange-100 text-orange-600' :
                                                        'bg-green-100 text-green-600'
                                                    }`}>
                                                    {task.priority}
                                                </span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500 text-sm">No tasks due today. You're all caught up!</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Notes & Favorites */}
                    <div className="space-y-8">
                        {/* Sticky Note Widget */}
                        <div className="space-y-4">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <StickyNote className="w-4 h-4 text-yellow-500" />
                                Pinned Note
                            </h3>
                            {pinnedSticky ? (
                                <div
                                    className="p-6 rounded-2xl shadow-sm rotate-1 hover:rotate-0 transition-transform duration-300 relative overflow-hidden group min-h-[160px]"
                                    style={{ backgroundColor: pinnedSticky.color || '#fff9c4' }}
                                    onClick={() => setActiveView('stickyNotes')}
                                >
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-4 h-4 text-gray-700" />
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-2">{pinnedSticky.title || 'Untitled'}</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {typeof pinnedSticky.content === 'string'
                                            ? pinnedSticky.content
                                            : pinnedSticky.content?.map(i => i.text).join('\n') || ''}
                                    </p>
                                </div>
                            ) : (
                                <div className="p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-dashed border-yellow-200 dark:border-yellow-700/50 text-center">
                                    <StickyNote className="w-8 h-8 text-yellow-400 mx-auto mb-2 opacity-50" />
                                    <p className="text-xs text-yellow-600 dark:text-yellow-400/70">Pin a sticky note to see it here</p>
                                </div>
                            )}
                        </div>

                        {/* Favorites Widget */}
                        <div className="bg-white dark:bg-[#1F2937] rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] transform translate-x-1/3 -translate-y-1/3 pointer-events-none">
                                <Star className="w-32 h-32" />
                            </div>

                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                Favorites
                            </h3>
                            <div className="space-y-2">
                                {favorites.length > 0 ? favorites.map(note => (
                                    <div
                                        key={note._id}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#374151] transition-colors cursor-pointer group border border-transparent hover:border-gray-100 dark:hover:border-gray-600"
                                    >
                                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.5)]"></div>
                                        <span className="font-medium text-sm text-gray-700 dark:text-gray-300 truncate flex-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                            {note.title || 'Untitled'}
                                        </span>
                                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                                    </div>
                                )) : (
                                    <div className="py-8 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                                        <Star className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs text-gray-400">Pin notes to see them here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeView;
