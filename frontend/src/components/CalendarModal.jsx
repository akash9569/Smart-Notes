import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday, setHours, setMinutes, addHours } from 'date-fns';
import { tasksAPI } from '../api';

const CalendarModal = ({ isOpen, onClose, onInsert }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, [selectedDate]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await tasksAPI.getTasks();
            const allTasks = response.data.data.tasks;

            // Filter for selected date
            const dayEvents = allTasks.filter(task => {
                const taskDate = new Date(task.startDate || task.dueDate || task.createdAt);
                return isSameDay(taskDate, selectedDate);
            }).map(task => ({
                id: task._id,
                title: task.title,
                start: new Date(task.startDate || task.dueDate || task.createdAt),
                end: task.endDate ? new Date(task.endDate) : addHours(new Date(task.startDate || task.dueDate || task.createdAt), 1),
                color: getCategoryColor(task.category),
                description: task.description
            }));

            setEvents(dayEvents);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            task: 'bg-emerald-500',
            event: 'bg-violet-500',
            deadline: 'bg-rose-500',
            reminder: 'bg-amber-500',
            class: 'bg-sky-500',
            personal: 'bg-indigo-500',
            work: 'bg-gray-500',
        };
        return colors[category] || 'bg-blue-500';
    };

    if (!isOpen) return null;

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const onDateClick = (day) => {
        setSelectedDate(day);
    };

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {format(currentMonth, 'MMMM yyyy')}
                </span>
                <div className="flex space-x-2">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-colors">
                        <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const date = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-xs font-medium text-gray-400 text-center py-1">
                    {date[i]}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;

                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isTodayDate = isToday(day);

                days.push(
                    <div
                        key={day.toString()}
                        className={`text-center py-1.5 cursor-pointer text-xs rounded-full transition-all duration-200 relative
                            ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}
                            ${isSelected ? 'bg-blue-600 text-white dark:text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-[#333]'}
                            ${isTodayDate && !isSelected ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}
                        `}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        {formattedDate}
                        {/* Dot indicator for events (mock logic: random dots for demo) */}
                        {isCurrentMonth && Math.random() > 0.8 && !isSelected && (
                            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full"></div>
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div key={day.toString()} className="grid grid-cols-7 gap-y-1">
                    {days}
                </div>
            );
            days = [];
        }
        return <div>{rows}</div>;
    };

    const renderTimeline = () => {
        const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 hours

        return (
            <div className="flex-1 overflow-y-auto custom-scrollbar relative mt-4 pr-2" style={{ maxHeight: '400px' }}>
                {hours.map((hour) => (
                    <div key={hour} className="flex relative h-16 group">
                        {/* Time Label */}
                        <div className="w-16 text-xs text-gray-400 text-right pr-4 -mt-2">
                            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                        </div>

                        {/* Grid Line */}
                        <div className="flex-1 border-t border-gray-100 dark:border-[#333] relative">
                            {/* Events */}
                            {events.map((event) => {
                                const eventStartHour = event.start.getHours();
                                if (eventStartHour === hour) {
                                    return (
                                        <div
                                            key={event.id}
                                            onClick={() => setSelectedEvent(event)}
                                            className={`absolute left-2 right-2 rounded px-3 py-1 text-xs text-white cursor-pointer transition-transform hover:scale-[1.02] shadow-sm z-10 ${event.color} ${selectedEvent?.id === event.id ? 'ring-2 ring-white dark:ring-gray-400' : ''}`}
                                            style={{
                                                top: `${(event.start.getMinutes() / 60) * 100}%`,
                                                height: `${((event.end - event.start) / (1000 * 60 * 60)) * 100}%`,
                                                minHeight: '24px'
                                            }}
                                        >
                                            <div className="font-medium truncate">{event.title}</div>
                                            <div className="text-[10px] opacity-90 truncate">
                                                {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}

                            {/* Current Time Indicator (only if today) */}
                            {isSameDay(selectedDate, new Date()) && new Date().getHours() === hour && (
                                <div
                                    className="absolute left-0 right-0 border-t-2 border-red-400 z-20 pointer-events-none flex items-center"
                                    style={{ top: `${(new Date().getMinutes() / 60) * 100}%` }}
                                >
                                    <div className="w-2 h-2 bg-red-400 rounded-full -ml-1"></div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const handleInsert = () => {
        if (selectedEvent) {
            onInsert(`
                <div style="border-left: 4px solid #3b82f6; padding-left: 10px; margin: 10px 0; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
                    <div style="font-weight: bold; color: #1f2937;">📅 ${selectedEvent.title}</div>
                    <div style="font-size: 0.9em; color: #4b5563;">${format(selectedDate, 'EEEE, MMMM d, yyyy')}</div>
                    <div style="font-size: 0.9em; color: #4b5563;">${format(selectedEvent.start, 'h:mm a')} - ${format(selectedEvent.end, 'h:mm a')}</div>
                </div>
            `);
        } else {
            onInsert(`
                <span style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-weight: 500; color: #374151;">
                    📅 ${format(selectedDate, 'MMMM d, yyyy')}
                </span>&nbsp;
            `);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4 sm:p-0">
            <div className="bg-white dark:bg-[#191919] w-full max-w-4xl h-[90vh] sm:h-[600px] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#333] flex flex-col sm:flex-row overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Left Sidebar */}
                <div className="w-full sm:w-80 bg-gray-50 dark:bg-[#1e1e1e] border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-[#333] p-4 sm:p-6 flex flex-col overflow-y-auto sm:overflow-visible max-h-[40%] sm:max-h-full">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Choose calendar event</h2>

                    {/* Mini Calendar */}
                    <div className="mb-4 sm:mb-8 flex-1 sm:flex-none">
                        {renderHeader()}
                        {renderDays()}
                        {renderCells()}
                    </div>

                    {/* Calendar Source Selector */}
                    <div className="mt-auto hidden sm:block">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Calendars</div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>Events</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span>Tasks</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 flex flex-col bg-white dark:bg-[#191919] min-h-0">
                    {/* Header */}
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-[#333] flex items-center justify-between shrink-0">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-200 truncate max-w-[150px] sm:max-w-none">
                                {format(selectedDate, 'EEEE d MMMM yyyy')}
                            </h3>
                            {isToday(selectedDate) && (
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#2d2d2d] px-2 py-0.5 rounded">Today</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <button onClick={() => onDateClick(subMonths(selectedDate, 0))} className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded text-gray-500 dark:text-gray-400">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={() => onDateClick(addMonths(selectedDate, 0))} className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded text-gray-500 dark:text-gray-400">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded text-gray-500 dark:text-gray-400 ml-2">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Timeline */}
                    {renderTimeline()}

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-[#333] flex justify-end space-x-3 bg-gray-50 dark:bg-[#1e1e1e] shrink-0">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2d2d2d] rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleInsert}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-[#333] hover:bg-gray-800 dark:hover:bg-[#444] rounded-lg transition-colors shadow-sm"
                        >
                            Insert
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;
