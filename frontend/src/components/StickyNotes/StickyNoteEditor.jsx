import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Type, Image as ImageIcon, Trash2, Pin, Palette, Layout } from 'lucide-react';

const colors = [
    '#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90',
    '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8',
    '#e6c9a8', '#e8eaed'
];

const StickyNoteEditor = ({ note, onClose, onSave, onDelete }) => {
    const [title, setTitle] = useState(note?.title || '');
    const [content, setContent] = useState(note?.content || '');
    const [type, setType] = useState(note?.type || 'text');
    const [color, setColor] = useState(note?.color || '#ffffff');
    const [style, setStyle] = useState(note?.style || 'basic');
    const [isPinned, setIsPinned] = useState(note?.isPinned || false);
    const [checklistItems, setChecklistItems] = useState(
        Array.isArray(note?.content) ? note.content : []
    );

    useEffect(() => {
        if (note) {
            setTitle(note.title || '');
            setContent(note.content || '');
            setType(note.type || 'text');
            setColor(note.color || '#ffffff');
            setStyle(note.style || 'basic');
            setIsPinned(note.isPinned || false);
            if (note.type === 'checklist' && Array.isArray(note.content)) {
                setChecklistItems(note.content);
            }
        }
    }, [note]);

    const handleSave = () => {
        const finalContent = type === 'checklist' ? checklistItems : content;
        onSave({
            ...note,
            title,
            content: finalContent,
            type,
            color,
            style,
            isPinned
        });
        onClose();
    };

    const handleChecklistChange = (index, text) => {
        const newItems = [...checklistItems];
        newItems[index].text = text;
        setChecklistItems(newItems);
    };

    const toggleChecklistItem = (index) => {
        const newItems = [...checklistItems];
        newItems[index].completed = !newItems[index].completed;
        setChecklistItems(newItems);
    };

    const addChecklistItem = () => {
        setChecklistItems([...checklistItems, { text: '', completed: false }]);
    };

    const removeChecklistItem = (index) => {
        const newItems = checklistItems.filter((_, i) => i !== index);
        setChecklistItems(newItems);
    };

    const getStylePattern = () => {
        const opacity = isDark(color) ? '0.2' : '0.1';
        const strokeColor = isDark(color) ? '255, 255, 255' : '0, 0, 0';

        switch (style) {
            case 'lined':
                return {
                    backgroundImage: `linear-gradient(rgba(${strokeColor}, ${opacity}) 1px, transparent 1px)`,
                    backgroundSize: '100% 2rem',
                    backgroundPosition: '0 2rem'
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

    const isDark = (c) => {
        const darkColors = ['#202124', '#5f6368', '#000000'];
        return darkColors.includes(c);
    };

    const textAreaStyle = style === 'lined' ? { lineHeight: '2rem' } : {};

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all">
            <div
                className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transition-all transform scale-100 flex flex-col max-h-[85vh] ${style === 'rounded' ? 'rounded-[2rem]' : ''}`}
                style={{ backgroundColor: color, ...getStylePattern() }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 shrink-0">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="bg-transparent text-xl font-bold placeholder-black/30 focus:outline-none w-full text-gray-900"
                    />
                    <div className="flex items-center gap-1 ml-2">
                        <button
                            onClick={() => setIsPinned(!isPinned)}
                            className={`p-2 rounded-full hover:bg-black/5 transition-colors ${isPinned ? 'bg-black/10 text-black' : 'text-black/40 hover:text-black'}`}
                            title={isPinned ? "Unpin" : "Pin"}
                        >
                            <Pin className={`w-5 h-5 ${isPinned ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-black/5 text-black/40 hover:text-black transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-2 flex-1 overflow-y-auto custom-scrollbar min-h-[300px]">
                    {type === 'checklist' ? (
                        <div className="space-y-2">
                            {checklistItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <button
                                        onClick={() => toggleChecklistItem(index)}
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${item.completed ? 'bg-black/20 border-transparent' : 'border-black/20 hover:border-black/40'}`}
                                    >
                                        {item.completed && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                                    </button>
                                    <input
                                        type="text"
                                        value={item.text}
                                        onChange={(e) => handleChecklistChange(index, e.target.value)}
                                        placeholder="List item"
                                        className={`flex-1 bg-transparent focus:outline-none text-lg ${item.completed ? 'line-through opacity-40' : 'text-gray-800'}`}
                                        autoFocus={index === checklistItems.length - 1}
                                    />
                                    <button
                                        onClick={() => removeChecklistItem(index)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-black/30 hover:text-red-500 transition-all rounded-full hover:bg-black/5"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addChecklistItem}
                                className="flex items-center gap-3 text-black/40 hover:text-black/70 font-medium text-base mt-3 transition-colors group"
                            >
                                <span className="w-5 h-5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">+</span>
                                Add item
                            </button>
                        </div>
                    ) : (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Take a note..."
                            className="w-full h-full bg-transparent resize-none focus:outline-none text-lg placeholder-black/30 text-gray-800"
                            style={textAreaStyle}
                        />
                    )}
                </div>

                {/* Footer / Toolbar */}
                <div className="px-4 py-4 mt-auto flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm p-1 rounded-2xl shadow-sm border border-white/20">
                        <div className="relative group">
                            <button className="p-2.5 rounded-xl hover:bg-black/5 transition-colors text-gray-700" title="Background Color">
                                <Palette className="w-5 h-5" />
                            </button>
                            {/* Color Picker Popup */}
                            <div className="absolute bottom-full left-0 mb-3 p-3 bg-white rounded-2xl shadow-xl border border-gray-100 flex gap-2 flex-wrap w-[180px] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-20 transform origin-bottom-left">
                                {colors.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={`w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform shadow-sm ${color === c ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="relative group">
                            <button className="p-2.5 rounded-xl hover:bg-black/5 transition-colors text-gray-700" title="Note Style">
                                <Layout className="w-5 h-5" />
                            </button>
                            {/* Style Picker Popup */}
                            <div className="absolute bottom-full left-0 mb-3 p-2 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-1 w-36 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-20 transform origin-bottom-left">
                                {['basic', 'lined', 'grid', 'dot', 'rounded'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStyle(s)}
                                        className={`px-3 py-2 text-sm text-left rounded-xl hover:bg-gray-50 capitalize transition-colors ${style === s ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setType(type === 'text' ? 'checklist' : 'text');
                                if (type === 'text' && !checklistItems.length) {
                                    setChecklistItems([{ text: '', completed: false }]);
                                }
                            }}
                            className={`p-2.5 rounded-xl hover:bg-black/5 transition-colors text-gray-700 ${type === 'checklist' ? 'bg-black/10' : ''}`}
                            title="Toggle Checklist"
                        >
                            <CheckSquare className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onDelete(note)}
                            className="p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Note"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StickyNoteEditor;
