import React, { useState } from 'react';
import { X, Link as LinkIcon, Youtube } from 'lucide-react';

const YoutubeModal = ({ isOpen, onClose, onInsert }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url.trim()) {
            setError('Please enter a valid URL');
            return;
        }
        onInsert(url);
        setUrl('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white dark:bg-[#191919] w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-[#333] overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-[#333] flex items-center justify-between bg-gray-50 dark:bg-[#1e1e1e]">
                    <div className="flex items-center space-x-2">
                        <Youtube className="w-5 h-5 text-red-600" />
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Insert YouTube Video</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-[#2d2d2d] rounded-full transition-colors text-gray-500 dark:text-gray-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                YouTube URL
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LinkIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => {
                                        setUrl(e.target.value);
                                        if (error) setError('');
                                    }}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-[#444] rounded-lg bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow sm:text-sm"
                                    autoFocus
                                />
                            </div>
                            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                Paste the full URL of the YouTube video you want to embed. The video will be playable directly within your note.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm flex items-center space-x-2"
                        >
                            <span>Insert Video</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default YoutubeModal;
