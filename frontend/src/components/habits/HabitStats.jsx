import React from 'react';
import { Trophy, Flame, Target, Calendar } from 'lucide-react';
import { isToday, isSameDay } from 'date-fns';

const HabitStats = ({ habits }) => {
    const totalHabits = habits.length;

    // Calculate completion rate for today
    const completedToday = habits.filter(h =>
        h.completedDates.some(d => isSameDay(new Date(d), new Date()))
    ).length;

    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    // Calculate average consistency (simple version based on streaks)
    const avgStreak = totalHabits > 0
        ? Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / totalHabits)
        : 0;

    // Find best performer
    const bestHabit = habits.length > 0
        ? habits.reduce((prev, current) => (prev.streak > current.streak) ? prev : current)
        : null;

    const stats = [
        {
            label: 'Completion Rate',
            value: `${completionRate}%`,
            subtext: 'Today',
            icon: Target,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            label: 'Current Streak',
            value: avgStreak,
            subtext: 'Average days',
            icon: Flame,
            color: 'text-orange-500',
            bg: 'bg-orange-50 dark:bg-orange-900/20'
        },
        {
            label: 'Perfect Days',
            value: habits.filter(h => h.streak >= 7).length,
            subtext: '7+ day streaks',
            icon: Trophy,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50 dark:bg-yellow-900/20'
        },
        {
            label: 'Total Active',
            value: totalHabits,
            subtext: 'Habits tracked',
            icon: Calendar,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                            <span className="text-xs text-gray-400">{stat.subtext}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HabitStats;
