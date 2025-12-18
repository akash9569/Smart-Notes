import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, getDay } from 'date-fns';
import { Trophy, Flame, Target, Calendar, TrendingUp, Activity } from 'lucide-react';

const HabitAnalytics = ({ habits }) => {
    // --- Calculations ---

    // 1. Overall Completion Rate
    const overallCompletion = useMemo(() => {
        if (habits.length === 0) return 0;
        const totalPossible = habits.length * 30; // Approx last 30 days
        // Simplified calculation for demo purposes
        const totalCompleted = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
        // This is a rough estimate, a real one would be more complex based on creation date
        return Math.min(100, Math.round((totalCompleted / (totalPossible || 1)) * 100));
    }, [habits]);

    // 2. Completion History (Last 7 Days)
    const last7DaysData = useMemo(() => {
        const days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i));
        return days.map(date => {
            const completedCount = habits.filter(h =>
                h.completedDates.some(d => isSameDay(new Date(d), date))
            ).length;
            return {
                name: format(date, 'EEE'),
                completed: completedCount,
                total: habits.length // Assuming all habits are active for simplicity
            };
        });
    }, [habits]);

    // 3. Best Performing Habits (by streak)
    const topHabits = useMemo(() => {
        return [...habits].sort((a, b) => b.streak - a.streak).slice(0, 5);
    }, [habits]);

    // 4. Day of Week Performance
    const dayPerformanceData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const counts = new Array(7).fill(0);

        habits.forEach(habit => {
            habit.completedDates.forEach(date => {
                const dayIndex = getDay(new Date(date));
                counts[dayIndex]++;
            });
        });

        return days.map((day, index) => ({
            subject: day,
            A: counts[index],
            fullMark: 100 // Scale relative to max
        }));
    }, [habits]);
    // 5. Perfect Days (Last 30 Days)
    const perfectDaysCount = useMemo(() => {
        const daysToCheck = Array.from({ length: 30 }).map((_, i) => subDays(new Date(), i));
        let count = 0;

        daysToCheck.forEach(date => {
            const dayName = format(date, 'EEE');

            // Find habits scheduled for this day
            const scheduledHabits = habits.filter(h => {
                if (h.frequency === 'daily') return true;
                if (h.frequency === 'weekly') return h.days.includes(dayName);
                return false;
            });

            if (scheduledHabits.length === 0) return; // No habits scheduled, doesn't count as perfect day

            // Check if all scheduled habits are completed
            const allCompleted = scheduledHabits.every(h =>
                h.completedDates.some(d => isSameDay(new Date(d), date))
            );

            if (allCompleted) count++;
        });

        return count;
    }, [habits]);
    const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-24 h-24 text-emerald-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{overallCompletion}%</h3>
                        <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +2.5% from last week
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Flame className="w-24 h-24 text-orange-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Streaks</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {habits.filter(h => h.streak > 0).length}
                        </h3>
                        <div className="mt-2 text-xs text-orange-600 font-medium flex items-center gap-1">
                            Habits on streak
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Trophy className="w-24 h-24 text-yellow-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Perfect Days</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {perfectDaysCount}
                        </h3>
                        <div className="mt-2 text-xs text-yellow-600 font-medium flex items-center gap-1">
                            Last 30 days
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target className="w-24 h-24 text-blue-500" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Habits</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{habits.length}</h3>
                        <div className="mt-2 text-xs text-blue-600 font-medium flex items-center gap-1">
                            Tracking now
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart: Weekly Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Weekly Activity</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={last7DaysData}>
                                <defs>
                                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-[#333]" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: '#10B981', strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="completed"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCompleted)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Habits List */}
                <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Performers</h3>
                    <div className="space-y-4">
                        {topHabits.map((habit, index) => (
                            <div key={habit._id} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2d2d2d] flex items-center justify-center font-bold text-gray-500 text-sm">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{habit.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-[#2d2d2d] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${Math.min(100, (habit.streak / 30) * 100)}%`,
                                                    backgroundColor: habit.color
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">{habit.streak}d</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Day Performance Bar Chart */}
                <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Day Performance</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dayPerformanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-[#333]" />
                                <XAxis
                                    dataKey="subject"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Bar dataKey="A" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution (Placeholder for now, using dummy data structure if categories aren't strictly tracked by count) */}
                <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="p-4 bg-gray-50 dark:bg-[#2d2d2d] rounded-full mb-4">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Keep it up!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs">
                        You're doing great. Consistency is key to building long-lasting habits.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HabitAnalytics;
