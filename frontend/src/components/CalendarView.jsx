import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Filter, Book, Clock, Layout } from 'lucide-react';
import { tasksAPI } from '../api';
import { useNotes } from '../context/NotesContext';
import CreateTaskModal from './CreateTaskModal';
import CalendarDayView from './CalendarDayView';
import EventDetailsPanel from './EventDetailsPanel';
import toast from 'react-hot-toast';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, addHours, startOfDay, endOfDay } from 'date-fns';
import { expandRecurringTasks } from '../utils/taskUtils';

// Premium Color Palette & Styles
const categoryConfig = {
    task: { color: 'bg-emerald-500', border: 'border-emerald-200', text: 'text-emerald-700', bgSoft: 'bg-emerald-50', hover: 'hover:bg-emerald-100', darkColor: 'dark:bg-emerald-600' },
    event: { color: 'bg-violet-500', border: 'border-violet-200', text: 'text-violet-700', bgSoft: 'bg-violet-50', hover: 'hover:bg-violet-100', darkColor: 'dark:bg-violet-600' },
    deadline: { color: 'bg-rose-500', border: 'border-rose-200', text: 'text-rose-700', bgSoft: 'bg-rose-50', hover: 'hover:bg-rose-100', darkColor: 'dark:bg-rose-600' },
    reminder: { color: 'bg-amber-500', border: 'border-amber-200', text: 'text-amber-700', bgSoft: 'bg-amber-50', hover: 'hover:bg-amber-100', darkColor: 'dark:bg-amber-600' },
    class: { color: 'bg-sky-500', border: 'border-sky-200', text: 'text-sky-700', bgSoft: 'bg-sky-50', hover: 'hover:bg-sky-100', darkColor: 'dark:bg-sky-600' },
    personal: { color: 'bg-indigo-500', border: 'border-indigo-200', text: 'text-indigo-700', bgSoft: 'bg-indigo-50', hover: 'hover:bg-indigo-100', darkColor: 'dark:bg-indigo-600' },
    work: { color: 'bg-gray-600', border: 'border-gray-200', text: 'text-gray-700', bgSoft: 'bg-gray-50', hover: 'hover:bg-gray-100', darkColor: 'dark:bg-gray-600' },
};

const CalendarView = ({ onSelectNote }) => {
    // State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month'); // 'month', 'week', 'day'
    const [tasks, setTasks] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeFilters, setActiveFilters] = useState(Object.keys(categoryConfig));
    const [hideCompleted, setHideCompleted] = useState(false);

    // Context
    const { createNote, setActiveJournal, journals } = useNotes();

    // Initial Fetch
    useEffect(() => {
        fetchTasks();
    }, []);

    // API Interactions
    const fetchTasks = async () => {
        try {
            const response = await tasksAPI.getTasks();
            if (response.data && response.data.data) {
                setTasks(response.data.data.tasks || []);
            }
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            toast.error('Could not load calendar events');
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            await tasksAPI.createTask({ ...taskData, completed: false });
            fetchTasks();
            toast.success('Event created!');
        } catch (error) {
            toast.error('Failed to create event');
        }
    };

    const handleUpdateTask = async (taskId, taskData) => {
        try {
            await tasksAPI.updateTask(taskId, taskData);
            fetchTasks();
            if (selectedEvent && selectedEvent._id === taskId) {
                setSelectedEvent({ ...selectedEvent, ...taskData });
            }
            toast.success('Event updated');
        } catch (error) {
            toast.error('Failed to update event');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await tasksAPI.deleteTask(taskId);
            fetchTasks();
            setSelectedEvent(null);
            toast.success('Event deleted');
        } catch (error) {
            toast.error('Failed to delete event');
        }
    };

    // Navigation Logic
    const navigate = (direction) => {
        const modifier = direction === 'next' ? 1 : -1;
        if (view === 'month') setCurrentDate(addMonths(currentDate, modifier));
        else if (view === 'week') setCurrentDate(addWeeks(currentDate, modifier));
        else setCurrentDate(addDays(currentDate, modifier));
    };

    const getTitle = () => {
        if (view === 'month') return format(currentDate, 'MMMM yyyy');
        if (view === 'week') {
            const start = startOfWeek(currentDate);
            const end = endOfWeek(currentDate);
            return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
        }
        return format(currentDate, 'MMM d, yyyy');
    };

    // Data Processing
    const displayEvents = useMemo(() => {
        let start, end;
        if (view === 'month') {
            start = startOfWeek(startOfMonth(currentDate));
            end = endOfWeek(endOfMonth(currentDate));
        } else if (view === 'week') {
            start = startOfWeek(currentDate);
            end = endOfWeek(currentDate);
        } else {
            start = startOfDay(currentDate);
            end = endOfDay(currentDate);
        }

        const expanded = expandRecurringTasks(tasks, start, end);

        return expanded.filter(task => {
            const matchesCategory = activeFilters.includes(task.category || 'task');
            // We still filter visuals by completion status if toggle is on
            const matchesCompletion = !hideCompleted || !task.completed;
            return matchesCategory && matchesCompletion;
        }).sort((a, b) => {
            const dateA = new Date(a.startDate || a.dueDate || a.createdAt);
            const dateB = new Date(b.startDate || b.dueDate || b.createdAt);
            // Sort completed last
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            return dateA - dateB;
        });
    }, [tasks, view, currentDate, activeFilters, hideCompleted]);


    // Handlers
    const handleGoogleSync = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            { loading: 'Syncing...', success: 'Syned!', error: 'Sync failed' }
        );
    };

    const handleOpenJournal = async (date) => {
        const journalDate = startOfDay(date);
        const existingJournal = journals.find(note => isSameDay(new Date(note.createdAt), journalDate));

        if (existingJournal) {
            setActiveJournal(existingJournal);
            onSelectNote(existingJournal);
        } else {
            const content = `
                <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
                    <h1 style="color: #ec4899; border-bottom: 2px solid #ec4899; padding-bottom: 10px;">🌸 Daily Journal</h1>
                    <p style="color: #666; font-style: italic;"><strong>Date:</strong> ${format(date, 'EEEE, MMMM d, yyyy')}</p>
                    <div style="background-color: #fdf2f8; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                        <h3 style="color: #be185d; margin-top: 0;">🌤️ Mood Check-in</h3>
                        <p>How are you feeling?</p>
                    </div>
                </div>`;

            try {
                const newNote = await createNote({
                    title: `Journal - ${format(date, 'MMM d')}`,
                    content,
                    isJournal: true,
                    isPrivate: true
                });
                if (newNote) {
                    setActiveJournal(newNote);
                    onSelectNote(newNote);
                    fetchTasks();
                }
            } catch (e) { console.error(e); }
        }
    };


    // --- Custom Renderers ---

    const renderMonthCell = (day) => {
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = isSameMonth(day, currentDate);
        const dayEvents = displayEvents.filter(e => isSameDay(new Date(e.startDate || e.dueDate || e.createdAt), day));
        const hasJournal = journals.some(j => isSameDay(new Date(j.createdAt), day));

        // Overflow Handling
        const MAX_VISIBLE_EVENTS = 3;
        const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
        const overflowCount = dayEvents.length - MAX_VISIBLE_EVENTS;

        return (
            <div
                key={day.toString()}
                onClick={() => { setSelectedDate(day); setIsCreateModalOpen(true); }}
                className={`
                    group relative flex flex-col min-h-[140px] p-2 border-b border-r border-gray-100 dark:border-gray-800 transition-all
                    hover:bg-gray-50/80 dark:hover:bg-[#252525] cursor-pointer
                    ${!isCurrentMonth ? 'bg-gray-50/40 dark:bg-[#151515] text-gray-400' : 'bg-white dark:bg-[#1a1a1a]'}
                `}
            >
                {/* Cell Header */}
                <div className="flex justify-between items-start mb-2 h-7">
                    <span className={`
                        w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all
                        ${isToday
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-100 dark:ring-blue-900'
                            : 'text-gray-700 dark:text-gray-300 group-hover:bg-gray-100 dark:group-hover:bg-[#333]'}
                    `}>
                        {format(day, 'd')}
                    </span>

                    {/* Action Icons */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleOpenJournal(day); }}
                            className={`p-1.5 rounded-md hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors ${hasJournal ? 'opacity-100 text-pink-500' : 'text-gray-400 hover:text-pink-600'}`}
                            title="Open Journal"
                        >
                            <Book className={`w-3.5 h-3.5 ${hasJournal ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Events List - Read Only Pills */}
                <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
                    {visibleEvents.map(event => {
                        const config = categoryConfig[event.category || 'task'] || categoryConfig.task;

                        // Read-Only Pill Style
                        const pillStyle = event.completed
                            ? 'bg-gray-100 dark:bg-[#252525] text-gray-400 dark:text-gray-500 line-through decoration-gray-400'
                            : `${config.bgSoft} dark:bg-opacity-10 ${config.text} dark:text-gray-200 border border-transparent`;

                        const borderStyle = !event.completed
                            ? { borderLeftColor: event.color || '' }
                            : {};

                        return (
                            <div
                                key={event._id}
                                onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                                className={`
                                    relative px-2 py-1 rounded-md text-[11px] font-medium shadow-sm transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer
                                    flex items-center gap-1.5 overflow-hidden select-none
                                    ${!event.completed ? 'border-l-[3px]' : ''}
                                    ${pillStyle}
                                    ${!event.completed && !event.color ? `border-l-${config.color.split('-')[1]}-500` : ''}
                                `}
                                style={event.color && !event.completed ? { backgroundColor: event.color + '20', color: event.color, borderLeftColor: event.color } : borderStyle}
                                title={event.completed ? "Completed (View Only)" : event.title}
                            >
                                <span className="truncate flex-1">
                                    {event.title}
                                </span>
                            </div>
                        );
                    })}

                    {overflowCount > 0 && (
                        <div className="text-[10px] font-medium text-gray-400 dark:text-gray-500 pl-1 mt-0.5 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            +{overflowCount} more...
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderMonthGrid = () => {
        const start = startOfWeek(startOfMonth(currentDate));
        const end = endOfWeek(endOfMonth(currentDate));
        const days = eachDayOfInterval({ start, end });

        return (
            <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#1a1a1a]">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#202020]">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 auto-rows-fr flex-1 overflow-y-auto custom-scrollbar">
                    {days.map(day => renderMonthCell(day))}
                </div>
            </div>
        );
    };


    return (
        <div className="flex-1 h-full flex flex-col bg-gray-50 dark:bg-[#121212] overflow-hidden relative">
            <div className="w-full h-full max-w-7xl mx-auto flex flex-col p-4 sm:p-6 gap-6">

                {/* --- Header Section --- */}
                <header className="flex flex-col gap-4 shrink-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        {/* Title & Nav */}
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                                    <CalendarIcon className="w-7 h-7 text-blue-600 dark:text-blue-500" />
                                    Calendar
                                </h1>
                            </div>

                            <div className="hidden md:block h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2"></div>

                            <div className="flex items-center gap-1 bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 p-1 rounded-xl shadow-sm">
                                <button onClick={() => navigate('prev')} className="p-1 hover:bg-gray-50 dark:hover:bg-[#333] rounded-lg transition-colors text-gray-500">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-lg font-bold text-gray-800 dark:text-white min-w-[150px] text-center select-none tabular-nums">
                                    {getTitle()}
                                </span>
                                <button onClick={() => navigate('next')} className="p-1 hover:bg-gray-50 dark:hover:bg-[#333] rounded-lg transition-colors text-gray-500">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            <button
                                onClick={() => setCurrentDate(new Date())}
                                className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 dark:text-gray-200 shadow-sm"
                            >
                                Today
                            </button>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                            {/* View Switcher */}
                            <div className="flex bg-gray-100 dark:bg-[#1f1f1f] p-1 rounded-lg border border-gray-200 dark:border-gray-800">
                                {['month', 'week', 'day'].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setView(v)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition-all ${view === v
                                            ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4" />
                                New Event
                            </button>
                        </div>
                    </div>

                    {/* Filters Toolbar */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <div className="flex items-center gap-1.5 px-2 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                            <Filter className="w-3.5 h-3.5" />
                            Display:
                        </div>

                        {Object.entries(categoryConfig).map(([key, config]) => (
                            <button
                                key={key}
                                onClick={() => setActiveFilters(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all select-none
                                    ${activeFilters.includes(key)
                                        ? `bg-white dark:bg-[#1f1f1f] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 shadow-sm`
                                        : 'bg-transparent text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-[#1f1f1f] opacity-60'}
                                `}
                            >
                                <span className={`w-2 h-2 rounded-full ${activeFilters.includes(key) ? config.color : 'bg-gray-300'}`}></span>
                                <span className="capitalize">{key}</span>
                            </button>
                        ))}

                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-2"></div>

                        <button
                            onClick={() => setHideCompleted(!hideCompleted)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${hideCompleted
                                ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800'
                                : 'text-gray-500 border-transparent hover:bg-gray-100'
                                }`}
                            title="Filter out completed tasks visually"
                        >
                            <Layout className="w-3.5 h-3.5" />
                            {hideCompleted ? "Completed Hidden" : "Show Completed"}
                        </button>
                    </div>
                </header>

                {/* --- Main Content Area --- */}
                <div className="flex-1 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col relative">
                    {view === 'month' ? renderMonthGrid() : (
                        <CalendarDayView
                            date={currentDate}
                            events={displayEvents}
                            view={view}
                            onEventClick={setSelectedEvent}
                            onTimeSlotClick={(time) => { setSelectedDate(time); setIsCreateModalOpen(true); }}
                        />
                    )}
                </div>
            </div>

            {/* Modals & Panels */}
            <CreateTaskModal
                isOpen={isCreateModalOpen && !selectedEvent}
                onClose={() => { setIsCreateModalOpen(false); setSelectedDate(null); }}
                onCreate={handleCreateTask}
                taskToEdit={selectedDate ? { startDate: selectedDate, endDate: addHours(selectedDate, 1), type: 'event' } : null}
                isEvent={true}
            />

            {(selectedEvent && isCreateModalOpen) && (
                <CreateTaskModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onUpdate={handleUpdateTask}
                    taskToEdit={selectedEvent}
                    isEvent={true}
                />
            )}

            <EventDetailsPanel
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onEdit={() => setIsCreateModalOpen(true)}
                onDelete={handleDeleteTask}
            />
        </div>
    );
};

export default CalendarView;
