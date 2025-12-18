import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const HabitModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Health',
        frequency: 'daily',
        days: [],
        reminder: '',
        color: '#10B981',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                category: initialData.category,
                frequency: initialData.frequency,
                days: initialData.days || [],
                reminder: initialData.reminder || '',
                color: initialData.color,
            });
        }
    }, [initialData]);

    const categories = ['Health', 'Study', 'Fitness', 'Skills', 'Routine', 'Work', 'Mindfulness', 'Other'];
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6'];
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const toggleDay = (day) => {
        setFormData(prev => {
            const newDays = prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day];
            return { ...prev, days: newDays };
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-[#333] flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {initialData ? 'Edit Habit' : 'New Habit'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Habit Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Drink 3L Water"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-[#2d2d2d] border border-gray-200 dark:border-[#444] rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>

                    {/* Category & Color */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#2d2d2d] border border-gray-200 dark:border-[#444] rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white appearance-none cursor-pointer"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#2d2d2d] border border-gray-200 dark:border-[#444] rounded-xl px-3 py-1.5">
                                {colors.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color: c })}
                                        className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${formData.color === c ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-[#2d2d2d]' : ''}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Frequency */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frequency</label>
                        <div className="flex gap-2 mb-3">
                            {['daily', 'weekly'].map(f => (
                                <button
                                    key={f}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, frequency: f })}
                                    className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${formData.frequency === f
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-500'
                                        : 'bg-gray-50 dark:bg-[#2d2d2d] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333]'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {formData.frequency === 'weekly' && (
                            <div className="flex justify-between gap-1">
                                {daysOfWeek.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={`w-10 h-10 rounded-full text-xs font-medium transition-all ${formData.days.includes(day)
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                            : 'bg-gray-100 dark:bg-[#2d2d2d] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#333]'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reminder */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reminder (Optional)</label>
                        <input
                            type="time"
                            value={formData.reminder}
                            onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-[#2d2d2d] border border-gray-200 dark:border-[#444] rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 rounded-xl font-medium text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Save Habit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HabitModal;
