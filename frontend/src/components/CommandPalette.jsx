import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    FileText,
    CheckSquare,
    Wallet,
    Activity,
    Calendar,
    Settings,
    LogOut,
    Sun,
    Moon,
    Laptop,
    PlusCircle,
    CheckCircle,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TasksContext';
import { useHabits } from '../context/HabitsContext';
import { useExpenses } from '../context/ExpensesContext';
import { useNotes } from '../context/NotesContext';
import { useTheme } from '../context/ThemeContext';

export const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const notesContext = useNotes();
    const tasksContext = useTasks();
    const habitsContext = useHabits();
    const expensesContext = useExpenses();

    const notes = notesContext?.notes || [];
    const tasks = tasksContext?.tasks || [];
    const habits = habitsContext?.habits || [];
    const expensesData = expensesContext?.data;

    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // Toggle with Cmd+K or custom event
    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        const openEvent = () => setOpen(true);

        document.addEventListener('keydown', down);
        document.addEventListener('open-command-palette', openEvent);
        return () => {
            document.removeEventListener('keydown', down);
            document.removeEventListener('open-command-palette', openEvent);
        };
    }, []);

    const runCommand = (command) => {
        setOpen(false);
        command();
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Search"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) setOpen(false);
            }}
        >
            <div className="w-full max-w-2xl bg-white dark:bg-[#1F2937] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center border-b border-gray-100 dark:border-gray-800 px-4">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <Command.Input
                        autoFocus
                        placeholder="Search notes, tasks, habits, transactions..."
                        className="w-full h-14 bg-transparent outline-none text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 font-medium"
                    />
                    <div className="flex items-center gap-1">
                        <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">ESC</kbd>
                    </div>
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto p-2 scroll-py-2">
                    <Command.Empty className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        No results found.
                    </Command.Empty>

                    <Command.Group heading="Actions" className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2 px-2">
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/notes', { state: { action: 'create' } }))}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                        >
                            <PlusCircle className="w-4 h-4 text-indigo-500" />
                            <span>Create New Note</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/tasks', { state: { action: 'create' } }))}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                        >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Create New Task</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/expenses', { state: { action: 'add-expense' } }))}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                        >
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            <span>Add Expense</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/expenses', { state: { action: 'add-income' } }))}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                        >
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span>Add Income</span>
                        </Command.Item>
                    </Command.Group>

                    <Command.Group heading="Navigation" className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2 px-2">
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/'))}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                        >
                            <Laptop className="w-4 h-4 text-blue-500" />
                            <span>Dashboard</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/notes'))}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                        >
                            <FileText className="w-4 h-4 text-yellow-500" />
                            <span>Notes</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/tasks'))}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                        >
                            <CheckSquare className="w-4 h-4 text-green-500" />
                            <span>Tasks</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/calendar'))}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                        >
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <span>Calendar</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/expenses'))}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                        >
                            <Wallet className="w-4 h-4 text-emerald-500" />
                            <span>Expenses</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/habits'))}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                        >
                            <Activity className="w-4 h-4 text-purple-500" />
                            <span>Habits</span>
                        </Command.Item>
                    </Command.Group>

                    <Command.Group heading="Notes" className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2 px-2 mt-4">
                        {notes.map((note) => (
                            <Command.Item
                                key={note._id}
                                onSelect={() => runCommand(() => navigate('/notes', { state: { selectedNoteId: note._id } }))}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                            >
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span>{note.title || 'Untitled'}</span>
                            </Command.Item>
                        ))}
                    </Command.Group>

                    <Command.Group heading="Tasks" className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2 px-2 mt-4">
                        {tasks?.map((task) => (
                            <Command.Item
                                key={task._id}
                                onSelect={() => runCommand(() => navigate('/tasks'))} // ideally focus on the task
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                            >
                                <CheckSquare className={`w-4 h-4 ${task.completed ? 'text-green-500' : 'text-gray-400'}`} />
                                <div className="flex flex-col">
                                    <span className={task.completed ? 'line-through opacity-70' : ''}>{task.title}</span>
                                </div>
                            </Command.Item>
                        ))}
                    </Command.Group>

                    <Command.Group heading="Habits" className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2 px-2 mt-4">
                        {habits?.map((habit) => (
                            <Command.Item
                                key={habit._id}
                                onSelect={() => runCommand(() => navigate('/habits'))}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                            >
                                <Activity className="w-4 h-4 text-purple-400" />
                                <span>{habit.name}</span>
                            </Command.Item>
                        ))}
                    </Command.Group>

                    <Command.Group heading="Recent Transactions" className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2 px-2 mt-4">
                        {expensesData?.recentTransactions?.map((txn) => (
                            <Command.Item
                                key={txn._id}
                                onSelect={() => runCommand(() => navigate('/expenses'))}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                            >
                                <Wallet className={`w-4 h-4 ${txn.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`} />
                                <span>{txn.description} - ₹{txn.amount}</span>
                            </Command.Item>
                        ))}
                    </Command.Group>

                    <Command.Group heading="Settings" className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2 px-2 mt-4">
                        <Command.Item
                            onSelect={() => runCommand(() => toggleTheme())}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
                            <span>Toggle Theme</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(logout)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer aria-selected:bg-red-50 dark:aria-selected:bg-red-900/20 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Log out</span>
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </div>
        </Command.Dialog>
    );
};
