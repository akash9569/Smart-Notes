import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, BarChart2, Calendar as CalendarIcon, CheckCircle, Flame, Trophy } from 'lucide-react';
import { habitsAPI } from '../api';
import { format, startOfWeek, addDays, isSameDay, subWeeks, addWeeks, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import toast from 'react-hot-toast';

// We'll create these sub-components next
import HabitModal from './habits/HabitModal';
import HabitList from './habits/HabitList';
import HabitStats from './habits/HabitStats';
import HabitHeatmap from './habits/HabitHeatmap';
import HabitAnalytics from './habits/HabitAnalytics';

import { useHabits } from '../context/HabitsContext';

const HabitTracker = () => {
    const { habits, loading, createHabit, updateHabit, deleteHabit, toggleCompletion } = useHabits();
    const [view, setView] = useState('weekly'); // 'weekly', 'monthly', 'stats'
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState(null);

    // fetchHabits is handled by context

    const handleCreateHabit = async (habitData) => {
        try {
            await createHabit(habitData);
            setIsModalOpen(false);
        } catch (error) {
            // Toast handled in context
        }
    };

    const handleUpdateHabit = async (id, updates) => {
        try {
            await updateHabit(id, updates);
            setSelectedHabit(null);
            setIsModalOpen(false);
        } catch (error) {
            // Toast handled in context
        }
    };

    const handleDeleteHabit = async (id) => {
        if (!window.confirm('Are you sure you want to delete this habit?')) return;
        try {
            await deleteHabit(id);
        } catch (error) {
            // Toast handled in context
        }
    };

    const handleToggleCompletion = async (id, date) => {
        try {
            await toggleCompletion(id, date);
        } catch (error) {
            // Toast handled in context
        }
    };

    const getWeekDays = () => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
        return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    };

    const weekDays = getWeekDays();

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-[#1a1a1a] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a]">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                        Habit Tracker
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Build better habits, one day at a time.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 dark:bg-[#2d2d2d] p-1 rounded-lg">
                        <button
                            onClick={() => setView('weekly')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'weekly'
                                ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setView('monthly')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'monthly'
                                ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setView('stats')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'stats'
                                ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            Stats
                        </button>
                    </div>
                    <button
                        onClick={() => { setSelectedHabit(null); setIsModalOpen(true); }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        Add Habit
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    </div>
                ) : (
                    <div className="w-full mx-auto space-y-8">
                        {/* Stats Overview */}
                        <HabitStats habits={habits} />

                        {view === 'weekly' && (
                            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-200 dark:border-[#333]">
                                <div className="p-4 border-b border-gray-200 dark:border-[#333] flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Progress</h2>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#2d2d2d] px-3 py-1 rounded-full">
                                            <CalendarIcon className="w-4 h-4" />
                                            {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
                                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg text-gray-500 dark:text-gray-400"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentDate(new Date())}
                                            className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                                        >
                                            Today
                                        </button>
                                        <button
                                            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
                                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg text-gray-500 dark:text-gray-400"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <HabitList
                                    habits={habits}
                                    weekDays={weekDays}
                                    onToggle={handleToggleCompletion}
                                    onEdit={(habit) => { setSelectedHabit(habit); setIsModalOpen(true); }}
                                    onDelete={handleDeleteHabit}
                                />
                            </div>
                        )}

                        {view === 'monthly' && (
                            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-200 dark:border-[#333] p-6">
                                <HabitHeatmap habits={habits} currentDate={currentDate} setCurrentDate={setCurrentDate} />
                            </div>
                        )}

                        {view === 'stats' && (
                            <HabitAnalytics habits={habits} />
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <HabitModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setSelectedHabit(null); }}
                    onSubmit={selectedHabit ? (data) => handleUpdateHabit(selectedHabit._id, data) : handleCreateHabit}
                    initialData={selectedHabit}
                />
            )}
        </div>
    );
};

export default HabitTracker;
