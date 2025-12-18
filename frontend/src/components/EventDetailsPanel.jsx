import React from 'react';
import { X, Calendar, Clock, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const categoryColors = {
    task: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', darkBg: 'dark:bg-green-900/30', darkText: 'dark:text-green-400' },
    event: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', darkBg: 'dark:bg-purple-900/30', darkText: 'dark:text-purple-400' },
    deadline: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', darkBg: 'dark:bg-red-900/30', darkText: 'dark:text-red-400' },
    reminder: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', darkBg: 'dark:bg-yellow-900/30', darkText: 'dark:text-yellow-400' },
    class: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', darkBg: 'dark:bg-blue-900/30', darkText: 'dark:text-blue-400' },
    personal: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', darkBg: 'dark:bg-orange-900/30', darkText: 'dark:text-orange-400' },
};

const EventDetailsPanel = ({ event, onClose, onEdit, onDelete }) => {
    if (!event) return null;

    const colors = categoryColors[event.category || 'task'] || categoryColors.task;
    const startDate = new Date(event.startDate || event.dueDate || event.createdAt);
    const endDate = event.endDate ? new Date(event.endDate) : null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30" onClick={onClose}></div>

            {/* Panel */}
            <div className="fixed inset-y-0 right-0 lg:inset-y-4 lg:right-4 w-full lg:w-96 bg-white dark:bg-[#1e1e1e] shadow-2xl border-l lg:border border-gray-200 dark:border-gray-800 lg:rounded-2xl transform transition-transform duration-300 ease-in-out z-40 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colors.bg.replace('bg-', 'bg-').replace('-100', '-500')} shadow-sm`}></div>
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {event.category || 'Task'}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Title & Description */}
                    <div>
                        <h3 className={`text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight ${event.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                            {event.title}
                        </h3>
                        {event.completed && (
                            <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                                Completed (View Only)
                            </span>
                        )}
                        {event.description && (
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                {event.description}
                            </p>
                        )}
                    </div>

                    {/* Meta Data Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800/50">
                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">Date</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {format(startDate, 'EEEE, MMMM d, yyyy')}
                                </p>
                            </div>
                        </div>

                        {(event.type === 'event' || event.startDate) && (
                            <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800/50">
                                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">Time</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {format(startDate, 'h:mm a')}
                                        {endDate && ` - ${format(endDate, 'h:mm a')}`}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800/50">
                            <AlertCircle className={`w-5 h-5 mt-0.5 ${event.priority === 'high' ? 'text-red-500' :
                                event.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                                }`} />
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">Priority</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                    {event.priority || 'Medium'}
                                </p>
                            </div>
                        </div>

                        {/* Repeat Settings (Visual Only) */}
                        <div className="flex items-start gap-4 p-3 rounded-xl bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800/50">
                            <div className="w-5 h-5 mt-0.5 flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">Repeat</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Does not repeat
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#252525]/50 flex items-center justify-end gap-3">
                    <button
                        onClick={() => onEdit(event)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 flex items-center gap-2"
                        title="Edit Details"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(event.originalTaskId || event._id)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30 flex items-center gap-2"
                        title="Delete Event"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>
        </>
    );
};

export default EventDetailsPanel;
