import React, { useState, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, CheckCircle2, Globe, PenTool, Send, X, Loader2, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

const AIMenu = ({ isOpen, onClose, onAction, isLoading, error, isDemoMode, onToggleDemoMode, triggerRef }) => {
    const [customPrompt, setCustomPrompt] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef(null);

    useLayoutEffect(() => {
        if (isOpen && triggerRef?.current) {
            const updatePosition = () => {
                const rect = triggerRef.current.getBoundingClientRect();
                // Position below the trigger, aligned to the right
                // We need to check if it fits, but for now let's just place it
                // rect.bottom + scrollY for top
                // rect.right for right alignment (we'll set left to rect.right - menuWidth)

                // Since we don't know menu width easily before render, let's align left for now or just use right alignment via CSS if we set left/top
                // Actually, let's align to the left of the trigger for simplicity, or try to match the previous "right-0" behavior
                // "right-0" relative to parent means aligned to right edge of parent.
                // Here "parent" is the trigger button wrapper.

                // Let's calculate left such that the menu's right edge aligns with trigger's right edge.
                // We can use `left: rect.right - 320` (since w-80 is 20rem = 320px).
                // Let's be safer and use `left: rect.left` and if it overflows right, shift it.
                // But the original was `right-0`, so it aligned to the right of the container.

                setPosition({
                    top: rect.bottom + 8, // 8px gap
                    left: rect.left // Align left for now, or we can do rect.right - 320
                });
            };

            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);

            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isOpen, triggerRef]);

    if (!isOpen) return null;

    const handleCustomSubmit = (e) => {
        e.preventDefault();
        if (customPrompt.trim()) {
            onAction('custom', customPrompt);
            setCustomPrompt('');
        }
    };

    const menuContent = (
        <div
            ref={menuRef}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
            className="fixed w-80 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden z-[9999] animate-in fade-in zoom-in-95 duration-200 origin-top-left ring-1 ring-black/5 dark:ring-white/5 font-sans"
        >

            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5">
                <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white tracking-tight">AI Assistant</span>
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={onToggleDemoMode}
                        className={`flex items-center space-x-1.5 px-2 py-1 rounded-full transition-all duration-200 border ${isDemoMode ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-gray-100 dark:bg-white/5 border-transparent hover:bg-gray-200 dark:hover:bg-white/10'}`}
                        title={isDemoMode ? "Disable Demo Mode" : "Enable Demo Mode"}
                    >
                        <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDemoMode ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {isDemoMode ? 'Demo' : 'Real'}
                        </span>
                        {isDemoMode ? (
                            <ToggleRight className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        ) : (
                            <ToggleLeft className="w-3.5 h-3.5 text-gray-400" />
                        )}
                    </button>
                    <button onClick={onClose} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Demo Mode Info Badge */}
                {isDemoMode && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 flex items-start space-x-2.5">
                        <div className="flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">Demo Mode Active</p>
                            <p className="text-[11px] text-green-600 dark:text-green-300 leading-relaxed">AI features work without API credits. Responses are simulated locally.</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && !isDemoMode && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-start space-x-2.5 animate-in slide-in-from-top-2">
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-medium text-red-600 dark:text-red-300 leading-relaxed">{error}</p>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2.5">
                    {[
                        { id: 'summarize', icon: Sparkles, label: 'Summarize', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800' },
                        { id: 'fix-spelling', icon: CheckCircle2, label: 'Fix Grammar', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800' },
                        { id: 'translate', icon: Globe, label: 'Translate', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800' },
                        { id: 'continue', icon: PenTool, label: 'Continue Writing', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800' }
                    ].map((action) => (
                        <button
                            key={action.id}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAction(action.id);
                            }}
                            disabled={isLoading}
                            className={`relative flex flex-col items-center justify-center p-3.5 rounded-xl border ${action.border} ${action.bg} hover:brightness-95 dark:hover:brightness-110 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <div className={`p-2 rounded-full bg-white dark:bg-white/10 shadow-sm mb-2 group-hover:scale-110 transition-transform duration-300`}>
                                <action.icon className={`w-4 h-4 ${action.color}`} />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{action.label}</span>
                        </button>
                    ))}
                </div>

                {/* Custom Input */}
                <div className="pt-3 border-t border-gray-100 dark:border-white/5">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 ml-1 uppercase tracking-wider">
                        Custom Prompt
                    </label>
                    <form onSubmit={handleCustomSubmit} className="relative group">
                        <input
                            type="text"
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="Ask AI to rewrite, explain, or expand..."
                            disabled={isLoading}
                            className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white placeholder-gray-400 transition-all disabled:opacity-50 shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={!customPrompt.trim() || isLoading}
                            className="absolute right-1.5 top-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Send className="w-3.5 h-3.5" />
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-10 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1e1e1e] px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 border border-gray-100 dark:border-white/10 animate-in zoom-in-95 ring-1 ring-black/5">
                        <div className="relative">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping absolute inset-0"></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full relative"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Processing...</span>
                    </div>
                </div>
            )}
        </div>
    );

    return createPortal(menuContent, document.body);
};

export default AIMenu;
