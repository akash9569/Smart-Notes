import React, { useState, useEffect } from 'react';
import { X, Book, Smile } from 'lucide-react';
import { toast } from 'react-hot-toast';

const GRADIENTS = [
    'bg-gradient-to-r from-blue-500 to-cyan-500',
    'bg-gradient-to-r from-purple-500 to-pink-500',
    'bg-gradient-to-r from-green-400 to-emerald-600',
    'bg-gradient-to-r from-orange-400 to-red-500',
    'bg-gradient-to-r from-gray-700 to-gray-900',
];

const EMOJIS = ['📚', '📝', '💡', '🚀', '🎨', '💼', '🏠', '🎓'];

const CreateNotebookModal = ({ isOpen, onClose, onCreate, onUpdate, notebookToEdit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('📚');
    const [cover, setCover] = useState(GRADIENTS[0]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (notebookToEdit) {
            setName(notebookToEdit.name);
            setDescription(notebookToEdit.description || '');
            setIcon(notebookToEdit.icon || '📚');
            setCover(notebookToEdit.cover || GRADIENTS[0]);
        } else {
            setName('');
            setDescription('');
            setIcon('📚');
            setCover(GRADIENTS[0]);
        }
    }, [notebookToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Notebook name is required');
            return;
        }

        setLoading(true);
        try {
            const notebookData = { name, description, icon, cover };
            if (notebookToEdit) {
                await onUpdate(notebookToEdit._id, notebookData);
                toast.success('Notebook updated successfully');
            } else {
                await onCreate(notebookData);
                toast.success('Notebook created successfully');
            }
            onClose();
        } catch (error) {
            console.error('Error saving notebook:', error);
            toast.error(notebookToEdit ? 'Failed to update notebook' : 'Failed to create notebook');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 transform transition-all overflow-hidden mx-4 sm:mx-0">
                {/* Preview Header */}
                <div className={`h-32 w-full relative ${cover} transition-all duration-300`}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="absolute -bottom-8 left-8 w-16 h-16 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-lg flex items-center justify-center text-3xl border-4 border-white dark:border-[#1e1e1e]">
                        {icon}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 pt-12 space-y-5">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {notebookToEdit ? 'Edit Notebook' : 'New Notebook'}
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Project Ideas"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's this notebook about?"
                            rows="2"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Customization Options */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Icon
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {EMOJIS.map(e => (
                                    <button
                                        key={e}
                                        type="button"
                                        onClick={() => setIcon(e)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-all ${icon === e
                                            ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500'
                                            : 'hover:bg-gray-100 dark:hover:bg-[#2d2d2d]'
                                            }`}
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cover Style
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {GRADIENTS.map(g => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setCover(g)}
                                        className={`w-8 h-8 rounded-full ${g} transition-all ${cover === g
                                            ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-[#1e1e1e]'
                                            : 'hover:opacity-80'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                        >
                            {loading ? 'Saving...' : (notebookToEdit ? 'Save Changes' : 'Create Notebook')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateNotebookModal;
