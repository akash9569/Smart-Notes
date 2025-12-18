import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Filter, SlidersHorizontal, Search, Trash2, Pencil, MoreVertical, FileText, Calendar, Flag, Tag, ChevronDown, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { tasksAPI, notesAPI } from '../api';
import CreateTaskModal from './CreateTaskModal';
import TaskDetailsPanel from './TaskDetailsPanel';
import { useAuth } from '../context/AuthContext';
import { format, isToday, isPast, startOfDay, endOfDay } from 'date-fns';
import { expandRecurringTasks } from '../utils/taskUtils';
import { toggleTaskCompletion } from '../utils/taskHelpers';

const TasksView = () => {
    const { user, updateUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Today');
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('default'); // 'default', 'priority-high', 'priority-low'

    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tasksRes, notesRes] = await Promise.all([
                tasksAPI.getTasks(),
                notesAPI.getNotes()
            ]);
            setTasks(tasksRes.data.data.tasks);
            setNotes(notesRes.data.data.notes);
        } catch (error) {
            console.error('Failed to fetch data', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredTasks = () => {
        let filtered = tasks;

        // Tab filtering
        if (activeTab === 'Today') {
            // Use expandRecurringTasks for Today view
            // We want tasks relevant to today (Start of day to End of day)
            const todayStart = startOfDay(new Date());
            const todayEnd = endOfDay(new Date());

            // Get all task instances for today
            const expanded = expandRecurringTasks(tasks, todayStart, todayEnd);

            // Filter out those that don't match today specifically (though expandRecurringTasks should handle overlap)
            // Also we want to ensure we're showing tasks specifically DUE or OCCURRING today
            filtered = expanded;

        } else if (activeTab === 'Assigned') {
            filtered = tasks.filter(task => task.assignedTo);
        } else if (activeTab === 'Notebooks') {
            filtered = tasks.filter(task => task.noteId);
        }

        // Search filtering
        if (searchQuery) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sorting
        if (sortOrder === 'priority-high') {
            const priorityWeight = { high: 3, medium: 2, low: 1 };
            filtered = [...filtered].sort((a, b) => {
                const weightA = priorityWeight[a.priority] || 2; // Default to medium if missing
                const weightB = priorityWeight[b.priority] || 2;
                return weightB - weightA;
            });
        } else if (sortOrder === 'priority-low') {
            const priorityWeight = { high: 3, medium: 2, low: 1 };
            filtered = [...filtered].sort((a, b) => {
                const weightA = priorityWeight[a.priority] || 2;
                const weightB = priorityWeight[b.priority] || 2;
                return weightA - weightB;
            });
        }

        return filtered;
    };

    const filteredTasks = getFilteredTasks();

    const handleCreateTask = async (taskData) => {
        try {
            const response = await tasksAPI.createTask(taskData);
            setTasks([response.data.data.task, ...tasks]);
            toast.success('Task added');
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Failed to add task');
        }
    };

    const handleUpdateTask = async (id, taskData) => {
        try {
            const response = await tasksAPI.updateTask(id, taskData);
            setTasks(tasks.map(t => t._id === id ? response.data.data.task : t));
            if (selectedTask?._id === id) {
                setSelectedTask(response.data.data.task);
            }
            // Close modal if it was open for editing
            if (isModalOpen) {
                setIsModalOpen(false);
                setEditingTask(null);
            }
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const toggleTask = async (e, id, completed) => {
        e.stopPropagation();

        // Find the full task object (could be an instance from expanded list)
        const taskToToggle = tasks.find(t => t._id === id);

        if (!taskToToggle) return;

        try {
            // Optimistic update
            setTasks(tasks.map(t => t._id === id ? { ...t, completed: !completed } : t));

            // Call helper - pass the task object and the list of ALL tasks (which contains it)
            // Note: If 'tasks' state contains expanded instances, we might need the original list.
            // But here 'tasks' is populated from API which returns raw tasks (unless filtered/expanded).
            // For 'Today' view, we will need to ensure we pass the right context.
            // Actually, tasksAPI.getTasks() returns raw tasks. 'tasks' state holds raw tasks.
            // If we are in 'Today' view, 'filteredTasks' will hold expanded instances.
            // We need to fetch the raw list or assume 'tasks' is sufficient if it contains the original.

            const response = await toggleTaskCompletion(taskToToggle, tasks);

            if (response.data.data.user) {
                updateUser(response.data.data.user);
            }

            // If it was a recurring task, we should probably refetch to ensure instances are clear
            fetchData();
        } catch (error) {
            console.error('Failed to toggle task', error);
            toast.error('Failed to update task');
            fetchData();
        }
    };

    const deleteTask = async (id) => {
        console.log('TasksView: Deleting task', id);
        try {
            await tasksAPI.deleteTask(id);
            setTasks(tasks.filter(t => t._id !== id));
            if (selectedTask?._id === id) setSelectedTask(null);
            toast.success('Task deleted');
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    const priorityColors = {
        high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };

    return (
        <div className="flex-1 bg-gray-50 dark:bg-[#121212] flex h-full overflow-hidden text-gray-900 dark:text-white">
            {/* Main Content Area */}
            <div className={`flex-1 flex-col min-w-0 ${selectedTask ? 'hidden lg:flex' : 'flex'}`}>
                {/* Header */}
                <div className="px-4 sm:px-8 pt-8 pb-4 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-1">Tasks</h1>
                            <p className="text-gray-500 dark:text-gray-400">Manage your daily goals and projects.</p>
                        </div>
                        {/* Streak Badge */}
                        {/* Streak Badge */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 rounded-xl px-4 py-2 w-fit">
                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center text-xl">
                                    🔥
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Daily Streak</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{user?.streak || 0} Days</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 rounded-xl px-4 py-2 w-fit">
                                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-500/20 rounded-full flex items-center justify-center text-xl">
                                    🏆
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">Best Streak</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{user?.highestStreak || 0} Days</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Tabs */}
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#252525] p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
                            {['My tasks', 'Today', 'Assigned', 'Notebooks'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab
                                        ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-64 transition-all"
                                />
                            </div>
                            <div className="relative group">
                                <button className={`p-2 rounded-xl transition-colors ${sortOrder !== 'default' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-[#252525]'}`}>
                                    <SlidersHorizontal className="w-5 h-5" />
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10 hidden group-hover:block hover:block">
                                    <button
                                        onClick={() => setSortOrder('default')}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#252525] ${sortOrder === 'default' ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                                    >
                                        Default
                                    </button>
                                    <button
                                        onClick={() => setSortOrder('priority-high')}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#252525] ${sortOrder === 'priority-high' ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                                    >
                                        Priority (High to Low)
                                    </button>
                                    <button
                                        onClick={() => setSortOrder('priority-low')}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#252525] ${sortOrder === 'priority-low' ? 'text-blue-600 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                                    >
                                        Priority (Low to High)
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingTask(null);
                                    setIsModalOpen(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-blue-500/20 transition-all whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">New Task</span>
                                <span className="sm:hidden">New</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Task List */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    {filteredTasks.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center pb-20 opacity-60">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-[#252525] rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No tasks found</h3>
                            <p className="text-gray-500">Create a new task to get started.</p>
                        </div>
                    ) : (
                        <>
                            {/* Pending Tasks */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">To Do</h3>
                                {filteredTasks.filter(t => !t.completed).map(task => (
                                    <div
                                        key={task._id}
                                        onClick={() => setSelectedTask(task)}
                                        className={`group bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 transition-all ${selectedTask?._id === task._id ? 'ring-2 ring-blue-500 border-transparent' : ''
                                            }`}
                                    >
                                        <button
                                            onClick={(e) => toggleTask(e, task._id, task.completed)}
                                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 border-gray-300 dark:border-gray-600 hover:border-blue-500`}
                                        >
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-medium text-gray-900 dark:text-white truncate`}>
                                                {task.title}
                                            </h3>
                                            {task.description && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            {task.priority && (
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block ${priorityColors[task.priority]}`}>
                                                    {task.priority}
                                                </span>
                                            )}

                                            {task.dueDate && (
                                                <div className={`flex items-center gap-1.5 text-xs ${isPast(new Date(task.dueDate)) ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span className="hidden sm:inline">{format(new Date(task.dueDate), 'MMM d')}</span>
                                                </div>
                                            )}

                                            {task.assignedTo && (
                                                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-[#333] flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 border border-white dark:border-gray-700 ring-1 ring-gray-200 dark:ring-gray-700">
                                                    {task.assignedTo.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {filteredTasks.filter(t => !t.completed).length === 0 && (
                                    <div className="text-center py-8 text-gray-400 dark:text-gray-600 italic">
                                        No pending tasks
                                    </div>
                                )}
                            </div>

                            {/* Completed Tasks */}
                            {filteredTasks.filter(t => t.completed).length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">Completed</h3>
                                    {filteredTasks.filter(t => t.completed).map(task => (
                                        <div
                                            key={task._id}
                                            onClick={() => setSelectedTask(task)}
                                            className={`group bg-gray-50 dark:bg-[#1a1a1a] border border-transparent rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white dark:hover:bg-[#1e1e1e] hover:shadow-sm transition-all opacity-75 hover:opacity-100 ${selectedTask?._id === task._id ? 'ring-2 ring-gray-200 dark:ring-gray-700' : ''
                                                }`}
                                        >
                                            <button
                                                onClick={(e) => toggleTask(e, task._id, task.completed)}
                                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 bg-blue-500 border-blue-500 text-white`}
                                            >
                                                <CheckCircle className="w-3.5 h-3.5" />
                                            </button>

                                            <div className="flex-1 min-w-0">
                                                <h3 className={`font-medium text-gray-500 dark:text-gray-500 truncate line-through`}>
                                                    {task.title}
                                                </h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Details Panel (Right Column) */}
            {
                selectedTask && (
                    <div className="w-full lg:w-auto h-full fixed inset-0 lg:static z-50 lg:z-auto bg-white dark:bg-[#1e1e1e]">
                        <TaskDetailsPanel
                            task={selectedTask}
                            onClose={() => setSelectedTask(null)}
                            onUpdate={(updatedTask) => handleUpdateTask(updatedTask._id, updatedTask)}
                            onDelete={deleteTask}
                            onEdit={handleEditTask}
                        />
                    </div>
                )
            }

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTask(null);
                }}
                onCreate={handleCreateTask}
                onUpdate={handleUpdateTask}
                taskToEdit={editingTask}
            />
        </div >
    );
};

export default TasksView;
