import React, { useState, useEffect, useRef } from 'react';
import { Check, MoreHorizontal, Trash, Edit, Flame } from 'lucide-react';
import { format, isSameDay, isToday } from 'date-fns';

const HabitList = ({ habits, weekDays, onToggle, onEdit, onDelete }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isCompleted = (habit, date) => {
        return habit.completedDates.some(d => isSameDay(new Date(d), date));
    };

    const getCompletionStatus = (habit, date) => {
        const completed = isCompleted(habit, date);
        const isFuture = date > new Date();

        if (isFuture) return 'future';
        if (completed) return 'completed';

        // Check if habit is scheduled for this day
        const dayName = format(date, 'EEE');
        if (habit.frequency === 'weekly' && !habit.days.includes(dayName)) return 'skipped';

        return 'pending';
    };

    return (
        <div className="divide-y divide-gray-200 dark:divide-[#333]">
            {/* Header Row */}
            <div className="grid grid-cols-[2fr_repeat(7,1fr)_50px] gap-4 p-4 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-[#1e1e1e]">
                <div className="pl-2">Habit</div>
                {weekDays.map(day => (
                    <div key={day.toString()} className={`text-center flex flex-col items-center ${isToday(day) ? 'text-emerald-500 font-bold' : ''}`}>
                        <span className="text-xs uppercase">{format(day, 'EEE')}</span>
                        <span className="text-lg">{format(day, 'd')}</span>
                    </div>
                ))}
                <div></div>
            </div>

            {/* Habit Rows */}
            {habits.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No habits yet. Click "Add Habit" to get started!
                </div>
            ) : (
                habits.map(habit => (
                    <div key={habit._id} className="grid grid-cols-[2fr_repeat(7,1fr)_50px] gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors group">
                        {/* Habit Info */}
                        <div className="flex items-center gap-3 pl-2 min-w-0">
                            <div
                                className="w-1 h-12 rounded-full flex-shrink-0"
                                style={{ backgroundColor: habit.color }}
                            />
                            <div className="min-w-0">
                                <h3 className="font-medium text-gray-900 dark:text-white truncate">{habit.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#333]">{habit.category}</span>
                                    {habit.streak > 0 && (
                                        <span className="flex items-center gap-1 text-orange-500 font-medium">
                                            <Flame className="w-3 h-3 fill-current" />
                                            {habit.streak}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Checkboxes */}
                        {weekDays.map(day => {
                            const status = getCompletionStatus(habit, day);
                            const isScheduled = habit.frequency === 'daily' || habit.days.includes(format(day, 'EEE'));

                            return (
                                <div key={day.toString()} className="flex justify-center">
                                    {isScheduled ? (
                                        <button
                                            onClick={() => status !== 'future' && onToggle(habit._id, day)}
                                            disabled={status === 'future'}
                                            className={`
                                                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                                                ${status === 'completed'
                                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-100'
                                                    : status === 'future'
                                                        ? 'bg-gray-100 dark:bg-[#2d2d2d] opacity-50 cursor-not-allowed'
                                                        : 'bg-gray-100 dark:bg-[#333] text-gray-300 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-[#444] scale-90 hover:scale-100'
                                                }
                                            `}
                                        >
                                            {status === 'completed' && <Check className="w-6 h-6 stroke-[3]" />}
                                        </button>
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-[#333]" />
                                    )}
                                </div>
                            );
                        })}

                        {/* Actions */}
                        <div className="relative flex justify-end" ref={activeMenu === habit._id ? menuRef : null}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(activeMenu === habit._id ? null : habit._id);
                                }}
                                className={`p-2 rounded-lg transition-colors ${activeMenu === habit._id ? 'bg-gray-100 dark:bg-[#333] text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333]'}`}
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </button>

                            {/* Dropdown */}
                            {activeMenu === habit._id && (
                                <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl border border-gray-200 dark:border-[#333] py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                                    <button
                                        onClick={() => {
                                            onEdit(habit);
                                            setActiveMenu(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDelete(habit._id);
                                            setActiveMenu(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                    >
                                        <Trash className="w-4 h-4" /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default HabitList;
