import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent, BubbleMenu, ReactNodeViewRenderer } from '@tiptap/react';
import TaskItemNode from './TaskItemNode';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import { Extension } from '@tiptap/core';
import CharacterCount from '@tiptap/extension-character-count';

const CustomTableCell = TableCell.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            backgroundColor: {
                default: null,
                parseHTML: element => element.getAttribute('data-background-color'),
                renderHTML: attributes => {
                    return {
                        'data-background-color': attributes.backgroundColor,
                        style: attributes.backgroundColor ? `background-color: ${attributes.backgroundColor}` : null,
                    };
                },
            },
            verticalAlign: {
                default: null,
                parseHTML: element => element.getAttribute('data-vertical-align'),
                renderHTML: attributes => {
                    return {
                        'data-vertical-align': attributes.verticalAlign,
                        style: attributes.verticalAlign ? `vertical-align: ${attributes.verticalAlign}` : null,
                    };
                },
            },
        };
    },
});

const CustomTableRow = TableRow.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            height: {
                default: null,
                parseHTML: element => element.getAttribute('data-height'),
                renderHTML: attributes => {
                    return {
                        'data-height': attributes.height,
                        style: attributes.height ? `height: ${attributes.height}` : null,
                    };
                },
            },
        };
    },
});

const CustomTableHeader = TableHeader.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            backgroundColor: {
                default: null,
                parseHTML: element => element.getAttribute('data-background-color'),
                renderHTML: attributes => {
                    return {
                        'data-background-color': attributes.backgroundColor,
                        style: attributes.backgroundColor ? `background-color: ${attributes.backgroundColor}` : null,
                    };
                },
            },
            verticalAlign: {
                default: null,
                parseHTML: element => element.getAttribute('data-vertical-align'),
                renderHTML: attributes => {
                    return {
                        'data-vertical-align': attributes.verticalAlign,
                        style: attributes.verticalAlign ? `vertical-align: ${attributes.verticalAlign}` : null,
                    };
                },
            },
            // Add width attribute for column resizing
            colwidth: {
                default: null,
                parseHTML: element => {
                    const colwidth = element.getAttribute('colwidth');
                    const value = colwidth ? [parseInt(colwidth, 10)] : null;
                    return value;
                },
                renderHTML: attributes => {
                    return {
                        colwidth: attributes.colwidth,
                        style: attributes.colwidth ? `width: ${attributes.colwidth}px` : null,
                    };
                },
            },
        };
    },
});
import TableHeader from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TableOfContents from '@tiptap/extension-table-of-contents';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';

import FontFamily from '@tiptap/extension-font-family';
import Youtube from '@tiptap/extension-youtube';
import VideoExtension from './VideoExtension';
import { aiAPI } from '../api';

// Custom Font Size Extension
const FontSize = TextStyle.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            fontSize: {
                default: null,
                parseHTML: element => element.style.fontSize.replace('px', ''),
                renderHTML: attributes => {
                    if (!attributes.fontSize) {
                        return {};
                    }
                    return {
                        style: `font-size: ${attributes.fontSize}px`,
                    };
                },
            },
        };
    },
});
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
    List, ListOrdered, Quote, CheckSquare, Image as ImageIcon,
    Link as LinkIcon, Table as TableIcon, Minus, AlignLeft, AlignCenter, AlignRight,
    Plus, ChevronDown, MoreHorizontal, Highlighter, Type, Superscript as SuperscriptIcon,
    Subscript as SubscriptIcon, Indent, Outdent, X, Check,
    FilePlus, CheckCircle, Calendar, FileText, Grid, Paperclip, Book, Mic, Sigma, PenTool, CalendarDays, Clock, HardDrive,
    ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Trash2, Layout,
    AlignJustify, ArrowDownToLine, ArrowUpToLine, AlignVerticalJustifyCenter,
    Sparkles, CornerUpLeft, CornerUpRight, CheckCircle2,
    Code2, Quote as QuoteIcon, Minus as MinusIcon, Clapperboard, Globe,
    Maximize2, Minimize2, PanelLeftClose,
    ArrowUpRight
} from 'lucide-react';
import { getTemplateById } from '../constants/templates';

import CalendarModal from './CalendarModal';
import YoutubeModal from './YoutubeModal';
import AIMenu from './AIMenu';
import PageTemplatePicker from './PageTemplatePicker';
import '../styles/templates.css';

const MenuBar = ({ editor, onTemplateChange, currentTemplate, isZenMode, onToggleZenMode }) => {
    const [isInsertOpen, setIsInsertOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [isAILoading, setIsAILoading] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [isDemoMode, setIsDemoMode] = useState(true);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isFontFamilyOpen, setIsFontFamilyOpen] = useState(false);
    const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
    const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);

    const insertRef = useRef(null);
    const moreRef = useRef(null);
    const aiRef = useRef(null);
    const statusRef = useRef(null);
    const fontFamilyRef = useRef(null);
    const fontSizeRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (insertRef.current && !insertRef.current.contains(event.target)) setIsInsertOpen(false);
            if (moreRef.current && !moreRef.current.contains(event.target)) setIsMoreOpen(false);
            if (moreRef.current && !moreRef.current.contains(event.target)) setIsMoreOpen(false);
            if (aiRef.current && !aiRef.current.contains(event.target)) setIsAIOpen(false);
            if (statusRef.current && !statusRef.current.contains(event.target)) setIsStatusOpen(false);
            if (fontFamilyRef.current && !fontFamilyRef.current.contains(event.target)) setIsFontFamilyOpen(false);
            if (fontSizeRef.current && !fontSizeRef.current.contains(event.target)) setIsFontSizeOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const fileInputRef = useRef(null);
    const [uploadType, setUploadType] = useState(null); // 'image', 'attachment', 'drive', 'audio'

    const handleFileUpload = (type) => {
        setUploadType(type);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onFileSelected = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // In a real app, you would upload the file to a server here.
        // For this demo, we'll create a local object URL or just insert the filename.

        if (uploadType === 'image') {
            const url = URL.createObjectURL(file);
            editor.chain().focus().setImage({ src: url }).run();
        } else if (uploadType === 'video') {
            const url = URL.createObjectURL(file);
            editor.chain().focus().setVideo({ src: url }).run();
        } else if (uploadType === 'audio') {
            // Insert a placeholder for audio with the filename
            editor.chain().focus().insertContent(`[Audio: ${file.name}] `).run();
        } else if (uploadType === 'drive') {
            // Simulate Drive file insertion
            editor.chain().focus().insertContent(`[Google Drive File: ${file.name}] `).run();
        } else {
            // Generic attachment
            editor.chain().focus().insertContent(`[Attachment: ${file.name}] `).run();
        }

        // Reset
        event.target.value = '';
        setUploadType(null);
    };

    const handleAIAction = async (type, prompt = null) => {
        if (!editor) return;

        const { from, to, empty } = editor.state.selection;
        const text = empty ? editor.getText() : editor.state.doc.textBetween(from, to, ' ');

        if (!text && type !== 'continue' && type !== 'custom') {
            if (type === 'summarize') setAiError('Please write some text to summarize first.');
            else if (type === 'fix-spelling') setAiError('Please write some text to check grammar first.');
            else if (type === 'translate') setAiError('Please write some text to translate first.');
            else setAiError('Please select some text or write something first.');
            return;
        }

        const originalContent = text;

        setIsAILoading(true);
        setAiError(null);

        try {
            let result;

            if (isDemoMode) {
                // Simulate network delay for realism
                await new Promise(resolve => setTimeout(resolve, 1200));

                // Smarter mock responses based on content
                switch (type) {
                    case 'summarize':
                        // Create a simple summary by taking first few sentences
                        const sentences = originalContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
                        if (sentences.length > 2) {
                            result = `**Summary:** ${sentences.slice(0, 2).join('. ')}.`;
                        } else {
                            result = `**Summary:** ${originalContent.substring(0, 150)}${originalContent.length > 150 ? '...' : ''}`;
                        }
                        break;
                    case 'fix-spelling':
                        // Simple grammar fixes
                        result = originalContent
                            .replace(/\bteh\b/gi, 'the')
                            .replace(/\berrror\b/gi, 'error')
                            .replace(/\brecieve\b/gi, 'receive')
                            .replace(/\boccured\b/gi, 'occurred')
                            .replace(/\bseperate\b/gi, 'separate')
                            .replace(/\bi\b/g, 'I')
                            .replace(/([.!?])\s*([a-z])/g, (match, p1, p2) => p1 + ' ' + p2.toUpperCase());
                        // If no changes were made, add a note
                        if (result === originalContent) {
                            result = originalContent + '\n\n✓ No spelling or grammar errors detected (Demo Mode)';
                        }
                        break;
                    case 'translate':
                        // Simple word-by-word "translation" simulation
                        const wordCount = originalContent.split(/\s+/).length;
                        result = `[Traducción simulada]\n\n${originalContent.split(' ').map(word => {
                            // Simple mock translation
                            const translations = {
                                'hello': 'hola', 'world': 'mundo', 'the': 'el/la', 'is': 'es',
                                'and': 'y', 'to': 'a', 'of': 'de', 'in': 'en', 'for': 'para'
                            };
                            return translations[word.toLowerCase()] || word;
                        }).join(' ')}\n\n(Demo Mode - Simulated Spanish translation)`;
                        break;
                    case 'continue':
                        // Generate contextual continuation
                        const lastWords = originalContent.trim().split(/\s+/).slice(-5).join(' ');
                        result = ` Furthermore, building upon "${lastWords}", we can explore this topic in greater depth. The implications are significant and warrant further consideration. This demonstrates how AI can help extend your thoughts and ideas seamlessly.`;
                        break;
                    case 'custom':
                        // Intelligent custom response based on prompt
                        const lowerPrompt = prompt.toLowerCase();
                        if (lowerPrompt.includes('list') || lowerPrompt.includes('bullet')) {
                            result = `**Response to: "${prompt}"**\n\n• Point 1: First key item\n• Point 2: Second important aspect\n• Point 3: Additional consideration\n• Point 4: Final thought\n\n(Demo Mode - Simulated response)`;
                        } else if (lowerPrompt.includes('explain') || lowerPrompt.includes('what')) {
                            result = `**Explanation:**\n\nBased on your request "${prompt}", here's a simulated explanation. In Demo Mode, the AI provides contextual responses that demonstrate the functionality. This helps you understand how the feature works before using real API credits.\n\nKey points:\n- Demo responses are generated locally\n- No API calls are made\n- Responses are contextual to your prompt`;
                        } else if (lowerPrompt.includes('write') || lowerPrompt.includes('create')) {
                            result = `**Created Content:**\n\nThis is a simulated creative response to "${prompt}". In a real scenario, the AI would generate original content based on your specific requirements. Demo Mode allows you to test the interface and workflow without consuming API credits.\n\nThe actual AI would provide much more detailed and customized content.`;
                        } else {
                            result = `**Response to "${prompt}":**\n\n${originalContent ? `Analyzing your content: "${originalContent.substring(0, 50)}${originalContent.length > 50 ? '...' : ''}"\n\n` : ''}This is a simulated AI response in Demo Mode. The actual AI would provide a detailed, contextual answer to your specific request. Demo Mode is perfect for testing features without using API credits.`;
                        }
                        break;
                    default:
                        result = "Demo mode is active. This is a simulated AI response.";
                }
            } else {
                const response = await aiAPI.processContent({ type, content: originalContent, prompt });
                if (response.data.success) {
                    result = response.data.result;
                }
            }

            if (result) {
                if (empty) {
                    // If no selection, append result
                    editor.chain().focus().insertContent(`\n\n${result}`).run();
                } else {
                    // If selection exists
                    if (type === 'summarize') {
                        // For summarize, append the result AFTER the selection (or at the end of the block)
                        // To keep it simple and safe, we'll insert it after the current selection
                        const endPos = to;
                        editor.chain().focus().setTextSelection(endPos).insertContent(`\n\n**Summary:**\n${result}`).run();
                    } else {
                        // For other actions (fix spelling, translate), replace the selection
                        editor.chain().focus().insertContent(result).run();
                    }
                }
                setIsAIOpen(false); // Close menu on success
            }
        } catch (error) {
            console.error('AI Error:', error);

            let errorMessage = 'Failed to process AI request.';

            // Check for specific OpenAI error codes or status 429 (Too Many Requests / Quota Exceeded)
            const isQuotaError = error.status === 429 ||
                error.response?.status === 429 ||
                error.error?.code === 'insufficient_quota' ||
                error.response?.data?.error?.code === 'insufficient_quota';

            const isAuthError = error.status === 401 ||
                error.response?.status === 401 ||
                error.error?.code === 'invalid_api_key' ||
                error.response?.data?.error?.code === 'invalid_api_key';

            if (isQuotaError || isAuthError || !error.response) {
                // Auto-fallback to Demo Mode
                setIsDemoMode(true);
                setAiError(isQuotaError
                    ? "Quota exceeded! Switched to Demo Mode. Check your API key billing."
                    : "API Key issue! Switched to Demo Mode.");
            } else {
                errorMessage = error.response?.data?.error?.message || error.response?.data?.message || errorMessage;
                setAiError(errorMessage);
            }
        } finally {
            setIsAILoading(false);
        }
    };

    const insertTable = () => {
        editor.chain().focus().insertTable({ rows: 5, cols: 5, withHeaderRow: true }).run();
        // Insert a paragraph after the table to ensure we can type below it
        editor.chain().focus().createParagraphNear().run();
    };

    const handleCalendarInsert = (content) => {
        editor.chain().focus().insertContent(content).run();
    };

    const insertStatus = (status, color, bgColor) => {
        // Using a span with padding and background color to simulate a badge
        editor.chain().focus().insertContent(`<span style="background-color: ${bgColor}; color: ${color}; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: 500;">${status}</span>&nbsp;`).run();
        setIsStatusOpen(false);
    };

    return (
        <div className="no-print flex items-center justify-between px-5 py-2.5 border-b border-gray-200/60 dark:border-white/10 bg-gradient-to-r from-white via-gray-50/50 to-white dark:from-[#1a1a1a] dark:via-[#1e1e1e] dark:to-[#1a1a1a] backdrop-blur-xl sticky top-0 z-20 text-gray-700 dark:text-gray-300 font-sans transition-all duration-200 shadow-sm dark:shadow-none">

            {/* YouTube Modal */}
            <YoutubeModal
                isOpen={isYoutubeModalOpen}
                onClose={() => setIsYoutubeModalOpen(false)}
                onInsert={(url) => {
                    if (editor) {
                        editor.commands.setYoutubeVideo({ src: url });
                    }
                }}
            />
            <div className="flex items-center space-x-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileSelected}
                    className="hidden"
                    accept={uploadType === 'image' ? 'image/*' : uploadType === 'video' ? 'video/*' : uploadType === 'audio' ? 'audio/*' : '*/*'}
                />

                {/* Left Group: Insert, Status, History */}
                <div className="flex items-center space-x-1">
                    {/* Insert Menu */}
                    <div className="relative" ref={insertRef}>
                        <button
                            onClick={() => setIsInsertOpen(!isInsertOpen)}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${isInsertOpen ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/5'}`}
                        >
                            <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium">Insert</span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </button>

                        {isInsertOpen && (
                            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#1e1e1e] rounded-lg shadow-2xl border border-gray-200 dark:border-[#333] py-2 z-50 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Essentials</div>
                                <div className="px-2 space-y-0.5 mb-2">
                                    <button onClick={() => { editor.chain().focus().toggleTaskList().run(); setIsInsertOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                        <CheckSquare className="w-4 h-4 text-purple-500 dark:text-purple-400" /> <span>Task List</span>
                                    </button>
                                    <button onClick={() => { insertTable(); setIsInsertOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                        <TableIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" /> <span>Table</span>
                                    </button>
                                    <button onClick={() => { setLink(); setIsInsertOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                        <LinkIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> <span>Link</span>
                                    </button>
                                    <button onClick={() => { handleFileUpload('image'); setIsInsertOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                        <ImageIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> <span>Image</span>
                                    </button>
                                </div>

                                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">Media</div>
                                <div className="px-2 space-y-0.5 mb-2">
                                    <button onClick={() => { handleFileUpload('audio'); setIsInsertOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                        <Mic className="w-4 h-4 text-red-500 dark:text-red-400" /> <span>Audio</span>
                                    </button>
                                    <button onClick={() => { handleFileUpload('video'); setIsInsertOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                        <Clapperboard className="w-4 h-4 text-blue-500 dark:text-blue-400" /> <span>Upload Video</span>
                                    </button>
                                    <button onClick={() => {
                                        setIsYoutubeModalOpen(true);
                                        setIsInsertOpen(false);
                                    }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                        <Clapperboard className="w-4 h-4 text-pink-500 dark:text-pink-400" /> <span>YouTube</span>
                                    </button>
                                    <button onClick={() => { handleFileUpload('drive'); setIsInsertOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                        <HardDrive className="w-4 h-4 text-yellow-500 dark:text-yellow-400" /> <span>Google Drive</span>
                                    </button>
                                    <button onClick={() => { handleFileUpload('attachment'); setIsInsertOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                        <Paperclip className="w-4 h-4 text-gray-500 dark:text-gray-400" /> <span>Attachment</span>
                                    </button>
                                </div>

                                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">Formatting</div>
                                <div className="px-2 space-y-0.5 mb-2">
                                    <button onClick={() => { editor.chain().focus().toggleBlockquote().run(); setIsInsertOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                        <QuoteIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" /> <span>Quote</span>
                                    </button>
                                    <button onClick={() => { editor.chain().focus().toggleCodeBlock().run(); setIsInsertOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                        <Code2 className="w-4 h-4 text-gray-500 dark:text-gray-400" /> <span>Code Block</span>
                                    </button>
                                    <button onClick={() => { editor.chain().focus().setHorizontalRule().run(); setIsInsertOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                        <MinusIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" /> <span>Divider</span>
                                    </button>
                                </div>

                                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">Advanced</div>
                                <div className="px-2 space-y-0.5">
                                    <button onClick={() => {
                                        const date = new Date().toLocaleDateString();
                                        editor.chain().focus().insertContent(date).run();
                                        setIsInsertOpen(false);
                                    }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                        <CalendarDays className="w-4 h-4 text-orange-500 dark:text-orange-400" /> <span>Date</span>
                                    </button>
                                    <button onClick={() => {
                                        const time = new Date().toLocaleTimeString();
                                        editor.chain().focus().insertContent(time).run();
                                        setIsInsertOpen(false);
                                    }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                        <Clock className="w-4 h-4 text-teal-500 dark:text-teal-400" /> <span>Time</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>




                    <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200" title="Undo">
                        <CornerUpLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200" title="Redo">
                        <CornerUpRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-3" />

                {/* Center/Right Group: AI, Font, More */}
                {/* Center/Right Group: AI, Font, More */}
                <div className="flex items-center space-x-2">
                    {/* AI Menu */}
                    <div className="relative" ref={aiRef}>
                        <button
                            onClick={() => setIsAIOpen(!isAIOpen)}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${isAIOpen ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-200 dark:ring-indigo-800' : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10'}`}
                        >
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-semibold">AI</span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                        <AIMenu
                            isOpen={isAIOpen}
                            onClose={() => setIsAIOpen(false)}
                            onAction={handleAIAction}
                            isLoading={isAILoading}
                            error={aiError}
                            isDemoMode={isDemoMode}
                            onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
                            triggerRef={aiRef}
                        />
                    </div>

                    <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-3" />



                    <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-3" />



                    {/* Font Family */}
                    <div className="relative" ref={fontFamilyRef}>
                        <button
                            onClick={() => setIsFontFamilyOpen(!isFontFamilyOpen)}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${isFontFamilyOpen ? 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-200 shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/5'}`}
                        >
                            <span className="text-sm w-20 truncate text-left font-medium">
                                {editor.getAttributes('textStyle').fontFamily || 'Sans Serif'}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                        {isFontFamilyOpen && (
                            <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-200 dark:border-[#333] py-1 z-50">
                                <button onClick={() => { editor.chain().focus().setFontFamily('Inter').run(); setIsFontFamilyOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] font-sans">Inter</button>
                                <button onClick={() => { editor.chain().focus().setFontFamily('Arial').run(); setIsFontFamilyOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]" style={{ fontFamily: 'Arial' }}>Arial</button>
                                <button onClick={() => { editor.chain().focus().setFontFamily('Helvetica').run(); setIsFontFamilyOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]" style={{ fontFamily: 'Helvetica' }}>Helvetica</button>
                                <button onClick={() => { editor.chain().focus().setFontFamily('Times New Roman').run(); setIsFontFamilyOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</button>
                                <button onClick={() => { editor.chain().focus().setFontFamily('Garamond').run(); setIsFontFamilyOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]" style={{ fontFamily: 'Garamond' }}>Garamond</button>
                                <button onClick={() => { editor.chain().focus().setFontFamily('Georgia').run(); setIsFontFamilyOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]" style={{ fontFamily: 'Georgia' }}>Georgia</button>
                                <button onClick={() => { editor.chain().focus().setFontFamily('Courier New').run(); setIsFontFamilyOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]" style={{ fontFamily: 'Courier New' }}>Courier New</button>
                                <button onClick={() => { editor.chain().focus().setFontFamily('Verdana').run(); setIsFontFamilyOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]" style={{ fontFamily: 'Verdana' }}>Verdana</button>
                                <button onClick={() => { editor.chain().focus().setFontFamily('Tahoma').run(); setIsFontFamilyOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]" style={{ fontFamily: 'Tahoma' }}>Tahoma</button>
                                <button onClick={() => { editor.chain().focus().setFontFamily('Trebuchet MS').run(); setIsFontFamilyOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]" style={{ fontFamily: 'Trebuchet MS' }}>Trebuchet MS</button>
                                <button onClick={() => { editor.chain().focus().setFontFamily('Impact').run(); setIsFontFamilyOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]" style={{ fontFamily: 'Impact' }}>Impact</button>
                                <button onClick={() => { editor.chain().focus().setFontFamily('Comic Sans MS').run(); setIsFontFamilyOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]" style={{ fontFamily: 'Comic Sans MS' }}>Comic Sans MS</button>
                            </div>
                        )}
                    </div>

                    <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-3" />

                    {/* Zen Mode Toggle */}
                    <button
                        onClick={onToggleZenMode}
                        className={`p-2 rounded-lg transition-all duration-200 ${isZenMode ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
                    >
                        {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>

                    <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-3" />

                    {/* Font Size */}
                    <div className="relative" ref={fontSizeRef}>
                        <button
                            onClick={() => setIsFontSizeOpen(!isFontSizeOpen)}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${isFontSizeOpen ? 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-200 shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/5'}`}
                        >
                            <span className="text-sm w-8 text-center font-medium">
                                {editor.getAttributes('textStyle').fontSize || 'Auto'}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                        {isFontSizeOpen && (
                            <div className="absolute top-full left-0 mt-2 w-20 bg-white dark:bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-200 dark:border-[#333] py-1 z-50 max-h-48 overflow-y-auto custom-scrollbar">
                                {[12, 13, 14, 15, 16, 18, 20, 24, 30].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => {
                                            // Use the custom FontSize extension
                                            editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
                                            setIsFontSizeOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d]"
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-3" />

                    {/* More Menu */}
                    <div className="relative" ref={moreRef}>
                        <button
                            onClick={() => setIsMoreOpen(!isMoreOpen)}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${isMoreOpen ? 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-200 shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/5'}`}
                        >
                            <span className="text-sm font-medium">More</span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </button>

                        {isMoreOpen && (
                            <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-200 dark:border-[#333] py-2 z-50 max-h-[80vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                                {/* Font Color Picker */}
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-[#333]">
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center justify-between transition-colors group">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-5 h-5 rounded-full shadow-sm ring-1 ring-black/10 dark:ring-white/10" style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)' }}></div>
                                            <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Font color</span>
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                                    </button>

                                    {/* Color Palette */}
                                    <div className="mt-3 p-3 bg-gray-50 dark:bg-[#262626] rounded-xl border border-gray-200 dark:border-[#333]">
                                        <div className="grid grid-cols-7 gap-2 mb-2">
                                            <button onClick={() => editor.chain().focus().unsetColor().run()} className="w-6 h-6 rounded-full bg-white border border-gray-300 dark:border-gray-600 hover:scale-110 hover:border-gray-400 dark:hover:border-white transition-all shadow-sm" title="Auto"></button>
                                            <button onClick={() => editor.chain().focus().setColor('#9ca3af').run()} className="w-6 h-6 rounded-full bg-gray-400 hover:scale-110 transition-transform shadow-sm"></button>
                                            <button onClick={() => editor.chain().focus().setColor('#6b7280').run()} className="w-6 h-6 rounded-full bg-gray-500 hover:scale-110 transition-transform shadow-sm"></button>
                                            <button onClick={() => editor.chain().focus().setColor('#4b5563').run()} className="w-6 h-6 rounded-full bg-gray-600 hover:scale-110 transition-transform shadow-sm"></button>
                                            <button onClick={() => editor.chain().focus().setColor('#1f2937').run()} className="w-6 h-6 rounded-full bg-gray-800 hover:scale-110 transition-transform shadow-sm"></button>
                                            <button onClick={() => editor.chain().focus().setColor('#8b5cf6').run()} className="w-6 h-6 rounded-full bg-purple-500 hover:scale-110 transition-transform shadow-sm"></button>
                                            <button onClick={() => editor.chain().focus().setColor('#d946ef').run()} className="w-6 h-6 rounded-full bg-fuchsia-500 hover:scale-110 transition-transform shadow-sm"></button>
                                        </div>
                                        <div className="grid grid-cols-7 gap-2">
                                            <button onClick={() => editor.chain().focus().setColor('#ef4444').run()} className="w-6 h-6 rounded-full bg-red-500 hover:scale-110 transition-transform shadow-sm"></button>
                                            <button onClick={() => editor.chain().focus().setColor('#f97316').run()} className="w-6 h-6 rounded-full bg-orange-500 hover:scale-110 transition-transform shadow-sm"></button>
                                            <button onClick={() => editor.chain().focus().setColor('#eab308').run()} className="w-6 h-6 rounded-full bg-yellow-500 hover:scale-110 transition-transform shadow-sm"></button>
                                            <button onClick={() => editor.chain().focus().setColor('#22c55e').run()} className="w-6 h-6 rounded-full bg-green-500 hover:scale-110 transition-transform shadow-sm"></button>
                                            <button onClick={() => editor.chain().focus().setColor('#06b6d4').run()} className="w-6 h-6 rounded-full bg-cyan-500 hover:scale-110 transition-transform shadow-sm"></button>
                                            <button onClick={() => editor.chain().focus().setColor('#3b82f6').run()} className="w-6 h-6 rounded-full bg-blue-500 hover:scale-110 transition-transform shadow-sm"></button>
                                            <button onClick={() => editor.chain().focus().setColor('#6366f1').run()} className="w-6 h-6 rounded-full bg-indigo-500 hover:scale-110 transition-transform shadow-sm"></button>
                                        </div>
                                    </div>
                                </div>

                                {/* Highlight Section */}
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-[#333]">
                                    <div className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider px-1">Highlight</div>
                                    <div className="flex items-center justify-between px-1">
                                        <button onClick={() => editor.chain().focus().unsetHighlight().run()} className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#2d2d2d] hover:border-gray-400 transition-colors" title="None">
                                            <X className="w-3.5 h-3.5 text-gray-400" />
                                        </button>
                                        <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()} className="w-7 h-7 rounded-full bg-[#fef08a] border border-transparent hover:scale-110 transition-transform shadow-sm" title="Yellow"></button>
                                        <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#bbf7d0' }).run()} className="w-7 h-7 rounded-full bg-[#bbf7d0] border border-transparent hover:scale-110 transition-transform shadow-sm" title="Green"></button>
                                        <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#bfdbfe' }).run()} className="w-7 h-7 rounded-full bg-[#bfdbfe] border border-transparent hover:scale-110 transition-transform shadow-sm" title="Blue"></button>
                                        <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#fbcfe8' }).run()} className="w-7 h-7 rounded-full bg-[#fbcfe8] border border-transparent hover:scale-110 transition-transform shadow-sm" title="Pink"></button>
                                        <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#e9d5ff' }).run()} className="w-7 h-7 rounded-full bg-[#e9d5ff] border border-transparent hover:scale-110 transition-transform shadow-sm" title="Purple"></button>
                                    </div>
                                </div>

                                {/* Text Formatting */}
                                <div className="px-2 py-2 border-b border-gray-200 dark:border-[#333]">
                                    <div className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider px-3 pt-1">Format</div>
                                    <button onClick={() => editor.chain().focus().toggleBold().run()} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors ${editor.isActive('bold') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-[#2d2d2d]/50' : 'text-gray-700 dark:text-gray-300'}`}>
                                        <Bold className="w-4 h-4" /> <span className="font-medium">Bold</span>
                                    </button>
                                    <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors ${editor.isActive('italic') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-[#2d2d2d]/50' : 'text-gray-700 dark:text-gray-300'}`}>
                                        <Italic className="w-4 h-4" /> <span className="font-medium">Italic</span>
                                    </button>
                                    <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors ${editor.isActive('underline') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-[#2d2d2d]/50' : 'text-gray-700 dark:text-gray-300'}`}>
                                        <UnderlineIcon className="w-4 h-4" /> <span className="font-medium">Underline</span>
                                    </button>
                                    <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors ${editor.isActive('strike') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-[#2d2d2d]/50' : 'text-gray-700 dark:text-gray-300'}`}>
                                        <Strikethrough className="w-4 h-4" /> <span className="font-medium">Strikethrough</span>
                                    </button>
                                </div>

                                {/* Lists */}
                                <div className="px-2 py-2 border-b border-gray-200 dark:border-[#333]">
                                    <div className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider px-3 pt-1">Lists</div>
                                    <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors ${editor.isActive('bulletList') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-[#2d2d2d]/50' : 'text-gray-700 dark:text-gray-300'}`}>
                                        <List className="w-4 h-4" /> <span className="font-medium">Bulleted list</span>
                                    </button>
                                    <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors ${editor.isActive('orderedList') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-[#2d2d2d]/50' : 'text-gray-700 dark:text-gray-300'}`}>
                                        <ListOrdered className="w-4 h-4" /> <span className="font-medium">Numbered list</span>
                                    </button>
                                    <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors ${editor.isActive('taskList') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-[#2d2d2d]/50' : 'text-gray-700 dark:text-gray-300'}`}>
                                        <CheckSquare className="w-4 h-4" /> <span className="font-medium">Checklist</span>
                                    </button>
                                </div>

                                {/* Insert Link */}
                                <div className="px-2 py-2 border-b border-gray-200 dark:border-[#333]">
                                    <button onClick={setLink} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors group">
                                        <LinkIcon className="w-4 h-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" /> <span className="font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Insert link</span>
                                    </button>
                                </div>

                                {/* Alignment */}
                                <div className="px-2 py-2 border-b border-gray-200 dark:border-[#333]">
                                    <div className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider px-3 pt-1">Align</div>
                                    <div className="flex items-center justify-between px-1">
                                        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-[#2d2d2d]/50' : 'text-gray-500 dark:text-gray-400'}`} title="Left Align">
                                            <AlignLeft className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-[#2d2d2d]/50' : 'text-gray-500 dark:text-gray-400'}`} title="Align Center">
                                            <AlignCenter className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-[#2d2d2d]/50' : 'text-gray-500 dark:text-gray-400'}`} title="Align Right">
                                            <AlignRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Indent/Outdent */}
                                <div className="px-2 py-2 border-b border-gray-200 dark:border-[#333]">
                                    <div className="flex items-center justify-between px-1">
                                        <button onClick={() => editor.chain().focus().sinkListItem('listItem').run()} disabled={!editor.can().sinkListItem('listItem')} className="flex-1 text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center justify-center space-x-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                            <Indent className="w-4 h-4" /> <span>Indent</span>
                                        </button>
                                        <div className="w-px h-4 bg-gray-300 dark:bg-[#333] mx-1"></div>
                                        <button onClick={() => editor.chain().focus().liftListItem('listItem').run()} disabled={!editor.can().liftListItem('listItem')} className="flex-1 text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center justify-center space-x-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                            <Outdent className="w-4 h-4" /> <span>Outdent</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Advanced Formatting */}
                                <div className="px-2 py-2 border-b border-gray-200 dark:border-[#333]">
                                    <div className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider px-3 pt-1">Advanced</div>
                                    <button onClick={() => editor.chain().focus().toggleSuperscript().run()} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors ${editor.isActive('superscript') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-[#2d2d2d]/50' : 'text-gray-700 dark:text-gray-300'}`}>
                                        <SuperscriptIcon className="w-4 h-4" /> <span className="font-medium">Superscript</span>
                                    </button>
                                    <button onClick={() => editor.chain().focus().toggleSubscript().run()} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 transition-colors ${editor.isActive('subscript') ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-[#2d2d2d]/50' : 'text-gray-700 dark:text-gray-300'}`}>
                                        <SubscriptIcon className="w-4 h-4" /> <span className="font-medium">Subscript</span>
                                    </button>
                                </div>

                                {/* Formatting Utilities */}
                                <div className="px-2 py-2">
                                    <button onClick={() => { editor.chain().focus().clearNodes().run(); editor.chain().focus().unsetAllMarks().run(); }} className="w-full text-left px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                                        <Type className="w-4 h-4" /> <span>Simplify formatting</span>
                                    </button>
                                    <button onClick={() => editor.chain().focus().unsetAllMarks().run()} className="w-full text-left px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg flex items-center space-x-3 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                                        <X className="w-4 h-4" /> <span>Remove formatting</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TextBubbleMenuContent = ({ editor }) => {
    if (!editor) return null;

    return (
        <div className="flex items-center bg-white dark:bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-200 dark:border-[#333] p-1">
            <div className="flex items-center space-x-0.5">
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#2d2d2d] ${editor.isActive('bold') ? 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-[#2d2d2d]' : 'text-gray-700 dark:text-gray-300'}`}>
                    <Bold className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#2d2d2d] ${editor.isActive('italic') ? 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-[#2d2d2d]' : 'text-gray-700 dark:text-gray-300'}`}>
                    <Italic className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#2d2d2d] ${editor.isActive('underline') ? 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-[#2d2d2d]' : 'text-gray-700 dark:text-gray-300'}`}>
                    <UnderlineIcon className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#2d2d2d] ${editor.isActive('strike') ? 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-[#2d2d2d]' : 'text-gray-700 dark:text-gray-300'}`}>
                    <Strikethrough className="w-4 h-4" />
                </button>
                <button onClick={() => editor.chain().focus().toggleCode().run()} className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#2d2d2d] ${editor.isActive('code') ? 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-[#2d2d2d]' : 'text-gray-700 dark:text-gray-300'}`}>
                    <Code className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-gray-300 dark:bg-[#333] mx-1" />

                <button onClick={() => editor.chain().focus().setColor('#ef4444').run()} className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#2d2d2d] ${editor.isActive('textStyle', { color: '#ef4444' }) ? 'bg-gray-100 dark:bg-[#2d2d2d]' : ''}`}>
                    <div className="w-4 h-4 rounded-full bg-red-500 border border-gray-300 dark:border-gray-600" />
                </button>
                <button onClick={() => editor.chain().focus().setColor('#3b82f6').run()} className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#2d2d2d] ${editor.isActive('textStyle', { color: '#3b82f6' }) ? 'bg-gray-100 dark:bg-[#2d2d2d]' : ''}`}>
                    <div className="w-4 h-4 rounded-full bg-blue-500 border border-gray-300 dark:border-gray-600" />
                </button>
                <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()} className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#2d2d2d] ${editor.isActive('highlight', { color: '#fef08a' }) ? 'bg-gray-100 dark:bg-[#2d2d2d]' : ''}`}>
                    <Highlighter className="w-4 h-4 text-yellow-600 dark:text-yellow-200" />
                </button>
            </div>
        </div>
    );
};

const TableBubbleMenuContent = ({ editor }) => {
    const [colorMode, setColorMode] = useState('cell'); // 'cell' or 'text'

    if (!editor) return null;

    return (
        <div className="flex flex-col bg-white dark:bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-200">
            {/* Insert Section (User Requested) */}
            <div className="p-1 grid grid-cols-4 gap-1">
                <button onClick={() => editor.chain().focus().addColumnBefore().run()} className="p-1 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex justify-center items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200" title="Add Column Before">
                    <div className="flex"><ArrowLeft className="w-3 h-3" /><Plus className="w-2 h-2 -ml-1" /></div>
                </button>
                <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="p-1 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex justify-center items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200" title="Add Column After">
                    <div className="flex"><Plus className="w-2 h-2 -mr-1" /><ArrowRight className="w-3 h-3" /></div>
                </button>
                <button onClick={() => editor.chain().focus().addRowBefore().run()} className="p-1 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex justify-center items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200" title="Add Row Before">
                    <div className="flex flex-col"><Plus className="w-2 h-2 -mb-1" /><ArrowUp className="w-3 h-3" /></div>
                </button>
                <button onClick={() => editor.chain().focus().addRowAfter().run()} className="p-1 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex justify-center items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200" title="Add Row After">
                    <div className="flex flex-col"><ArrowDown className="w-3 h-3" /><Plus className="w-2 h-2 -mt-1" /></div>
                </button>
            </div>

            <div className="h-px bg-gray-200 dark:bg-[#333] my-1" />

            {/* Color Section */}
            <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-bold text-gray-500 dark:text-[#888] uppercase tracking-wider">Color</div>
                    <div className="flex bg-gray-100 dark:bg-[#2d2d2d] rounded p-0.5">
                        <button
                            onClick={() => setColorMode('cell')}
                            className={`px-2 py-0.5 text-[10px] rounded ${colorMode === 'cell' ? 'bg-white dark:bg-[#4b5563] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        >
                            Cell
                        </button>
                        <button
                            onClick={() => setColorMode('text')}
                            className={`px-2 py-0.5 text-[10px] rounded ${colorMode === 'text' ? 'bg-white dark:bg-[#4b5563] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        >
                            Text
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                    <button
                        onClick={() => {
                            if (colorMode === 'cell') {
                                editor.chain().focus().setCellAttribute('backgroundColor', null).run();
                            } else {
                                editor.chain().focus().unsetColor().run();
                            }
                        }}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center hover:opacity-80 transition-all ${(colorMode === 'cell' && editor.getAttributes('tableCell').backgroundColor === null) ||
                            (colorMode === 'text' && !editor.getAttributes('textStyle').color)
                            ? 'border-blue-500 ring-1 ring-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}
                        title="No Color"
                    >
                        <div className="w-5 h-5 rounded-full border border-gray-400 dark:border-gray-500 relative bg-white dark:bg-[#1e1e1e]">
                            <div className="absolute inset-0 bg-red-500 w-[1px] h-full left-1/2 transform -translate-x-1/2 rotate-45"></div>
                        </div>
                    </button>
                    {[
                        '#f3f4f6', '#d1d5db', '#9ca3af', '#4b5563', '#1f2937', '#000000',
                        '#fca5a5', '#fdba74', '#fcd34d', '#86efac', '#93c5fd', '#c4b5fd', '#f0abfc',
                        '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#d946ef'
                    ].map((color) => (
                        <button
                            key={color}
                            onClick={() => {
                                if (colorMode === 'cell') {
                                    editor.chain().focus().setCellAttribute('backgroundColor', color).run();
                                } else {
                                    editor.chain().focus().setColor(color).run();
                                }
                            }}
                            className={`w-6 h-6 rounded-full border border-transparent hover:scale-110 transition-transform ${(colorMode === 'cell' && editor.getAttributes('tableCell').backgroundColor === color) ||
                                (colorMode === 'text' && editor.getAttributes('textStyle').color === color)
                                ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-white dark:ring-offset-[#1e1e1e]'
                                : ''
                                }`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-[#333] my-1" />

            {/* Table Width */}
            <div className="py-1">
                <button onClick={() => editor.chain().focus().updateTable({ style: 'width: 100%' }).run()} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <span>Set To Note Width</span>
                </button>
                <button onClick={() => editor.chain().focus().updateTable({ style: 'min-width: 100%' }).run()} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <span>Set To Window Width</span>
                </button>
            </div>

            <div className="h-px bg-gray-200 dark:bg-[#333] my-1" />

            {/* Cell Alignment */}
            <div className="p-2 pb-1">
                <div className="text-[10px] font-bold text-gray-500 dark:text-[#888] uppercase tracking-wider mb-2">Cell Alignment & Row Height</div>

                {/* Horizontal Alignment */}
                <div className="flex items-center space-x-1 mb-2 bg-gray-100 dark:bg-[#2d2d2d] p-1 rounded">
                    <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`flex-1 p-1 rounded flex justify-center items-center hover:bg-white dark:hover:bg-[#3d3d3d] ${editor.isActive({ textAlign: 'left' }) ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-[#3d3d3d] shadow-sm' : 'text-gray-500 dark:text-gray-400'}`} title="Align Left">
                        <AlignLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`flex-1 p-1 rounded flex justify-center items-center hover:bg-white dark:hover:bg-[#3d3d3d] ${editor.isActive({ textAlign: 'center' }) ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-[#3d3d3d] shadow-sm' : 'text-gray-500 dark:text-gray-400'}`} title="Align Center">
                        <AlignCenter className="w-4 h-4" />
                    </button>
                    <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`flex-1 p-1 rounded flex justify-center items-center hover:bg-white dark:hover:bg-[#3d3d3d] ${editor.isActive({ textAlign: 'right' }) ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-[#3d3d3d] shadow-sm' : 'text-gray-500 dark:text-gray-400'}`} title="Align Right">
                        <AlignRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Vertical Alignment */}
                <div className="space-y-0.5 mb-2">
                    <button onClick={() => editor.chain().focus().setCellAttribute('verticalAlign', 'top').run()} className="w-full text-left px-1 py-1 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center text-gray-700 dark:text-gray-300 group">
                        <div className={`w-4 h-4 mr-2 flex items-center justify-center`}>
                            {(editor.getAttributes('tableCell').verticalAlign === 'top' || editor.getAttributes('tableHeader').verticalAlign === 'top') && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                        </div>
                        <span className={(editor.getAttributes('tableCell').verticalAlign === 'top' || editor.getAttributes('tableHeader').verticalAlign === 'top') ? 'text-blue-600 dark:text-blue-400' : ''}>Align content to top</span>
                    </button>
                    <button onClick={() => editor.chain().focus().setCellAttribute('verticalAlign', 'middle').run()} className="w-full text-left px-1 py-1 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center text-gray-700 dark:text-gray-300 group">
                        <div className={`w-4 h-4 mr-2 flex items-center justify-center`}>
                            {((editor.getAttributes('tableCell').verticalAlign === 'middle' || editor.getAttributes('tableHeader').verticalAlign === 'middle') || (!editor.getAttributes('tableCell').verticalAlign && !editor.getAttributes('tableHeader').verticalAlign)) && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                        </div>
                        <span className={((editor.getAttributes('tableCell').verticalAlign === 'middle' || editor.getAttributes('tableHeader').verticalAlign === 'middle') || (!editor.getAttributes('tableCell').verticalAlign && !editor.getAttributes('tableHeader').verticalAlign)) ? 'text-blue-600 dark:text-blue-400' : ''}>Align content to center</span>
                    </button>
                    <button onClick={() => editor.chain().focus().setCellAttribute('verticalAlign', 'bottom').run()} className="w-full text-left px-1 py-1 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center text-gray-700 dark:text-gray-300 group">
                        <div className={`w-4 h-4 mr-2 flex items-center justify-center`}>
                            {(editor.getAttributes('tableCell').verticalAlign === 'bottom' || editor.getAttributes('tableHeader').verticalAlign === 'bottom') && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                        </div>
                        <span className={(editor.getAttributes('tableCell').verticalAlign === 'bottom' || editor.getAttributes('tableHeader').verticalAlign === 'bottom') ? 'text-blue-600 dark:text-blue-400' : ''}>Align content to bottom</span>
                    </button>
                </div>

                {/* Row Height */}
                <div className="grid grid-cols-3 gap-1">
                    <button onClick={() => editor.chain().focus().setNodeSelection(editor.state.selection.$anchor.pos).command(({ tr }) => {
                        const { $from } = tr.selection;
                        const row = $from.node($from.depth - 1); // Get row node
                        if (row && row.type.name === 'tableRow') {
                            tr.setNodeMarkup($from.before($from.depth - 1), null, { ...row.attrs, height: null });
                            return true;
                        }
                        return false;
                    }).run()} className="px-1 py-1 text-xs bg-gray-100 dark:bg-[#2d2d2d] hover:bg-gray-200 dark:hover:bg-[#3d3d3d] rounded text-center text-gray-700 dark:text-gray-300">Auto</button>
                    <button onClick={() => editor.chain().focus().setNodeSelection(editor.state.selection.$anchor.pos).command(({ tr }) => {
                        const { $from } = tr.selection;
                        const row = $from.node($from.depth - 1);
                        if (row && row.type.name === 'tableRow') {
                            tr.setNodeMarkup($from.before($from.depth - 1), null, { ...row.attrs, height: '40px' });
                            return true;
                        }
                        return false;
                    }).run()} className="px-1 py-1 text-xs bg-gray-100 dark:bg-[#2d2d2d] hover:bg-gray-200 dark:hover:bg-[#3d3d3d] rounded text-center text-gray-700 dark:text-gray-300">Compact</button>
                    <button onClick={() => editor.chain().focus().setNodeSelection(editor.state.selection.$anchor.pos).command(({ tr }) => {
                        const { $from } = tr.selection;
                        const row = $from.node($from.depth - 1);
                        if (row && row.type.name === 'tableRow') {
                            tr.setNodeMarkup($from.before($from.depth - 1), null, { ...row.attrs, height: '60px' });
                            return true;
                        }
                        return false;
                    }).run()} className="px-1 py-1 text-xs bg-gray-100 dark:bg-[#2d2d2d] hover:bg-gray-200 dark:hover:bg-[#3d3d3d] rounded text-center text-gray-700 dark:text-gray-300">Tall</button>
                </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-[#333] my-1" />

            {/* Delete Actions */}
            <div className="py-1">
                <button onClick={() => editor.chain().focus().deleteColumn().run()} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <span>Delete Selected Column(s)</span>
                </button>
                <button onClick={() => editor.chain().focus().deleteRow().run()} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <span>Delete Selected Row(s)</span>
                </button>
                <button onClick={() => editor.chain().focus().deleteTable().run()} className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <span>Delete Table</span>
                </button>
            </div>
        </div>
    );
};
const RichTextEditor = ({ content, onChange, editable = true, template = 'blank', onTemplateChange, isZenMode, onToggleZenMode, isSaving }) => {
    const [currentTemplate, setCurrentTemplate] = useState(template);

    useEffect(() => {
        setCurrentTemplate(template);
    }, [template]);

    // Get template metadata
    const templateData = getTemplateById(currentTemplate);
    const lineHeight = templateData?.lineHeight || 28; // Default line height
    const fontSize = templateData?.lineHeight ? Math.floor(templateData.lineHeight * 0.65) : 16;
    // Adjust padding to align first line with the grid
    // For 24px lines, we need to start exactly at a multiple.
    // Usually 1 line height + some offset.
    const paddingTop = templateData?.lineHeight ? templateData.lineHeight + 6 : 32;

    // Custom Tab Extension
    const TabExtension = Extension.create({
        name: 'tabHandler',
        addKeyboardShortcuts() {
            return {
                Tab: () => {
                    // If in a list, let the list extension handle it (indent/outdent)
                    if (this.editor.isActive('listItem')) {
                        return false;
                    }
                    // Otherwise insert 4 spaces
                    this.editor.commands.insertContent('&nbsp;&nbsp;&nbsp;&nbsp;');
                    return true;
                },
            };
        },
    });

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            CharacterCount,
            Placeholder.configure({
                placeholder: 'Start writing...',
            }),
            Typography,
            TaskList,
            TaskItem.configure({
                nested: true,
            }).extend({
                addNodeView() {
                    return ReactNodeViewRenderer(TaskItemNode);
                },
            }),
            Link.configure({
                openOnClick: false,
            }),
            Image,
            Table.configure({
                resizable: true,
            }),
            CustomTableRow,
            CustomTableHeader,
            CustomTableCell,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            FontSize,
            FontFamily,
            Color,
            Highlight.configure({ multicolor: true }),
            Subscript,
            Superscript,
            TableOfContents,
            Youtube.configure({
                controls: false,
            }),
            VideoExtension,
            BubbleMenuExtension.configure({
                pluginKey: 'tableBubbleMenu',
                shouldShow: ({ editor }) => editor.isActive('table'),
            }),
            BubbleMenuExtension.configure({
                pluginKey: 'textBubbleMenu',
                shouldShow: ({ editor, state }) => !editor.isActive('table') && !state.selection.empty,
            }),
            TabExtension, // Add custom tab handler
        ],
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: `prose dark:prose-invert max-w-none focus:outline-none min-h-[1100px] text-gray-800 dark:text-gray-100 ${isZenMode ? 'prose-lg' : ''}`,
                style: `line-height: ${lineHeight}px; font-size: ${fontSize}px; padding-top: ${paddingTop}px;`
            },
        },
    }, [currentTemplate, isZenMode]);

    useEffect(() => {
        if (editor && content !== undefined) {
            // Only update if content has actually changed to avoid cursor jumping
            if (editor.getHTML() !== content) {
                // If content is empty string and editor is empty (just <p></p>), don't update
                if (content === '' && editor.getText() === '') return;

                // Preserve selection if possible, though specific to use case
                // For now, straightforward update
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    const handleTemplateChange = (templateId) => {
        setCurrentTemplate(templateId);
        if (onTemplateChange) {
            onTemplateChange(templateId);
        }
    };

    const isCustomTemplate = currentTemplate?.startsWith('http');

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#191919]">
            {editable && <MenuBar editor={editor} onTemplateChange={handleTemplateChange} currentTemplate={currentTemplate} isZenMode={isZenMode} onToggleZenMode={onToggleZenMode} />}
            {editable && (
                <BubbleMenu
                    editor={editor}
                    tippyOptions={{ duration: 100, placement: 'bottom-start', offset: [0, 10] }}
                    shouldShow={({ editor }) => editor.isActive('table')}
                    className="bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-200 rounded-lg shadow-2xl border border-gray-200 dark:border-[#333] p-1 w-64 font-sans max-h-[300px] overflow-y-auto custom-scrollbar"
                >
                    <TableBubbleMenuContent editor={editor} />
                </BubbleMenu>
            )}
            {editable && (
                <BubbleMenu
                    editor={editor}
                    tippyOptions={{ duration: 100, placement: 'top' }}
                    shouldShow={({ editor, state }) => !editor.isActive('table') && !state.selection.empty}
                    className="bg-transparent"
                >
                    <TextBubbleMenuContent editor={editor} />
                </BubbleMenu>
            )}
            <div className={`flex-1 overflow-y-auto custom-scrollbar template-container ${!isCustomTemplate ? `template-${currentTemplate}` : ''} bg-gray-50 dark:bg-[#0d0d0d]`}>
                {/* Editor page with shadow effect */}
                <div className="min-h-full flex justify-center pt-8 pb-32 px-4">
                    <div
                        className="w-full max-w-5xl bg-white dark:bg-[#1a1a1a] shadow-2xl rounded-xl overflow-hidden border border-gray-100 dark:border-[#333] transition-colors duration-300"
                        style={isCustomTemplate ? {
                            backgroundImage: `url(${currentTemplate})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        } : {}}
                    >
                        {/* Comfortable padding for writing */}
                        <div className="px-12 py-8 pb-24 min-h-[1050px]">
                            <EditorContent editor={editor} />
                        </div>

                        {/* Page Footer with Word Count */}
                        <div className="sticky bottom-0 z-10 bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-sm px-8 py-4 border-t border-gray-100 dark:border-[#333] flex justify-between items-center text-xs text-gray-400 font-sans select-none">
                            <div>Page 1</div>
                            <div className="flex items-center space-x-4">
                                <span>{editor.storage.characterCount.words()} words</span>
                                <span>{editor.storage.characterCount.characters()} characters</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                {isSaving ? (
                                    <span className="flex items-center text-gray-400">
                                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                                        Saving...
                                    </span>
                                ) : (
                                    <span className="flex items-center text-gray-400">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                        Saved
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Custom Styles for Task List */}
            <style>{`
                ul[data-type="taskList"] {
                    list-style: none;
                    padding: 0;
                }
                ul[data-type="taskList"] li {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                }
                ul[data-type="taskList"] li > label {
                    flex: 0 0 auto;
                    margin-right: 0.5rem;
                    user-select: none;
                }
                ul[data-type="taskList"] li > div {
                    flex: 1 1 auto;
                }
                ul[data-type="taskList"] input[type="checkbox"] {
                    cursor: pointer;
                    width: 1.2em;
                    height: 1.2em;
                    border-radius: 4px;
                    border: 2px solid #cbd5e1;
                    appearance: none;
                    background-color: white;
                    display: grid;
                    place-content: center;
                }
                ul[data-type="taskList"] input[type="checkbox"]::before {
                    content: "";
                    width: 0.65em;
                    height: 0.65em;
                    transform: scale(0);
                    transition: 120ms transform ease-in-out;
                    box-shadow: inset 1em 1em #3b82f6;
                    transform-origin: center;
                    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                }
                ul[data-type="taskList"] input[type="checkbox"]:checked::before {
                    transform: scale(1);
                }
                .dark ul[data-type="taskList"] input[type="checkbox"] {
                    background-color: #2d2d2d;
                    border-color: #4b5563;
                }

                /* Table Styles */
                .ProseMirror table {
                    border-collapse: collapse;
                    table-layout: fixed;
                    width: 100%;
                    margin-bottom: 15px;
                    margin-top: 15px;
                    overflow: visible;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .ProseMirror td,
                .ProseMirror th {
                    min-width: 1em;
                    border: 1px solid #e5e7eb;
                    padding: 10px 14px;
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;
                    background-color: transparent;
                }
                .ProseMirror th {
                    font-weight: 600;
                    text-align: left;
                    background-color: #f9fafb;
                    color: #374151;
                }
                .ProseMirror .selectedCell:after {
                    z-index: 2;
                    position: absolute;
                    content: "";
                    left: 0; right: 0; top: 0; bottom: 0;
                    background: rgba(59, 130, 246, 0.1);
                    pointer-events: none;
                    border: 1px solid #3b82f6;
                }
                .ProseMirror .column-resize-handle {
                    position: absolute;
                    right: -2px;
                    top: 0;
                    bottom: -2px;
                    width: 4px;
                    background-color: #3b82f6;
                    z-index: 20;
                    cursor: col-resize;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .ProseMirror th:hover .column-resize-handle,
                .ProseMirror td:hover .column-resize-handle {
                    opacity: 1;
                }
                
                /* Dark Mode Table Styles */
                .dark .ProseMirror table {
                    border: 1px solid #4b5563;
                }
                .dark .ProseMirror td,
                .dark .ProseMirror th {
                    border-color: #4b5563;
                    color: #e5e7eb;
                }
                .dark .ProseMirror th {
                    background-color: #262626;
                    color: #fff;
                    font-weight: 700;
                }
                .dark .ProseMirror td {
                    background-color: #1e1e1e;
                }

                /* List Styles */
                .ProseMirror ul {
                    list-style-type: disc;
                    padding-left: 1.5em;
                    margin: 1em 0;
                }
                .ProseMirror ol {
                    list-style-type: decimal;
                    padding-left: 1.5em;
                    margin: 1em 0;
                }
                .ProseMirror li {
                    margin-bottom: 0.5em;
                }
                /* Ensure nested lists look correct */
                .ProseMirror ul ul, .ProseMirror ol ul {
                    list-style-type: circle;
                }
                .ProseMirror ol ol, .ProseMirror ul ol {
                    list-style-type: lower-alpha;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
