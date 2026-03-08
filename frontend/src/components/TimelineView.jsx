import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { useTasks } from '../context/TasksContext';
import { useHabits } from '../context/HabitsContext';
import { useExpenses } from '../context/ExpensesContext';
import { format, isToday, isYesterday, parseISO, compareDesc } from 'date-fns';
import {
    FileText,
    CheckCircle,
    Activity,
    Wallet,
    Clock,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Calendar as CalendarIcon
} from 'lucide-react';

const TimelineView = () => {
    const { notes } = useNotes();
    const { tasks } = useTasks();
    const { habits, habitLogs } = useHabits();
    const { data: expensesData, loanData } = useExpenses();

    const [filter, setFilter] = useState('all'); // all, notes, tasks, expenses, habits

    // 1. Aggregation & Normalization
    const getAllItems = () => {
        let items = [];

        // Notes
        if (notes) {
            notes.forEach(note => {
                items.push({
                    id: note._id,
                    type: 'note',
                    date: new Date(note.updatedAt || note.createdAt),
                    data: {
                        title: note.title,
                        preview: note.content ? note.content.substring(0, 100).replace(/<[^>]*>/g, '') : '',
                        tags: note.tags
                    }
                });
            });
        }

        // Tasks
        if (tasks) {
            tasks.forEach(task => {
                const date = task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt);
                items.push({
                    id: task._id,
                    type: 'task',
                    date: date,
                    data: {
                        title: task.title,
                        completed: task.completed,
                        priority: task.priority
                    }
                });
            });
        }

        // Habits (Logs)
        // Optimally we'd use habitLogs for specific completions, but habits array has 'streak' etc.
        // For timeline, maybe we show when a habit was created or completed today?
        // Let's stick to showing created habits or "completed today" if we had that log accessible easily.
        // For now, let's just show habits based on createdAt to act as "Started habit".
        if (habits) {
            habits.forEach(habit => {
                items.push({
                    id: habit._id,
                    type: 'habit',
                    date: new Date(habit.createdAt),
                    data: {
                        name: habit.name,
                        frequency: habit.frequency,
                        streak: habit.streak
                    }
                });
            });
        }

        // Expenses
        if (expensesData && expensesData.recentTransactions) {
            expensesData.recentTransactions.forEach(txn => {
                items.push({
                    id: txn._id,
                    type: 'expense',
                    date: new Date(txn.date),
                    data: {
                        description: txn.description,
                        amount: txn.amount,
                        type: txn.type, // income or expense
                        category: txn.category
                    }
                });
            });
        }

        // Loans
        if (loanData && loanData.loans) {
            loanData.loans.forEach(loan => {
                items.push({
                    id: loan._id,
                    type: 'loan',
                    date: new Date(loan.date),
                    data: {
                        person: loan.person,
                        amount: loan.amount,
                        type: loan.type, // lent or borrowed
                        status: loan.status
                    }
                });
            });
        }

        // Filter
        if (filter !== 'all') {
            items = items.filter(item => item.type === filter || (filter === 'expenses' && item.type === 'loan'));
        }

        // Sort: Newest First
        return items.sort((a, b) => compareDesc(a.date, b.date));
    };

    const items = getAllItems();

    // 2. Grouping by Date
    const groupedItems = items.reduce((groups, item) => {
        let dateLabel = format(item.date, 'yyyy-MM-dd');

        if (isToday(item.date)) dateLabel = 'Today';
        else if (isYesterday(item.date)) dateLabel = 'Yesterday';
        else dateLabel = format(item.date, 'MMMM d, yyyy');

        if (!groups[dateLabel]) {
            groups[dateLabel] = [];
        }
        groups[dateLabel].push(item);
        return groups;
    }, {});

    // Helper for Icons
    const getTypeIcon = (type, data) => {
        switch (type) {
            case 'note': return <FileText className="w-5 h-5 text-blue-500" />;
            case 'task': return <CheckCircle className={`w-5 h-5 ${data.completed ? 'text-green-500' : 'text-orange-500'}`} />;
            case 'habit': return <Activity className="w-5 h-5 text-purple-500" />;
            case 'expense': return <Wallet className={`w-5 h-5 ${data.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`} />;
            case 'loan': return <Wallet className="w-5 h-5 text-indigo-500" />;
            default: return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'note': return 'Note';
            case 'task': return 'Task';
            case 'habit': return 'Habit';
            case 'expense': return 'Transaction';
            case 'loan': return 'Loan';
            default: return 'Activity';
        }
    }

    return (
        <div className="flex-1 bg-gray-50 dark:bg-[#121212] overflow-y-auto h-full p-4 sm:p-8 text-gray-900 dark:text-gray-100 font-sans">
            <div className="max-w-8xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Clock className="w-8 h-8 text-indigo-500" />
                            Timeline
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Your activity feed across all apps.</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex bg-white dark:bg-[#1e1e1e] p-1 rounded-xl shadow-sm border border-gray-200 dark:border-[#333]">
                        {['all', 'note', 'task', 'habit', 'expense'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === f
                                    ? 'bg-gray-100 dark:bg-[#333] text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {f === 'expense' ? 'Finance' : f + 's'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    {Object.keys(groupedItems).length === 0 ? (
                        <div className="text-center py-20 opacity-50">
                            <div className="w-24 h-24 bg-gray-200 dark:bg-[#222] rounded-full mx-auto flex items-center justify-center mb-4">
                                <Clock className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium">No activity found</h3>
                            <p>Start creating notes, tasks, or tracking expenses!</p>
                        </div>
                    ) : (
                        Object.keys(groupedItems).map((dateLabel) => (
                            <div key={dateLabel} className="relative">
                                {/* Date Header */}
                                <div className="sticky top-0 z-10 bg-gray-50/95 dark:bg-[#121212]/95 backdrop-blur-sm py-2 mb-4 border-b border-gray-200 dark:border-[#333] flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {dateLabel}
                                    </h2>
                                </div>

                                <div className="space-y-4 ml-2 sm:ml-5 border-l-2 border-gray-200 dark:border-[#333] pl-7 sm:pl-9 pb-4">
                                    {groupedItems[dateLabel].map((item) => (
                                        <div
                                            key={item.id}
                                            className="relative bg-white dark:bg-[#1e1e1e] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-[#333] hover:shadow-md transition-shadow group"
                                        >
                                            {/* Timeline Dot */}
                                            <div className="absolute -left-[39px] sm:-left-[47px] top-6 w-5 h-5 rounded-full bg-white dark:bg-[#121212] border-4 border-gray-200 dark:border-[#333] group-hover:border-indigo-500 transition-colors"></div>

                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl shrink-0">
                                                        {getTypeIcon(item.type, item.data)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                                                {getTypeLabel(item.type)}
                                                            </span>
                                                            <span className="text-xs text-gray-400">•</span>
                                                            <span className="text-xs text-gray-500">
                                                                {format(item.date, 'h:mm a')}
                                                            </span>
                                                        </div>

                                                        {item.type === 'note' && (
                                                            <>
                                                                <h3 className="font-bold text-gray-900 dark:text-gray-100">
                                                                    {item.data.title || 'Untitled Note'}
                                                                </h3>
                                                                {item.data.preview && (
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                                        {item.data.preview}
                                                                    </p>
                                                                )}
                                                            </>
                                                        )}

                                                        {item.type === 'task' && (
                                                            <div>
                                                                <h3 className={`font-medium ${item.data.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                                                    {item.data.title}
                                                                </h3>
                                                                {item.data.priority && (
                                                                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full uppercase font-bold
                                                                        ${item.data.priority === 'high' ? 'bg-red-100 text-red-600' :
                                                                            item.data.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                                                                                'bg-blue-100 text-blue-600'}`}>
                                                                        {item.data.priority} Priority
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {item.type === 'expense' && (
                                                            <div>
                                                                <h3 className="font-bold text-gray-900 dark:text-white">
                                                                    {item.data.description}
                                                                </h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className={`text-sm font-bold ${item.data.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                                        {item.data.type === 'income' ? '+' : '-'}₹{item.data.amount}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-[#333] px-2 py-0.5 rounded-full">
                                                                        {item.data.category}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {item.type === 'loan' && (
                                                            <div>
                                                                <h3 className="font-bold text-gray-900 dark:text-white">
                                                                    {item.data.type === 'lent' ? `Lent to ${item.data.person}` : `Borrowed from ${item.data.person}`}
                                                                </h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className={`text-sm font-bold ${item.data.type === 'lent' ? 'text-blue-600' : 'text-orange-500'}`}>
                                                                        ₹{item.data.amount}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-[#333] px-2 py-0.5 rounded-full capitalize">
                                                                        {item.data.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {item.type === 'habit' && (
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                                    Started habit: <span className="font-bold">{item.data.name}</span>
                                                                </h3>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {item.data.frequency} • Streak: {item.data.streak}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimelineView;
