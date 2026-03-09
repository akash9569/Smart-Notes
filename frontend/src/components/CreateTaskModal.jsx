import React, { useState, useEffect } from 'react';
import {
    X,
    Calendar,
    Clock,
    Flag,
    User,
    AlertCircle,
    ChevronDown,
    CheckCircle,
    FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { notesAPI } from '../api';

const CreateTaskModal = ({ isOpen, onClose, onCreate, onUpdate, taskToEdit, isEvent }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [reminder, setReminder] = useState(null);
    const [priority, setPriority] = useState('medium');
    const [isFlagged, setIsFlagged] = useState(false);
    const [assignedTo, setAssignedTo] = useState('');
    const [noteId, setNoteId] = useState('');
    const [notes, setNotes] = useState([]);
    const [type, setType] = useState('task'); // 'task' or 'event'
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [color, setColor] = useState('#3B82F6');
    const [recurrenceType, setRecurrenceType] = useState('none');
    const [applicableMonths, setApplicableMonths] = useState([]);

    const [category, setCategory] = useState('task');

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await notesAPI.getNotes();
                setNotes(response.data.data.notes);
            } catch (error) {
                console.error('Failed to fetch notes', error);
            }
        };
        if (isOpen) {
            fetchNotes();
        }
    }, [isOpen]);

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title || '');
            setDescription(taskToEdit.description || '');
            // Use startDate as fallback for dueDate if creating a task from a time slot click
            setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : (taskToEdit.startDate ? new Date(taskToEdit.startDate) : null));
            setReminder(taskToEdit.reminder ? new Date(taskToEdit.reminder) : null);
            setPriority(taskToEdit.priority || 'medium');
            setIsFlagged(taskToEdit.isFlagged || false);
            setAssignedTo(taskToEdit.assignedTo || '');
            setNoteId(taskToEdit.noteId?._id || taskToEdit.noteId || '');
            setType(taskToEdit.type || 'task');
            setCategory(taskToEdit.category || 'task');
            setStartDate(taskToEdit.startDate ? new Date(taskToEdit.startDate) : null);
            setEndDate(taskToEdit.endDate ? new Date(taskToEdit.endDate) : null);
            setColor(taskToEdit.color || '#3B82F6');
            setRecurrenceType(taskToEdit.recurrence?.type || 'none');
            setApplicableMonths(taskToEdit.recurrence?.applicableMonths || []);
        } else {
            // Reset form when not editing
            setTitle('');
            setDescription('');
            setDueDate(null);
            setReminder(null);
            setPriority('medium');
            setIsFlagged(false);
            setAssignedTo('');
            setNoteId('');
            setType(isEvent ? 'event' : 'task'); // Use prop if passed
            setCategory('task');
            setStartDate(null);
            setEndDate(null);
            setColor('#3B82F6');
            setRecurrenceType('none');
            setApplicableMonths([]);
        }
    }, [taskToEdit, isOpen, isEvent]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting task form...', { title, type, taskToEdit });
        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        const taskData = {
            title,
            description,
            type,
            category,
            assignedTo,
            noteId: noteId || null,
            color,
            recurrence: recurrenceType !== 'none' ? {
                type: recurrenceType,
                interval: 1,
                applicableMonths: applicableMonths.length > 0 ? applicableMonths : undefined
            } : null
        };

        if (type === 'task') {
            taskData.dueDate = dueDate;
            taskData.priority = priority;
            taskData.isFlagged = isFlagged;
            taskData.reminder = reminder;
        } else {
            taskData.startDate = startDate;
            taskData.endDate = endDate;
            taskData.reminder = reminder;
        }

        if (taskToEdit && taskToEdit._id) {
            onUpdate(taskToEdit.originalTaskId || taskToEdit._id, taskData);
        } else {
            onCreate(taskData);
        }

        onClose();
    };

    const formatDateTimeLocal = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 backdrop-blur-[1px] transition-opacity p-4 sm:p-0">
            <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-[448px] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] transition-all duration-200 overflow-hidden">
                {/* Header / Drag Handle */}
                <div className="bg-gray-50/50 dark:bg-[#252525] px-4 py-2 flex justify-end border-b border-gray-100 dark:border-gray-800/50">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#333]">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <form id="create-task-form" onSubmit={handleSubmit} className="space-y-5">

                        {/* Title Input - Google Calendar Style */}
                        <div>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Add title"
                                className="w-full bg-transparent text-[22px] leading-tight font-normal text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:outline-none py-1 transition-colors"
                                autoFocus
                            />
                        </div>

                        {/* Type Toggle */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setType('event')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${type === 'event'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333]'
                                    }`}
                            >
                                Event
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('task')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${type === 'task'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333]'
                                    }`}
                            >
                                Task
                            </button>
                        </div>

                        {/* Date & Time Section */}
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div className="flex-1 space-y-3">
                                {type === 'task' ? (
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            value={formatDateTimeLocal(dueDate)}
                                            onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : null)}
                                            className="w-full bg-gray-50 dark:bg-[#2d2d2d] border-0 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-200 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Start</label>
                                            <input
                                                type="datetime-local"
                                                value={formatDateTimeLocal(startDate)}
                                                onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                                                className="w-full bg-gray-50 dark:bg-[#2d2d2d] border-0 rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-200 focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">End</label>
                                            <input
                                                type="datetime-local"
                                                value={formatDateTimeLocal(endDate)}
                                                onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                                                className="w-full bg-gray-50 dark:bg-[#2d2d2d] border-0 rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-200 focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reminder Section */}
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div className="flex-1 space-y-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Reminder</label>
                                    <input
                                        type="datetime-local"
                                        value={formatDateTimeLocal(reminder)}
                                        onChange={(e) => setReminder(e.target.value ? new Date(e.target.value) : null)}
                                        className="w-full bg-gray-50 dark:bg-[#2d2d2d] border-0 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-200 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Recurrence */}
                        <div className="flex items-start gap-3">
                            <div className="w-5 flex justify-center mt-0.5">
                                <span className="text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 5v7h7" /></svg>
                                </span>
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Repeat</label>
                                    <select
                                        value={recurrenceType}
                                        onChange={(e) => setRecurrenceType(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-[#2d2d2d] border-0 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-200 focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="none">Does not repeat</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>

                                    {/* Month Selector - Only for daily/weekly/monthly */}
                                    {(recurrenceType === 'daily' || recurrenceType === 'weekly' || recurrenceType === 'monthly') && (
                                        <div className="mt-3 p-3 bg-gray-100 dark:bg-[#1e1e1e] rounded-lg">
                                            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">Limit to months (optional):</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
                                                    const monthNum = idx + 1;
                                                    const isSelected = applicableMonths.includes(monthNum);
                                                    return (
                                                        <button
                                                            key={month}
                                                            type="button"
                                                            onClick={() => {
                                                                if (isSelected) {
                                                                    setApplicableMonths(applicableMonths.filter(m => m !== monthNum));
                                                                } else {
                                                                    setApplicableMonths([...applicableMonths, monthNum].sort((a, b) => a - b));
                                                                }
                                                            }}
                                                            className={`px-2 py-1.5 text-xs rounded transition-all ${isSelected
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-white dark:bg-[#2d2d2d] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#353535]'
                                                                }`}
                                                        >
                                                            {month}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {applicableMonths.length > 0 && (
                                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                    Selected: {applicableMonths.map(m => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Yearly Helper Text */}
                                    {recurrenceType === 'yearly' && startDate && (
                                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                                            📅 Recurs annually on {startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex items-start gap-3">
                            <div className="w-5 flex justify-center mt-0.5">
                                <span className="text-gray-400">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h12" /></svg>
                                </span>
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add description"
                                    className="w-full bg-gray-50 dark:bg-[#2d2d2d] border-0 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:ring-1 focus:ring-blue-500 min-h-[80px] resize-none"
                                />
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="flex items-center gap-3">
                            <Flag className={`w-5 h-5 mt-0.5 ${priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-orange-500' : 'text-blue-500'}`} />
                            <div className="flex-1 space-y-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</label>
                                    <div className="flex gap-2">
                                        {['low', 'medium', 'high'].map(p => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setPriority(p)}
                                                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${priority === p
                                                    ? p === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                        : p === 'medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333]'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Category & Color */}
                        <div className="flex items-center gap-3">
                            <div className="w-5 flex justify-center">
                                <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600" style={{ backgroundColor: color }}></div>
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Color:</span>
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="w-6 h-6 rounded-full border-0 p-0 cursor-pointer bg-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">List:</span>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-[#333] rounded px-1 py-0.5"
                                    >
                                        <option value="task">My Tasks</option>
                                        <option value="event">Events</option>
                                        <option value="personal">Personal</option>
                                        <option value="work">Work</option>
                                        <option value="learning">Learning</option>
                                        <option value="class">Class</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 flex justify-end">
                    <button
                        type="submit"
                        form="create-task-form"
                        className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
