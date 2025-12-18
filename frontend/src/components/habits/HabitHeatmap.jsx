import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HabitHeatmap = ({ habits, currentDate, setCurrentDate }) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Calculate empty cells for start of month to align with days of week
    const startDay = getDay(monthStart); // 0 = Sunday, 1 = Monday, etc.
    const emptyDays = Array.from({ length: startDay === 0 ? 6 : startDay - 1 }); // Adjust for Mon start

    const getDayStatus = (date) => {
        // Calculate how many habits were completed on this day
        const completedCount = habits.filter(h =>
            h.completedDates.some(d => isSameDay(new Date(d), date))
        ).length;

        const totalActiveHabits = habits.filter(h => {
            // Check if habit should be active on this day
            if (h.frequency === 'daily') return true;
            if (h.frequency === 'weekly') return h.days.includes(format(date, 'EEE'));
            return true;
        }).length;

        if (totalActiveHabits === 0) return { intensity: 0, percentage: 0 };

        const percentage = (completedCount / totalActiveHabits) * 100;

        let intensity = 0;
        if (percentage > 0) intensity = 1;
        if (percentage >= 40) intensity = 2;
        if (percentage >= 70) intensity = 3;
        if (percentage === 100) intensity = 4;

        return { intensity, percentage, completedCount, totalActiveHabits };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg text-gray-500"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="text-sm font-medium text-emerald-600 hover:underline"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg text-gray-500"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
                        {day}
                    </div>
                ))}

                {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {daysInMonth.map(date => {
                    const { intensity, percentage, completedCount, totalActiveHabits } = getDayStatus(date);

                    const bgColors = {
                        0: 'bg-gray-100 dark:bg-[#2d2d2d]',
                        1: 'bg-emerald-200 dark:bg-emerald-900/40',
                        2: 'bg-emerald-300 dark:bg-emerald-800/60',
                        3: 'bg-emerald-400 dark:bg-emerald-600/80',
                        4: 'bg-emerald-500 dark:bg-emerald-500',
                    };

                    return (
                        <div
                            key={date.toString()}
                            className={`
                                aspect-square rounded-lg transition-all relative group cursor-default
                                ${bgColors[intensity]}
                                ${isToday(date) ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-[#1e1e1e]' : ''}
                            `}
                        >
                            <span className={`
                                absolute top-1 left-1 text-[10px] font-medium
                                ${intensity > 2 ? 'text-white' : 'text-gray-500 dark:text-gray-400'}
                            `}>
                                {format(date, 'd')}
                            </span>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover:block z-10">
                                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-lg">
                                    {format(date, 'MMM d')}: {completedCount}/{totalActiveHabits} completed ({Math.round(percentage)}%)
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
                <span>Less</span>
                <div className="w-3 h-3 rounded bg-gray-100 dark:bg-[#2d2d2d]" />
                <div className="w-3 h-3 rounded bg-emerald-200 dark:bg-emerald-900/40" />
                <div className="w-3 h-3 rounded bg-emerald-300 dark:bg-emerald-800/60" />
                <div className="w-3 h-3 rounded bg-emerald-400 dark:bg-emerald-600/80" />
                <div className="w-3 h-3 rounded bg-emerald-500 dark:bg-emerald-500" />
                <span>More</span>
            </div>
        </div>
    );
};

export default HabitHeatmap;
