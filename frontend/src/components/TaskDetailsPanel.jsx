import React, { useState, useEffect } from 'react';
import {
    X,
    Calendar,
    Flag,
    Tag,
    CheckSquare,
    Plus,
    Trash2,
    Clock,
    User,
    Paperclip,
    MoreHorizontal,
    Pencil
} from 'lucide-react';
import { format } from 'date-fns';
import { tasksAPI } from '../api';
import toast from 'react-hot-toast';

const TaskDetailsPanel = ({ task, onClose, onUpdate, onDelete, onEdit }) => {
    const [subtaskInput, setSubtaskInput] = useState('');
    const [localTask, setLocalTask] = useState(task);

    useEffect(() => {
        setLocalTask(task);
    }, [task]);

    if (!localTask) return null;

    const handleAddSubtask = async (e) => {
        if (e.key === 'Enter' && subtaskInput.trim()) {
            console.log('Adding subtask:', subtaskInput);
            const newSubtasks = [...(localTask.subtasks || []), { title: subtaskInput, completed: false }];
            try {
                console.log('Sending update with subtasks:', newSubtasks);
                const response = await tasksAPI.updateTask(localTask._id, { subtasks: newSubtasks });
                console.log('Subtask update response:', response.data);
                setLocalTask(response.data.data.task);
                onUpdate(response.data.data.task);
                setSubtaskInput('');
            } catch (error) {
                console.error('Failed to add subtask:', error);
                toast.error('Failed to add subtask');
            }
        }
    };

    const toggleSubtask = async (index) => {
        const newSubtasks = [...localTask.subtasks];
        newSubtasks[index].completed = !newSubtasks[index].completed;
        try {
            const response = await tasksAPI.updateTask(localTask._id, { subtasks: newSubtasks });
            setLocalTask(response.data.data.task);
            onUpdate(response.data.data.task);
        } catch (error) {
            toast.error('Failed to update subtask');
        }
    };

    const deleteSubtask = async (index) => {
        const newSubtasks = localTask.subtasks.filter((_, i) => i !== index);
        try {
            const response = await tasksAPI.updateTask(localTask._id, { subtasks: newSubtasks });
            setLocalTask(response.data.data.task);
            onUpdate(response.data.data.task);
        } catch (error) {
            toast.error('Failed to delete subtask');
        }
    };

    const [showMenu, setShowMenu] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const fileInputRef = React.useRef(null);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setAttachments([...attachments, ...files]);
        toast.success(`Uploaded ${files.length} file(s)`);
    };

    const priorityColors = {
        high: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30',
        medium: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30',
        low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',
    };

    return (
        <div className="w-full lg:w-96 bg-white dark:bg-[#1e1e1e] border-l border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-xl z-20">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1e1e1e]">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onUpdate({ ...localTask, completed: !localTask.completed })}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${localTask.completed
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-[#2d2d2d] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3d3d3d]'
                            }`}
                    >
                        <CheckSquare className="w-4 h-4" />
                        {localTask.completed ? 'Completed' : 'Mark Complete'}
                    </button>
                </div>
                <div className="flex items-center gap-1 relative">
                    <button
                        onClick={() => onEdit(localTask)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg transition-colors"
                        title="Edit Task"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg transition-colors"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#252525] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Remind me
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> Add tags
                                </button>
                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                                <button
                                    onClick={() => onDelete(localTask._id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete task
                                </button>
                            </div>
                        </>
                    )}

                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Title & Description */}
                <div>
                    <input
                        type="text"
                        value={localTask.title}
                        onChange={(e) => setLocalTask({ ...localTask, title: e.target.value })}
                        onBlur={() => onUpdate({ title: localTask.title })}
                        className="w-full text-xl font-bold text-gray-900 dark:text-white bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder-gray-400 mb-2"
                        placeholder="Task title"
                    />
                    <textarea
                        value={localTask.description || ''}
                        onChange={(e) => setLocalTask({ ...localTask, description: e.target.value })}
                        onBlur={() => onUpdate({ description: localTask.description })}
                        className="w-full text-sm text-gray-600 dark:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder-gray-400 resize-none min-h-[60px]"
                        placeholder="Add description..."
                    />
                </div>

                {/* Properties Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</label>
                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors text-sm text-gray-700 dark:text-gray-300">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {localTask.dueDate ? format(new Date(localTask.dueDate), 'MMM d, yyyy') : 'Set date'}
                        </button>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</label>
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-transparent ${priorityColors[localTask.priority || 'medium']}`}>
                            <Flag className="w-4 h-4" />
                            <span className="text-sm font-medium capitalize">{localTask.priority || 'Medium'}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignee</label>
                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors text-sm text-gray-700 dark:text-gray-300 group">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-white dark:ring-[#1e1e1e]">
                                {localTask.assignedTo ? localTask.assignedTo.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="flex-1 text-left truncate">{localTask.assignedTo || 'Unassigned'}</span>
                        </button>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</label>
                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors text-sm text-gray-700 dark:text-gray-300">
                            <Tag className="w-4 h-4 text-gray-400" />
                            Add tag
                        </button>
                    </div>
                </div>

                {/* Subtasks Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-gray-500" />
                            Subtasks
                        </h3>
                        <span className="text-xs text-gray-500">
                            {localTask.subtasks?.filter(s => s.completed).length || 0}/{localTask.subtasks?.length || 0}
                        </span>
                    </div>

                    <div className="space-y-2 mb-3">
                        {localTask.subtasks?.map((subtask, index) => (
                            <div key={index} className="group flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] rounded-lg transition-colors">
                                <button
                                    onClick={() => toggleSubtask(index)}
                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${subtask.completed
                                        ? 'bg-blue-500 border-blue-500 text-white'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                                        }`}
                                >
                                    {subtask.completed && <CheckSquare className="w-3 h-3" />}
                                </button>
                                <span className={`flex-1 text-sm ${subtask.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                                    {subtask.title}
                                </span>
                                <button
                                    onClick={() => deleteSubtask(index)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 px-2">
                        <Plus className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={subtaskInput}
                            onChange={(e) => setSubtaskInput(e.target.value)}
                            onKeyDown={handleAddSubtask}
                            placeholder="Add a subtask..."
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Attachments Section */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        Attachments
                    </h3>

                    {/* File List */}
                    {attachments.length > 0 && (
                        <div className="space-y-2 mb-3">
                            {attachments.map((file, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs uppercase">
                                        {file.name.split('.').pop()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <button
                                        onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        onChange={handleFileUpload}
                    />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors cursor-pointer group"
                    >
                        <div className="w-10 h-10 bg-gray-100 dark:bg-[#333] rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Plus className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex justify-between items-center text-xs text-gray-500">
                <span>Created {format(new Date(localTask.createdAt), 'MMM d, yyyy')}</span>
                <button
                    onClick={() => onDelete(localTask._id)}
                    className="flex items-center gap-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Task
                </button>
            </div>
        </div>
    );
};

export default TaskDetailsPanel;
