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
    Plus
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
            <div className="w-80 bg-white dark:bg-[#191919] border-l border-gray-200 dark:border-[#333] flex items-center justify-center p-8 text-center">
                <div>
                    <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
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
                // Create a temporary div with the note content for printing
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
                            h1 {
                                font-size: 32px;
                                font-weight: bold;
                                margin-bottom: 20px;
                                color: #111;
                            }
                            p { margin: 12px 0; }
                            ul, ol { margin: 12px 0; padding-left: 24px; }
                            li { margin: 6px 0; }
                            strong { font-weight: 600; }
                            em { font-style: italic; }
                            code {
                                background: #f4f4f4;
                                padding: 2px 6px;
                                border-radius: 3px;
                                font-family: 'Courier New', monospace;
                            }
                            pre {
                                background: #f4f4f4;
                                padding: 12px;
                                border-radius: 6px;
                                overflow-x: auto;
                            }
                            blockquote {
                                border-left: 4px solid #ddd;
                                padding-left: 16px;
                                margin: 12px 0;
                                color: #666;
                            }
                            table {
                                border-collapse: collapse;
                                width: 100%;
                                margin: 12px 0;
                            }
                            td, th {
                                border: 1px solid #ddd;
                                padding: 8px;
                                text-align: left;
                            }
                            th {
                                background-color: #f4f4f4;
                                font-weight: 600;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>${title}</h1>
                        <div class="content">${htmlContent || `<p>${plainContent}</p>`}</div>
                    </body>
                    </html>
                `);
                printWindow.document.close();
                setTimeout(() => {
                    printWindow.print();
                }, 250);
                break;

            case 'markdown':
                // Convert HTML to Markdown (basic conversion)
                let mdContent = `# ${title}\n\n`;

                // Simple HTML to Markdown conversion
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlContent;

                // Get text content with basic formatting
                const textContent = tempDiv.innerText || plainContent;
                mdContent += textContent;

                downloadFile(mdContent, `${title}.md`, 'text/markdown');
                break;

            case 'html':
                const fullHtmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
            max-width: 900px;
            margin: 40px auto;
            padding: 40px;
            line-height: 1.6;
            color: #333;
            background-color: ${backgroundColor};
        }
        h1 {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 24px;
            color: #111;
        }
        p { margin: 12px 0; }
        ul, ol { margin: 12px 0; padding-left: 24px; }
        li { margin: 6px 0; }
        strong { font-weight: 600; }
        em { font-style: italic; }
        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
        }
        pre {
            background: #f4f4f4;
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 16px 0;
        }
        pre code {
            background: none;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid #ddd;
            padding-left: 16px;
            margin: 16px 0;
            color: #666;
            font-style: italic;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
        }
        td, th {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f4f4f4;
            font-weight: 600;
        }
        a {
            color: #0066cc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 16px 0;
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="content">
        ${htmlContent || `<p>${plainContent}</p>`}
    </div>
</body>
</html>`;
                downloadFile(fullHtmlContent, `${title}.html`, 'text/html');
                break;

            case 'txt':
                // Extract plain text from HTML
                const tempDiv2 = document.createElement('div');
                tempDiv2.innerHTML = htmlContent;
                const extractedText = tempDiv2.innerText || plainContent;

                const txtContent = `${title}\n${'='.repeat(title.length)}\n\n${extractedText}`;
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
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {label}
            </label>
            {children}
        </div>
    );

    return (
        <div className="w-80 bg-white dark:bg-[#191919] border-l border-gray-200 dark:border-[#333] flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-[#333] flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Properties</h3>
                <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-gray-500 dark:text-gray-400 transition-colors lg:hidden"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                {/* Color Picker */}
                <PropertyGroup label="Color">
                    <div className="relative">
                        <button
                            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors"
                        >
                            <div
                                className="w-6 h-6 rounded-md border border-gray-300 dark:border-gray-600"
                                style={{ backgroundColor: note.color || '#ffffff' }}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {note.color === '#ffffff' ? 'Default' : 'Custom'}
                            </span>
                            <Palette className="w-4 h-4 ml-auto text-gray-400" />
                        </button>

                        {isColorPickerOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-[#2d2d2d] rounded-xl shadow-lg border border-gray-200 dark:border-[#444] z-10">
                                <div className="grid grid-cols-4 gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => handleColorChange(color)}
                                            className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${note.color === color
                                                ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#2d2d2d]'
                                                : 'border-gray-200 dark:border-gray-600'
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
                    <div className="space-y-2">
                        {/* Existing tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {note.tags && note.tags.length > 0 ? (
                                note.tags.map((tag, idx) => {
                                    const tagName = typeof tag === 'object' ? tag.name : tag;
                                    return (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                        >
                                            <TagIcon className="w-3 h-3" />
                                            {tagName}
                                            <button
                                                onClick={() => handleRemoveTag(tagName)}
                                                className="ml-1 hover:text-blue-900 dark:hover:text-blue-200"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-gray-400 italic">No tags yet</p>
                            )}
                        </div>

                        {/* Add tag input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                placeholder="Add tag..."
                                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#444] bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleAddTag}
                                className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </PropertyGroup>

                {/* Template */}
                <PropertyGroup label="Template">
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
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#444] bg-white dark:bg-[#2d2d2d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                </PropertyGroup>

                {/* Statistics */}
                <PropertyGroup label="Statistics">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Words</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {note.wordCount || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Characters</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {note.plainText?.length || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Reading time</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {calculateReadingTime(note.plainText)} min
                            </span>
                        </div>
                    </div>
                </PropertyGroup>

                {/* Dates */}
                <PropertyGroup label="Created">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(note.createdAt)}</span>
                    </div>
                </PropertyGroup>

                <PropertyGroup label="Last Updated">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(note.updatedAt)}</span>
                    </div>
                </PropertyGroup>

                {/* AI Analytics */}
                <PropertyGroup label="AI Insights">
                    <div className="space-y-2">
                        <button
                            onClick={handleAISummarize}
                            disabled={isAILoading}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#2d2d2d] text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
                        >
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            <span>Generate Summary</span>
                        </button>

                        <button
                            onClick={handleAIExtractTasks}
                            disabled={isAILoading}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#2d2d2d] text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
                        >
                            <ListTodo className="w-4 h-4 text-blue-500" />
                            <span>Extract Tasks</span>
                        </button>

                        {aiSummary && (
                            <div className="mt-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                                <h5 className="text-xs font-semibold text-purple-900 dark:text-purple-300 mb-2">Summary</h5>
                                <p className="text-xs text-purple-700 dark:text-purple-400 leading-relaxed">
                                    {aiSummary}
                                </p>
                            </div>
                        )}

                        {aiTasks && (
                            <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                <h5 className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">Action Items</h5>
                                <ul className="space-y-1">
                                    {aiTasks.map((task, idx) => (
                                        <li key={idx} className="text-xs text-blue-700 dark:text-blue-400 flex items-start gap-2">
                                            <span className="text-blue-400">•</span>
                                            <span>{task}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </PropertyGroup>

                {/* Export */}
                <PropertyGroup label="Export">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => handleExport('pdf')}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#2d2d2d] text-gray-700 dark:text-gray-300 transition-colors"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span>PDF</span>
                        </button>
                        <button
                            onClick={() => handleExport('markdown')}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#2d2d2d] text-gray-700 dark:text-gray-300 transition-colors"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span>MD</span>
                        </button>
                        <button
                            onClick={() => handleExport('html')}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#2d2d2d] text-gray-700 dark:text-gray-300 transition-colors"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span>HTML</span>
                        </button>
                        <button
                            onClick={() => handleExport('txt')}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#2d2d2d] text-gray-700 dark:text-gray-300 transition-colors"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span>TXT</span>
                        </button>
                    </div>
                </PropertyGroup>

                {/* Version History */}
                <PropertyGroup label="History">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#2d2d2d] text-gray-700 dark:text-gray-300 transition-colors">
                        <History className="w-4 h-4" />
                        <span>View Version History</span>
                        <span className="ml-auto text-xs text-gray-400">v{note.version || 1}</span>
                    </button>
                </PropertyGroup>
            </div>
        </div>
    );
};

export default NotePropertiesPanel;
