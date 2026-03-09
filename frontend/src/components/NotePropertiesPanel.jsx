import React, { useState } from 'react';
import {
    X,
    Palette,
    Tag as TagIcon,
    Layout,
    BookOpen,
    FileText,
    Calendar,
    Clock,
    BarChart3,
    Download,
    Link2,
    History,
    Sparkles,
    Wand2,
    ListTodo,
    Eraser,
    Plus,
    ChevronDown
} from 'lucide-react';
import { summarizeNote, extractTasks } from '../services/aiAPI';
import toast from 'react-hot-toast';

const NotePropertiesPanel = ({ note, onUpdate, onClose }) => {
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [isAILoading, setIsAILoading] = useState(false);
    const [aiSummary, setAiSummary] = useState(null);
    const [aiTasks, setAiTasks] = useState(null);

    if (!note) {
        return (
            <div className="w-80 bg-white dark:bg-[#1c1c1c] border-l border-gray-200 dark:border-[#333] flex items-center justify-center p-8 text-center">
                <div>
                    <FileText className="w-12 h-12 text-gray-300 dark:text-[#555] mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-[#888]">
                        Select a note to view properties
                    </p>
                </div>
            </div>
        );
    }

    const colors = [
        '#ffffff', '#f28b82', '#fbbc04', '#fff475',
        '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa',
        '#d7aefb', '#fdcfe8', '#e6c9a8', '#e8eaed'
    ];

    const handleColorChange = (color) => {
        onUpdate({ color });
        setIsColorPickerOpen(false);
    };

    const handleAddTag = () => {
        if (newTag.trim() && !note.tags?.includes(newTag.trim())) {
            const updatedTags = [...(note.tags || []), newTag.trim()];
            onUpdate({ tags: updatedTags });
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = note.tags.filter(tag => {
            const tagName = typeof tag === 'object' ? tag.name : tag;
            return tagName !== tagToRemove;
        });
        onUpdate({ tags: updatedTags });
    };

    const calculateReadingTime = (text) => {
        const wordsPerMinute = 200;
        const words = text?.split(/\s+/).length || 0;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes || 1;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAISummarize = async () => {
        setIsAILoading(true);

        try {
            const content = note.plainText || '';

            if (!content || content.trim().length < 10) {
                toast.error('Note is too short to summarize');
                setIsAILoading(false);
                return;
            }

            const response = await summarizeNote(content);

            if (response.success) {
                setAiSummary(response.summary);

                // Show source indicator
                if (response.source === 'openai') {
                    toast.success('AI summary generated!', { icon: '🤖' });
                } else {
                    toast('Summary generated (pattern-matching)', { icon: '📝' });
                }
            } else {
                toast.error('Failed to generate summary');
            }
        } catch (error) {
            console.error('Summarization error:', error);
            toast.error('Failed to generate summary');
        } finally {
            setIsAILoading(false);
        }
    };

    const handleAIExtractTasks = async () => {
        setIsAILoading(true);

        try {
            const content = note.plainText || '';

            if (!content || content.trim().length < 10) {
                toast.error('Note is too short to extract tasks');
                setIsAILoading(false);
                return;
            }

            const response = await extractTasks(content);

            if (response.success) {
                setAiTasks(response.tasks);

                // Show source indicator
                if (response.source === 'openai') {
                    toast.success(`${response.tasks.length} tasks extracted!`, { icon: '🤖' });
                } else {
                    toast(`${response.tasks.length} tasks found (pattern-matching)`, { icon: '📝' });
                }
            } else {
                toast.error('Failed to extract tasks');
            }
        } catch (error) {
            console.error('Task extraction error:', error);
            toast.error('Failed to extract tasks');
        } finally {
            setIsAILoading(false);
        }
    };

    const handleExport = (format) => {
        const title = note.title || 'Untitled';
        const htmlContent = note.content || '';
        const plainContent = note.plainText || '';
        const backgroundColor = note.color !== '#ffffff' ? note.color : '#ffffff';

        switch (format) {
            case 'pdf':
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>${title}</title>
                        <style>
                            @media print {
                                @page { margin: 1in; }
                            }
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                                max-width: 8.5in;
                                margin: 0 auto;
                                padding: 20px;
                                line-height: 1.6;
                                color: #333;
                                background-color: ${backgroundColor};
                            }
                            h1 { font-size: 32px; font-weight: bold; margin-bottom: 20px; color: #111; }
                            p { margin: 12px 0; }
                            ul, ol { margin: 12px 0; padding-left: 24px; }
                            li { margin: 6px 0; }
                            strong { font-weight: 600; }
                            em { font-style: italic; }
                            code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
                            pre { background: #f4f4f4; padding: 12px; border-radius: 6px; overflow-x: auto; }
                            blockquote { border-left: 4px solid #ddd; padding-left: 16px; margin: 12px 0; color: #666; }
                            table { border-collapse: collapse; width: 100%; margin: 12px 0; }
                            td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f4f4f4; font-weight: 600; }
                        </style>
                    </head>
                    <body>
                        <h1>${title}</h1>
                        <div class="content">${htmlContent || `<p>${plainContent}</p>`}</div>
                    </body>
                    </html>
                `);
                printWindow.document.close();
                setTimeout(() => { printWindow.print(); }, 250);
                break;
            case 'markdown':
                let mdContent = `# ${title}\n\n`;
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlContent;
                mdContent += tempDiv.innerText || plainContent;
                downloadFile(mdContent, `${title}.md`, 'text/markdown');
                break;
            case 'html':
                const fullHtmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { font-family: sans-serif; max-width: 900px; margin: 40px auto; padding: 40px; line-height: 1.6; color: #333; background-color: ${backgroundColor}; }
        h1 { font-size: 36px; font-weight: bold; margin-bottom: 24px; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
        pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; padding-left: 16px; color: #666; font-style: italic; }
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #f4f4f4; font-weight: 600; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="content">${htmlContent || `<p>${plainContent}</p>`}</div>
</body>
</html>`;
                downloadFile(fullHtmlContent, `${title}.html`, 'text/html');
                break;
            case 'txt':
                const tempDiv2 = document.createElement('div');
                tempDiv2.innerHTML = htmlContent;
                const txtContent = `${title}\n${'='.repeat(title.length)}\n\n${tempDiv2.innerText || plainContent}`;
                downloadFile(txtContent, `${title}.txt`, 'text/plain');
                break;
        }
    };

    const downloadFile = (content, filename, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const PropertyGroup = ({ label, children }) => (
        <div className="mb-6">
            <label className="block text-[11px] font-bold text-gray-500 dark:text-[#888] tracking-[0.08em] uppercase mb-3 px-1">
                {label}
            </label>
            {children}
        </div>
    );

    return (
        <div className="w-[320px] bg-white dark:bg-[#1a1a1a] border-l border-gray-200 dark:border-[#2a2a2a] flex flex-col h-full overflow-hidden text-gray-800 dark:text-[#e0e0e0] font-sans">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-200 dark:border-[#2a2a2a] flex items-center justify-between shrink-0">
                <h3 className="font-semibold text-[17px] text-gray-900 dark:text-white tracking-tight">Properties</h3>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-gray-500 dark:text-[#888] hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6">

                {/* Color Picker */}
                <PropertyGroup label="Color">
                    <div className="relative">
                        <button
                            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#222] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors focus:outline-none"
                        >
                            <div
                                className="w-5 h-5 rounded-[4px] border border-gray-300 dark:border-[#444] shadow-sm ml-1"
                                style={{ backgroundColor: note.color || '#ffffff' }}
                            />
                            <span className="text-[13px] text-gray-700 dark:text-[#ddd] font-medium flex-1 text-left">
                                {note.color === '#ffffff' || !note.color ? 'Default' : 'Custom'}
                            </span>
                            <Palette className="w-4 h-4 text-gray-400 dark:text-[#777] mr-1" />
                        </button>

                        {isColorPickerOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-[#2a2a2a] rounded-xl shadow-2xl border border-gray-200 dark:border-[#444] z-10 animate-in fade-in zoom-in-95 duration-100">
                                <div className="grid grid-cols-4 gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => handleColorChange(color)}
                                            className={`w-full aspect-square rounded-md border transition-all hover:scale-110 ${note.color === color
                                                ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-[#2a2a2a]'
                                                : 'border-gray-200 dark:border-[#444]'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </PropertyGroup>

                {/* Tags */}
                <PropertyGroup label="Tags">
                    <div className="space-y-3">
                        {(!note.tags || note.tags.length === 0) && (
                            <p className="text-[13px] text-gray-500 dark:text-[#666] italic px-1">No tags yet</p>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {note.tags && note.tags.map((tag, idx) => {
                                const tagName = typeof tag === 'object' ? tag.name : tag;
                                return (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#3a3a3a] text-[12px] text-gray-700 dark:text-[#ccc]"
                                    >
                                        <TagIcon className="w-3 h-3 text-gray-400 dark:text-[#777]" />
                                        {tagName}
                                        <button
                                            onClick={() => handleRemoveTag(tagName)}
                                            className="hover:text-gray-900 dark:hover:text-white transition-colors rounded-full p-0.5"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                );
                            })}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                placeholder="Add tag..."
                                className="flex-1 px-3 py-2 text-[13px] rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#222] text-gray-900 dark:text-[#eee] placeholder-gray-400 dark:placeholder-[#666] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                            <button
                                onClick={handleAddTag}
                                className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center shrink-0"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </PropertyGroup>

                {/* Template */}
                <PropertyGroup label="Template">
                    <div className="relative">
                        <select
                            value={note.template || 'blank'}
                            onChange={(e) => {
                                const template = e.target.value;
                                const isJournal = ['morning-journal', 'night-reflection', 'gratitude-journal'].includes(template);
                                onUpdate({
                                    template,
                                    ...(isJournal && { isJournal: true })
                                });
                            }}
                            className="w-full px-3 py-2.5 text-[13px] font-medium rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#222] text-gray-700 dark:text-[#ddd] appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="blank">Blank Page</option>
                            <option value="lined-medium-default">Lined Paper</option>
                            <option value="grid-medium-default">Grid Paper</option>
                            <option value="dotgrid-default">Dot Grid</option>
                            <option value="cornell">Cornell Notes</option>
                            <option value="monthly-planner">Monthly Planner</option>
                            <option value="weekly-planner">Weekly Planner</option>
                            <option value="checklist">Checklist</option>
                            <optgroup label="Journaling">
                                <option value="morning-journal">Morning Journal</option>
                                <option value="night-reflection">Night Reflection</option>
                                <option value="gratitude-journal">Gratitude Journal</option>
                            </optgroup>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 dark:text-[#777] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </PropertyGroup>

                {/* Statistics */}
                <PropertyGroup label="Statistics">
                    <div className="space-y-4 px-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[13px] text-gray-500 dark:text-[#999]">Words</span>
                            <span className="text-[13px] font-semibold text-gray-900 dark:text-white">
                                {note.wordCount || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[13px] text-gray-500 dark:text-[#999]">Characters</span>
                            <span className="text-[13px] font-semibold text-gray-900 dark:text-white">
                                {note.plainText?.length || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[13px] text-gray-500 dark:text-[#999]">Reading time</span>
                            <span className="text-[13px] font-semibold text-gray-900 dark:text-white">
                                {calculateReadingTime(note.plainText)} min
                            </span>
                        </div>
                    </div>
                </PropertyGroup>

                {/* Dates */}
                <PropertyGroup label="Created">
                    <div className="flex items-center gap-2.5 px-1 text-[13px] text-gray-500 dark:text-[#999]">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(note.createdAt)}</span>
                    </div>
                </PropertyGroup>

                <PropertyGroup label="Last Updated">
                    <div className="flex items-center gap-2.5 px-1 text-[13px] text-gray-500 dark:text-[#999]">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(note.updatedAt)}</span>
                    </div>
                </PropertyGroup>

                {/* AI Analytics */}
                <PropertyGroup label="AI Insights">
                    <div className="space-y-2.5">
                        <button
                            onClick={handleAISummarize}
                            disabled={isAILoading}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-purple-200 dark:border-[#333] bg-purple-50 dark:bg-transparent hover:bg-purple-100 dark:hover:bg-[#222] text-[13px] font-medium text-purple-700 dark:text-[#ddd] transition-all disabled:opacity-50"
                        >
                            <Sparkles className="w-[18px] h-[18px] text-purple-600 dark:text-[#c084fc]" />
                            <span>Generate Summary</span>
                        </button>

                        <button
                            onClick={handleAIExtractTasks}
                            disabled={isAILoading}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-blue-200 dark:border-[#333] bg-blue-50 dark:bg-transparent hover:bg-blue-100 dark:hover:bg-[#222] text-[13px] font-medium text-blue-700 dark:text-[#ddd] transition-all disabled:opacity-50"
                        >
                            <ListTodo className="w-[18px] h-[18px] text-blue-600 dark:text-[#60a5fa]" />
                            <span>Extract Tasks</span>
                        </button>

                        {aiSummary && (
                            <div className="mt-4 p-4 rounded-xl bg-purple-100 dark:bg-[#2d1b3d] border border-purple-200 dark:border-[#4a2e63]">
                                <h5 className="text-[11px] font-bold tracking-wider text-purple-800 dark:text-[#d8b4fe] uppercase mb-2">Summary</h5>
                                <p className="text-[13px] text-purple-900 dark:text-[#e9d5ff] leading-relaxed">
                                    {aiSummary}
                                </p>
                            </div>
                        )}

                        {aiTasks && (
                            <div className="mt-4 p-4 rounded-xl bg-blue-100 dark:bg-[#1e293b] border border-blue-200 dark:border-[#334155]">
                                <h5 className="text-[11px] font-bold tracking-wider text-blue-800 dark:text-[#93c5fd] uppercase mb-2">Action Items</h5>
                                <ul className="space-y-2">
                                    {aiTasks.map((task, idx) => (
                                        <li key={idx} className="text-[13px] text-blue-900 dark:text-[#bfdbfe] flex items-start gap-2">
                                            <span className="text-blue-600 dark:text-[#60a5fa] font-bold">•</span>
                                            <span className="leading-snug">{task}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </PropertyGroup>

                {/* Export */}
                <PropertyGroup label="Export">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleExport('pdf')}
                            className="flex items-center justify-center gap-2.5 px-4 py-3 text-[13px] font-semibold rounded-xl border border-gray-200 dark:border-[#333] bg-transparent hover:bg-gray-50 dark:hover:bg-[#222] text-gray-700 dark:text-[#ddd] transition-all"
                        >
                            <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span>PDF</span>
                        </button>
                        <button
                            onClick={() => handleExport('markdown')}
                            className="flex items-center justify-center gap-2.5 px-4 py-3 text-[13px] font-semibold rounded-xl border border-gray-200 dark:border-[#333] bg-transparent hover:bg-gray-50 dark:hover:bg-[#222] text-gray-700 dark:text-[#ddd] transition-all"
                        >
                            <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span>MD</span>
                        </button>
                        <button
                            onClick={() => handleExport('html')}
                            className="flex items-center justify-center gap-2.5 px-4 py-3 text-[13px] font-semibold rounded-xl border border-gray-200 dark:border-[#333] bg-transparent hover:bg-gray-50 dark:hover:bg-[#222] text-gray-700 dark:text-[#ddd] transition-all"
                        >
                            <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span>HTML</span>
                        </button>
                        <button
                            onClick={() => handleExport('txt')}
                            className="flex items-center justify-center gap-2.5 px-4 py-3 text-[13px] font-semibold rounded-xl border border-gray-200 dark:border-[#333] bg-transparent hover:bg-gray-50 dark:hover:bg-[#222] text-gray-700 dark:text-[#ddd] transition-all"
                        >
                            <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span>TXT</span>
                        </button>
                    </div>
                </PropertyGroup>

                {/* Version History */}
                <PropertyGroup label="History">
                    <button className="w-full flex items-center gap-2 px-4 py-3 text-[13px] font-medium rounded-lg border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-transparent hover:bg-gray-100 dark:hover:bg-[#222] text-gray-700 dark:text-[#ccc] transition-colors">
                        <History className="w-[18px] h-[18px]" />
                        <span>View Version History</span>
                        <span className="ml-auto text-[11px] text-gray-400 dark:text-[#777]">v{note.version || 1}</span>
                    </button>
                </PropertyGroup>

                {/* Visual padding at bottom */}
                <div className="h-4"></div>
            </div>
        </div>
    );
};

export default NotePropertiesPanel;
