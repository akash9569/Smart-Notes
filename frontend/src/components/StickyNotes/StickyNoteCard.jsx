import React from 'react';
import { MoreHorizontal, Pin, Trash2, Maximize2, CheckSquare, Image as ImageIcon } from 'lucide-react';

const StickyNoteCard = ({ note, onEdit, onDelete, onPin, onColorChange }) => {
    const isDark = (color) => {
        // Simple check for dark colors to adjust text color
        const darkColors = ['#202124', '#5f6368'];
        return darkColors.includes(color);
    };

    const textColor = isDark(note.color) ? 'text-white' : 'text-gray-800';
    const metaColor = isDark(note.color) ? 'text-gray-400' : 'text-gray-500';

    const getStylePattern = () => {
        const opacity = isDark(note.color) ? '0.2' : '0.1';
        const strokeColor = isDark(note.color) ? '255, 255, 255' : '0, 0, 0';

        switch (note.style) {
            case 'lined':
                return {
                    backgroundImage: `linear-gradient(rgba(${strokeColor}, ${opacity}) 1px, transparent 1px)`,
                    backgroundSize: '100% 1.5rem',
                    backgroundPosition: '0 0.75rem'
                };
            case 'grid':
                return {
                    backgroundImage: `linear-gradient(rgba(${strokeColor}, ${opacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(${strokeColor}, ${opacity}) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                };
            case 'dot':
                return {
                    backgroundImage: `radial-gradient(rgba(${strokeColor}, ${opacity}) 1.5px, transparent 1.5px)`,
                    backgroundSize: '20px 20px'
                };
            default:
                return {};
        }
    };

    return (
        <div
            className={`relative group rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-[220px] overflow-hidden ${note.style === 'rounded' ? 'rounded-3xl' : ''}`}
            style={{ backgroundColor: note.color, ...getStylePattern() }}
            onClick={() => onEdit(note)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <h3 className={`font-semibold text-lg line-clamp-1 ${textColor}`}>
                    {note.title || 'Untitled'}
                </h3>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPin(note);
                    }}
                    className={`p-1.5 rounded-full hover:bg-black/5 transition-colors ${note.isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                    <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current' : ''} ${textColor}`} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {note.type === 'checklist' ? (
                    <div className="space-y-1">
                        {note.content.slice(0, 5).map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded border ${item.completed ? 'bg-black/20 border-transparent' : 'border-black/20'}`}>
                                    {item.completed && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <span className={`text-sm truncate ${item.completed ? 'line-through opacity-50' : ''} ${textColor}`}>
                                    {item.text}
                                </span>
                            </div>
                        ))}
                        {note.content.length > 5 && (
                            <div className={`text-xs ${metaColor} mt-1`}>
                                +{note.content.length - 5} more items
                            </div>
                        )}
                    </div>
                ) : (
                    <p className={`text-sm whitespace-pre-wrap line-clamp-6 ${textColor}`}>
                        {note.content}
                    </p>
                )}
            </div>

            {/* Footer Actions (Visible on Hover) */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 backdrop-blur-sm rounded-lg p-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(note);
                    }}
                    className={`p-1.5 rounded-md hover:bg-red-500 hover:text-white transition-colors ${textColor}`}
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default StickyNoteCard;
