import React from 'react';
import { format, addHours, startOfDay, isSameDay, startOfWeek, addDays } from 'date-fns';

// Premium Color Palette (Matching CalendarView)
const categoryConfig = {
    task: { color: 'bg-emerald-500', border: 'border-emerald-200', text: 'text-emerald-700', bgSoft: 'bg-emerald-50', hover: 'hover:bg-emerald-100', darkColor: 'dark:bg-emerald-600' },
    event: { color: 'bg-violet-500', border: 'border-violet-200', text: 'text-violet-700', bgSoft: 'bg-violet-50', hover: 'hover:bg-violet-100', darkColor: 'dark:bg-violet-600' },
    deadline: { color: 'bg-rose-500', border: 'border-rose-200', text: 'text-rose-700', bgSoft: 'bg-rose-50', hover: 'hover:bg-rose-100', darkColor: 'dark:bg-rose-600' },
    reminder: { color: 'bg-amber-500', border: 'border-amber-200', text: 'text-amber-700', bgSoft: 'bg-amber-50', hover: 'hover:bg-amber-100', darkColor: 'dark:bg-amber-600' },
    class: { color: 'bg-sky-500', border: 'border-sky-200', text: 'text-sky-700', bgSoft: 'bg-sky-50', hover: 'hover:bg-sky-100', darkColor: 'dark:bg-sky-600' },
    personal: { color: 'bg-indigo-500', border: 'border-indigo-200', text: 'text-indigo-700', bgSoft: 'bg-indigo-50', hover: 'hover:bg-indigo-100', darkColor: 'dark:bg-indigo-600' },
    work: { color: 'bg-gray-600', border: 'border-gray-200', text: 'text-gray-700', bgSoft: 'bg-gray-50', hover: 'hover:bg-gray-100', darkColor: 'dark:bg-gray-600' },
};

const CalendarDayView = ({ date, events, view = 'day', onEventClick, onTimeSlotClick }) => {
    // Generate time slots (0 AM to 11 PM)
    const timeSlots = [];
    for (let i = 0; i <= 23; i++) {
        timeSlots.push(addHours(startOfDay(date), i));
    }

    const getEventStyle = (event) => {
        const start = new Date(event.startDate || event.dueDate || event.createdAt);
        if (isNaN(start.getTime())) return { display: 'none' };

        const end = new Date(event.endDate || addHours(start, 1));
        const validEnd = isNaN(end.getTime()) ? addHours(start, 1) : end;

        const startMinutes = (start.getHours() * 60 + start.getMinutes());
        let durationMinutes = (validEnd - start) / (1000 * 60);

        const minutesInDay = 24 * 60;
        if (startMinutes + durationMinutes > minutesInDay) {
            durationMinutes = minutesInDay - startMinutes;
        }

        return {
            top: `${Math.max(0, startMinutes)}px`,
            height: `${Math.max(34, durationMinutes)}px`, // Minimal height for clear visibility
        };
    };

    const handleColumnClick = (e, dayDate) => {
        if (!onTimeSlotClick) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const totalMinutes = (y / 60) * 60; // 60px per hour
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        const clickedTime = addHours(startOfDay(dayDate), hours);
        clickedTime.setMinutes(minutes);
        onTimeSlotClick(clickedTime);
    };

    const renderEvents = (dayDate) => {
        const daysEvents = events.filter(event => {
            const eventDate = new Date(event.startDate || event.dueDate || event.createdAt);
            return !isNaN(eventDate.getTime()) && isSameDay(eventDate, dayDate);
        });

        return daysEvents.map(event => {
            const style = getEventStyle(event);
            if (style.display === 'none') return null;

            const config = categoryConfig[event.category || 'task'] || categoryConfig.task;

            // Read-Only Pill Style (No Checkbox)
            const containerClass = event.completed
                ? 'bg-gray-100 dark:bg-[#252525] text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-800'
                : `${config.bgSoft} dark:bg-opacity-10 ${config.text} dark:text-gray-200 border border-transparent`;

            return (
                <div
                    key={event._id}
                    onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                    className={`
                        absolute left-1 right-1 rounded-md p-1.5 cursor-pointer hover:scale-[1.01] hover:shadow-md transition-all z-10 overflow-hidden shadow-sm flex flex-col justify-start
                        ${containerClass}
                        ${!event.completed ? 'border-l-[3px]' : ''}
                        ${!event.completed && !event.color ? `border-l-${config.color.split('-')[1]}-500` : ''}
                    `}
                    style={{
                        ...style,
                        ...(event.color && !event.completed ? { backgroundColor: event.color + '20', color: event.color, borderLeftColor: event.color } : {})
                    }}
                    title={event.completed ? "Completed (View Only)" : event.title}
                >
                    <div className="flex items-start gap-1.5 h-full relative">
                        <div className="min-w-0 flex-1">
                            <div className={`text-xs font-bold truncate leading-tight ${event.completed ? 'line-through decoration-gray-400' : ''}`}>
                                {event.title}
                            </div>
                            {parseInt(style.height) > 40 && (
                                <div className="text-[10px] opacity-80 truncate font-medium leading-none mt-0.5">
                                    {format(new Date(event.startDate || event.dueDate || event.createdAt), 'h:mm a')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        });
    };

    const weekDays = [];
    if (view === 'week') {
        const start = startOfWeek(date);
        for (let i = 0; i < 7; i++) {
            weekDays.push(addDays(start, i));
        }
    } else {
        weekDays.push(date);
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#1a1a1a] relative flex flex-col">
            {/* Week/Day Header */}
            <div className="flex border-b border-gray-200 dark:border-gray-800 ml-16 sticky top-0 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm z-20 shadow-sm">
                {weekDays.map(day => (
                    <div key={day.toString()} className={`flex-1 text-center py-3 border-r border-gray-100 dark:border-gray-800/50 ${isSameDay(day, new Date()) ? 'bg-blue-50/20 dark:bg-blue-900/10' : ''}`}>
                        <div className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isSameDay(day, new Date()) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                            {format(day, 'EEE')}
                        </div>
                        <div className={`text-xl font-bold w-9 h-9 flex items-center justify-center rounded-full mx-auto transition-all ${isSameDay(day, new Date())
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#333]'
                            }`}>
                            {format(day, 'd')}
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative min-h-[1440px] flex"> {/* 24 hours * 60px */}
                {/* Time Labels Column */}
                <div className="w-16 flex-shrink-0 border-r border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#1f1f1f] z-10 select-none">
                    {timeSlots.map(time => (
                        <div key={time.toString()} className="h-[60px] relative">
                            <div className="absolute -top-2.5 right-3 text-[10px] font-medium text-gray-400 dark:text-gray-500">
                                {format(time, 'h a')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Days Columns */}
                <div className="flex-1 flex">
                    {weekDays.map((day, index) => (
                        <div
                            key={day.toString()}
                            className={`flex-1 relative border-r border-gray-100 dark:border-gray-800/50 cursor-pointer hover:bg-gray-50/20 dark:hover:bg-white/5 transition-colors`}
                            onClick={(e) => handleColumnClick(e, day)}
                        >
                            {/* Horizontal Grid Lines */}
                            {timeSlots.map(time => (
                                <div key={time.toString()} className="absolute w-full border-b border-gray-50 dark:border-gray-800/30 h-[60px]" style={{ top: time.getHours() * 60 }}></div>
                            ))}

                            {/* Events Layer */}
                            <div className="absolute inset-0 w-full h-full pointer-events-none">
                                <div className="relative w-full h-full pointer-events-auto">
                                    {renderEvents(day)}
                                </div>
                            </div>

                            {/* Current Time Indicator (if today) */}
                            {isSameDay(day, new Date()) && (
                                <div
                                    className="absolute left-0 right-0 z-20 pointer-events-none flex items-center group"
                                    style={{
                                        top: `${(new Date().getHours() * 60 + new Date().getMinutes())}px`
                                    }}
                                >
                                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full -ml-1.5 shadow-[0_0_8px_rgba(239,68,68,0.6)] ring-2 ring-white dark:ring-[#1a1a1a]"></div>
                                    <div className="h-[2px] w-full bg-red-500/50 shadow-[0_0_4px_rgba(239,68,68,0.4)] group-hover:h-[3px] transition-all"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarDayView;
