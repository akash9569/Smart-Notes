import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import TaskItemNode from './TaskItemNode';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Extension, Node, mergeAttributes } from '@tiptap/core';
import CharacterCount from '@tiptap/extension-character-count';
import { useSettings } from '../context/SettingsContext';

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
// import TableHeader from '@tiptap/extension-table-header';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
// import Subscript from '@tiptap/extension-subscript';
// import Superscript from '@tiptap/extension-superscript';
// import TableOfContents from '@tiptap/extension-table-of-contents';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';

import FontFamily from '@tiptap/extension-font-family';
import Youtube from '@tiptap/extension-youtube';
import VideoExtension from './VideoExtension';
import { aiAPI } from '../api';

const CalloutBlock = Node.create({
    name: 'calloutBlock',
    group: 'block',
    content: 'inline*',
    addAttributes() {
        return {
            bg: { default: '#fef9c3' },
            color: { default: '#854d0e' },
            label: { default: 'Tip' }
        };
    },
    parseHTML() {
        return [{ tag: 'div[data-type="callout"]' }];
    },
    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, {
            'data-type': 'callout',
            style: `background-color: ${HTMLAttributes.bg}; border-left: 4px solid ${HTMLAttributes.color}; padding: 12px 16px; border-radius: 8px; margin: 8px 0; font-size: 14px; color: ${HTMLAttributes.color};`
        }), ['strong', {}, HTMLAttributes.label + ': '], ['span', 0]];
    }
});

// Custom Font Size Extension - extends TextStyle and keeps marks on node splits/enters
const FontSize = TextStyle.extend({
    keepOnSplit: true,
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
import PrintPreviewModal from './PrintPreviewModal';

const MenuBar = ({ editor, onTemplateChange, currentTemplate, isZenMode, onToggleZenMode, noteTitle }) => {
    const [isInsertOpen, setIsInsertOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
    const [moreMenuPos, setMoreMenuPos] = useState({ top: 0, right: 0 });
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
    // Track active text color for persistent coloring across typing
    const [activeColor, setActiveColor] = useState(null);

    // Link modal state
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');

    // Image URL modal state
    const [isImageUrlModalOpen, setIsImageUrlModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

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

    // Persist active color: whenever cursor moves into text without a color mark, re-apply stored color
    const activeColorRef = useRef(null);
    useEffect(() => {
        activeColorRef.current = activeColor;
    }, [activeColor]);

    useEffect(() => {
        if (!editor) return;

        // Re-apply stored color on focus (when user clicks back into editor after picking a color)
        let isApplying = false;
        const handleFocus = () => {
            if (activeColorRef.current && !isApplying) {
                isApplying = true;
                setTimeout(() => {
                    if (activeColorRef.current && editor && !editor.isDestroyed) {
                        editor.chain().setColor(activeColorRef.current).run();
                    }
                    isApplying = false;
                }, 0);
            }
        };

        // Also re-apply on keydown so every new character gets the color
        const handleKeyDown = (e) => {
            if (!activeColorRef.current) return;
            // Only for printable characters (not arrows, backspace, etc.)
            const isPrintable = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
            if (!isPrintable) return;
            // Check if current position already has the color
            const currentColor = editor.getAttributes('textStyle').color;
            if (currentColor !== activeColorRef.current) {
                editor.chain().setColor(activeColorRef.current).run();
            }
        };

        editor.on('focus', handleFocus);
        editor.view.dom.addEventListener('keydown', handleKeyDown);

        return () => {
            editor.off('focus', handleFocus);
            editor.view.dom.removeEventListener('keydown', handleKeyDown);
        };
    }, [editor]);

    if (!editor) {
        return null;
    }

    const addImage = () => {
        setImageUrl('');
        setIsImageUrlModalOpen(true);
    };

    const handleImageUrlInsert = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
        }
        setIsImageUrlModalOpen(false);
        setImageUrl('');
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href || '';
        setLinkUrl(previousUrl);
        setLinkText('');
        setIsLinkModalOpen(true);
    };

    const handleLinkInsert = () => {
        if (!linkUrl) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
            if (linkText) {
                editor.chain().focus().insertContent(`<a href="${url}">${linkText}</a>`).run();
            } else {
                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }
        }
        setIsLinkModalOpen(false);
        setLinkUrl('');
        setLinkText('');
    };

    const fileInputRef = useRef(null);
    const [uploadType, setUploadType] = useState(null); // 'image', 'attachment', 'drive', 'audio'

    const handleFileUpload = (type) => {
        setUploadType(type);
        // Wait a tick so the accept attribute updates before opening dialog
        setTimeout(() => {
            if (fileInputRef.current) {
                // Dynamically set accept based on type
                if (type === 'image') fileInputRef.current.accept = 'image/*';
                else if (type === 'video') fileInputRef.current.accept = 'video/*';
                else if (type === 'audio') fileInputRef.current.accept = 'audio/*';
                else fileInputRef.current.accept = '*/*';
                fileInputRef.current.click();
            }
        }, 0);
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

    const printNote = () => {
        setIsPrintPreviewOpen(true);
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
        <>
            <div className="no-print flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-white/5 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl sticky top-0 z-20 text-gray-700 dark:text-gray-300 font-sans shadow-sm dark:shadow-none transition-colors duration-300">

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

                {/* Link Modal - rendered via Portal */}
                {isLinkModalOpen && ReactDOM.createPortal(
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center" onClick={() => setIsLinkModalOpen(false)}>
                        <div className="bg-white dark:bg-[#242424] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#333] w-[420px] p-0 animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between px-6 pt-5 pb-3">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Insert Link</h3>
                                <button onClick={() => setIsLinkModalOpen(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-colors">
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                            <div className="px-6 pb-2 space-y-3">
                                <div>
                                    <label className="block text-[13px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">URL</label>
                                    <input
                                        type="url"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#444] rounded-xl text-[14px] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && handleLinkInsert()}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Display Text <span className="text-gray-400 font-normal">(optional)</span></label>
                                    <input
                                        type="text"
                                        value={linkText}
                                        onChange={(e) => setLinkText(e.target.value)}
                                        placeholder="Link text"
                                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#444] rounded-xl text-[14px] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        onKeyDown={(e) => e.key === 'Enter' && handleLinkInsert()}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end space-x-2 px-6 py-4">
                                {linkUrl && (
                                    <button
                                        onClick={() => {
                                            editor.chain().focus().extendMarkRange('link').unsetLink().run();
                                            setIsLinkModalOpen(false);
                                            setLinkUrl('');
                                            setLinkText('');
                                        }}
                                        className="px-4 py-2 text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        Remove Link
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsLinkModalOpen(false)}
                                    className="px-4 py-2 text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLinkInsert}
                                    disabled={!linkUrl}
                                    className="px-5 py-2 text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:dark:bg-gray-600 disabled:text-gray-500 rounded-lg transition-colors"
                                >
                                    Insert
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

                {/* Image URL Modal - rendered via Portal */}
                {isImageUrlModalOpen && ReactDOM.createPortal(
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center" onClick={() => setIsImageUrlModalOpen(false)}>
                        <div className="bg-white dark:bg-[#242424] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#333] w-[420px] p-0 animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between px-6 pt-5 pb-3">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Insert Image from URL</h3>
                                <button onClick={() => setIsImageUrlModalOpen(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-colors">
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                            <div className="px-6 pb-2">
                                <label className="block text-[13px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Image URL</label>
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/image.png"
                                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#444] rounded-xl text-[14px] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleImageUrlInsert()}
                                />
                                {imageUrl && (
                                    <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#1a1a1a] p-2">
                                        <img src={imageUrl} alt="Preview" className="max-h-32 mx-auto rounded-lg object-contain" onError={(e) => e.target.style.display = 'none'} />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between px-6 py-4">
                                <button
                                    onClick={() => {
                                        setIsImageUrlModalOpen(false);
                                        handleFileUpload('image');
                                    }}
                                    className="px-4 py-2 text-[13px] font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center space-x-1.5"
                                >
                                    <FilePlus className="w-4 h-4" />
                                    <span>Upload from device</span>
                                </button>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setIsImageUrlModalOpen(false)}
                                        className="px-4 py-2 text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleImageUrlInsert}
                                        disabled={!imageUrl}
                                        className="px-5 py-2 text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:dark:bg-gray-600 disabled:text-gray-500 rounded-lg transition-colors"
                                    >
                                        Insert
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
                <div className="flex items-center space-x-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileSelected}
                        className="hidden"
                        accept={uploadType === 'image' ? 'image/*' : uploadType === 'video' ? 'video/*' : uploadType === 'audio' ? 'audio/*' : '*/*'}
                    />

                    {/* Left Group: Insert, Undo, Redo */}
                    <div className="flex items-center space-x-1 p-0.5 bg-gray-100/80 dark:bg-[#252525] rounded-xl border border-gray-200/60 dark:border-[#333]">
                        {/* Insert Menu */}
                        <div className="relative" ref={insertRef}>
                            <button
                                onClick={() => setIsInsertOpen(!isInsertOpen)}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${isInsertOpen ? 'bg-white dark:bg-[#333] shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-[#333]/60'}`}
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
                                        <button onClick={() => { setIsInsertOpen(false); setLink(); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
                                            <LinkIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> <span>Link</span>
                                        </button>
                                        <button onClick={() => { setIsInsertOpen(false); addImage(); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded flex items-center space-x-3 transition-colors">
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




                        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#333] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200" title="Undo">
                            <CornerUpLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-[#333] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200" title="Redo">
                            <CornerUpRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="w-px h-5 bg-transparent mx-1" />

                    {/* Center Group: AI, Font Family, Font Size */}
                    <div className="flex items-center space-x-1 p-0.5 bg-gray-100/80 dark:bg-[#252525] rounded-xl border border-gray-200/60 dark:border-[#333]">
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

                        <div className="w-px h-4 bg-gray-300 dark:bg-[#444] mx-1" />



                        {/* Font Family */}
                        <div className="relative" ref={fontFamilyRef}>
                            <button
                                onClick={() => setIsFontFamilyOpen(!isFontFamilyOpen)}
                                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 ${isFontFamilyOpen ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-[#333]/60'}`}
                            >
                                <span className="text-[13px] w-[88px] truncate text-left font-medium leading-none">
                                    {editor.getAttributes('textStyle').fontFamily || 'Sans Serif'}
                                </span>
                                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isFontFamilyOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isFontFamilyOpen && (
                                <div className="absolute top-full left-0 mt-1.5 w-52 bg-white dark:bg-[#202020] rounded-xl shadow-2xl border border-gray-100 dark:border-white/8 py-2 z-50 overflow-hidden">
                                    {/* Sans-Serif Group */}
                                    <div className="px-3 pt-1 pb-0.5">
                                        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sans-Serif</span>
                                    </div>
                                    {[
                                        { name: 'Nunito', label: 'Nunito' },
                                        { name: 'Inter', label: 'Inter' },
                                        { name: 'Arial', label: 'Arial' },
                                        { name: 'Helvetica', label: 'Helvetica' },
                                        { name: 'Verdana', label: 'Verdana' },
                                        { name: 'Tahoma', label: 'Tahoma' },
                                        { name: 'Trebuchet MS', label: 'Trebuchet MS' },
                                    ].map(f => {
                                        const isActive = (editor.getAttributes('textStyle').fontFamily || '') === f.name;
                                        return (
                                            <button
                                                key={f.name}
                                                onClick={() => { editor.chain().focus().setFontFamily(f.name).run(); setIsFontFamilyOpen(false); }}
                                                className={`w-full text-left px-3 py-1.5 text-[13.5px] flex items-center justify-between group transition-colors rounded-md mx-1 ${isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                                style={{ fontFamily: f.name, width: 'calc(100% - 8px)' }}
                                            >
                                                {f.label}
                                                {isActive && <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                            </button>
                                        );
                                    })}

                                    <div className="h-px bg-gray-100 dark:bg-white/6 my-1.5 mx-2" />

                                    {/* Serif Group */}
                                    <div className="px-3 pt-1 pb-0.5">
                                        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Serif</span>
                                    </div>
                                    {[
                                        { name: 'Times New Roman', label: 'Times New Roman' },
                                        { name: 'Garamond', label: 'Garamond' },
                                        { name: 'Georgia', label: 'Georgia' },
                                    ].map(f => {
                                        const isActive = (editor.getAttributes('textStyle').fontFamily || '') === f.name;
                                        return (
                                            <button
                                                key={f.name}
                                                onClick={() => { editor.chain().focus().setFontFamily(f.name).run(); setIsFontFamilyOpen(false); }}
                                                className={`w-full text-left px-3 py-1.5 text-[13.5px] flex items-center justify-between transition-colors rounded-md mx-1 ${isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                                style={{ fontFamily: f.name, width: 'calc(100% - 8px)' }}
                                            >
                                                {f.label}
                                                {isActive && <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                            </button>
                                        );
                                    })}

                                    <div className="h-px bg-gray-100 dark:bg-white/6 my-1.5 mx-2" />

                                    {/* Monospace Group */}
                                    <div className="px-3 pt-1 pb-0.5">
                                        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Monospace</span>
                                    </div>
                                    {[{ name: 'Courier New', label: 'Courier New' }].map(f => {
                                        const isActive = (editor.getAttributes('textStyle').fontFamily || '') === f.name;
                                        return (
                                            <button
                                                key={f.name}
                                                onClick={() => { editor.chain().focus().setFontFamily(f.name).run(); setIsFontFamilyOpen(false); }}
                                                className={`w-full text-left px-3 py-1.5 text-[13.5px] flex items-center justify-between transition-colors rounded-md mx-1 ${isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                                style={{ fontFamily: f.name, width: 'calc(100% - 8px)' }}
                                            >
                                                {f.label}
                                                {isActive && <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                            </button>
                                        );
                                    })}

                                    <div className="h-px bg-gray-100 dark:bg-white/6 my-1.5 mx-2" />

                                    {/* Display Group */}
                                    <div className="px-3 pt-1 pb-0.5">
                                        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Display</span>
                                    </div>
                                    {[
                                        { name: 'Impact', label: 'Impact' },
                                        { name: 'Comic Sans MS', label: 'Comic Sans MS' },
                                    ].map(f => {
                                        const isActive = (editor.getAttributes('textStyle').fontFamily || '') === f.name;
                                        return (
                                            <button
                                                key={f.name}
                                                onClick={() => { editor.chain().focus().setFontFamily(f.name).run(); setIsFontFamilyOpen(false); }}
                                                className={`w-full text-left px-3 py-1.5 text-[13.5px] flex items-center justify-between transition-colors rounded-md mx-1 ${isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                                style={{ fontFamily: f.name, width: 'calc(100% - 8px)' }}
                                            >
                                                {f.label}
                                                {isActive && <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                            </button>
                                        );
                                    })}

                                    <div className="h-px bg-gray-100 dark:bg-white/6 my-1.5 mx-2" />
                                    {/* Reset to default */}
                                    <button
                                        onClick={() => { editor.chain().focus().unsetFontFamily().run(); setIsFontFamilyOpen(false); }}
                                        className="w-full text-left px-3 py-1.5 text-[12.5px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-md mx-1 italic"
                                        style={{ width: 'calc(100% - 8px)' }}
                                    >
                                        ↩ Reset to default
                                    </button>
                                    <div className="pb-1" />
                                </div>
                            )}
                        </div>

                        <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-3" />

                        <button
                            onClick={onToggleZenMode}
                            className={`p-1.5 rounded-lg transition-all duration-200 ${isZenMode ? 'bg-white dark:bg-[#333] shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-[#333]/60 hover:text-gray-900 dark:hover:text-gray-200'}`}
                            title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
                        >
                            {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>

                        <div className="w-px h-4 bg-gray-300 dark:bg-[#444] mx-1" />

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
                    </div>

                    <div className="w-px h-5 bg-transparent mx-1" />

                    {/* Right Group: Zen Mode, More Menu */}
                    <div className="flex items-center space-x-1 p-0.5 bg-gray-100/80 dark:bg-[#252525] rounded-xl border border-gray-200/60 dark:border-[#333]">

                        {/* More Menu */}
                        <div className="relative" ref={moreRef}>
                            <button
                                onClick={() => {
                                    if (!isMoreOpen && moreRef.current) {
                                        const rect = moreRef.current.getBoundingClientRect();
                                        setMoreMenuPos({
                                            top: rect.bottom + window.scrollY + 8,
                                            right: window.innerWidth - rect.right,
                                        });
                                    }
                                    setIsMoreOpen(!isMoreOpen);
                                }}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${isMoreOpen ? 'bg-white dark:bg-[#333] shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-[#333]/60'}`}
                            >
                                <span className="text-sm font-medium">More</span>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            </button>

                            {isMoreOpen && ReactDOM.createPortal(
                                <div
                                    style={{ top: moreMenuPos.top, right: moreMenuPos.right }}
                                    className="fixed w-[350px] bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-gray-200/80 dark:border-[#333] py-1.5 z-[9999] max-h-[80vh] overflow-y-auto custom-scrollbar"
                                >

                                    {/* Note Stats Bar */}
                                    {(() => {
                                        const text = editor.getText();
                                        const words = text.split(/\s+/).filter(w => w.length > 0).length;
                                        const chars = text.length;
                                        const readingTime = Math.max(1, Math.ceil(words / 200));
                                        return (
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-[#2a2a2a]">
                                                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center space-x-1">
                                                        <FileText className="w-3 h-3" />
                                                        <span>{words} words</span>
                                                    </div>
                                                    <span>{chars} chars</span>
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{readingTime} min read</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Headings */}
                                    <div className="px-2 py-1.5 border-b border-gray-100 dark:border-[#2a2a2a]">
                                        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 pt-1 pb-1.5">Headings</div>
                                        <div className="grid grid-cols-3 gap-1 px-1">
                                            <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); setIsMoreOpen(false); }} className={`px-2 py-1.5 text-[13px] font-bold rounded-lg transition-all ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'}`}>
                                                H1
                                            </button>
                                            <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); setIsMoreOpen(false); }} className={`px-2 py-1.5 text-[13px] font-bold rounded-lg transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'}`}>
                                                H2
                                            </button>
                                            <button onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); setIsMoreOpen(false); }} className={`px-2 py-1.5 text-[13px] font-bold rounded-lg transition-all ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'}`}>
                                                H3
                                            </button>
                                        </div>
                                    </div>

                                    {/* Font Color & Highlight */}
                                    <div className="px-3 py-2.5 border-b border-gray-100 dark:border-[#2a2a2a]">
                                        <div className="flex items-center justify-between pb-2">
                                            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">Colors</div>
                                            {activeColor && (
                                                <button
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        setActiveColor(null);
                                                        editor.chain().focus().unsetColor().run();
                                                    }}
                                                    className="flex items-center space-x-1 text-[10px] text-red-500 hover:text-red-600 px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-900/20 transition-colors"
                                                >
                                                    <X className="w-2.5 h-2.5" />
                                                    <span>Reset color</span>
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-2.5">
                                            <div>
                                                <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1.5 px-1 font-medium">Font color</div>
                                                <div className="flex items-center space-x-1.5 px-0.5">
                                                    {/* Default / reset color */}
                                                    <button
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            setActiveColor(null);
                                                            editor.chain().focus().unsetColor().run();
                                                        }}
                                                        className={`w-6 h-6 rounded-full bg-white border-2 hover:scale-110 transition-all ${!activeColor ? 'border-blue-500 ring-1 ring-blue-400' : 'border-gray-300 dark:border-gray-500 hover:border-gray-500'}`}
                                                        title="Default"
                                                    ></button>
                                                    {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#d946ef', '#6b7280', '#1f2937'].map(c => (
                                                        <button
                                                            key={c}
                                                            onMouseDown={(e) => {
                                                                // CRITICAL: prevent focus loss so stored marks survive
                                                                e.preventDefault();
                                                                setActiveColor(c);
                                                                editor.chain().focus().setColor(c).run();
                                                            }}
                                                            className={`w-6 h-6 shrink-0 rounded-full hover:scale-110 transition-transform shadow-sm ${activeColor === c ? 'ring-2 ring-offset-1 ring-blue-500 ring-offset-white dark:ring-offset-[#1e1e1e] scale-110' : 'ring-1 ring-black/5'}`}
                                                            style={{ backgroundColor: c }}
                                                            title={c}
                                                        ></button>
                                                    ))}
                                                    <div
                                                        onMouseDown={(e) => {
                                                            // Store selection BEFORE the native color picker dialog opens and steals blur
                                                            window.__tiptapSelection = editor.state.selection;
                                                        }}
                                                        className="relative w-6 h-6 shrink-0 rounded-full overflow-hidden border border-gray-300 dark:border-gray-500 hover:scale-110 transition-transform shadow-sm flex items-center justify-center cursor-pointer" title="Custom color"
                                                    >
                                                        <input
                                                            type="color"
                                                            value={activeColor || '#000000'}
                                                            onChange={(e) => {
                                                                const c = e.target.value;
                                                                setActiveColor(c);
                                                                if (window.__tiptapSelection) {
                                                                    editor.commands.setTextSelection(window.__tiptapSelection);
                                                                }
                                                                editor.chain().focus().setColor(c).run();
                                                            }}
                                                            className="absolute -top-2 -left-2 w-10 h-10 opacity-0 cursor-pointer"
                                                        />
                                                        <div className="w-full h-full rounded-full" style={{ background: activeColor && !['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#d946ef', '#6b7280', '#1f2937'].includes(activeColor) ? activeColor : 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1.5 px-1 font-medium">Highlight</div>
                                                <div className="flex items-center space-x-1.5 px-0.5">
                                                    <button
                                                        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetHighlight().run(); }}
                                                        className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-500 flex items-center justify-center hover:scale-110 transition-all"
                                                        title="None"
                                                    >
                                                        <X className="w-3 h-3 text-gray-400" />
                                                    </button>
                                                    {[{ c: '#fef08a', t: 'Yellow' }, { c: '#bbf7d0', t: 'Green' }, { c: '#bfdbfe', t: 'Blue' }, { c: '#fbcfe8', t: 'Pink' }, { c: '#e9d5ff', t: 'Purple' }, { c: '#fed7aa', t: 'Orange' }, { c: '#fecaca', t: 'Red' }].map(h => (
                                                        <button
                                                            key={h.c}
                                                            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHighlight({ color: h.c }).run(); }}
                                                            className="w-6 h-6 shrink-0 rounded-full hover:scale-110 transition-transform shadow-sm ring-1 ring-black/5"
                                                            style={{ backgroundColor: h.c }}
                                                            title={h.t}
                                                        ></button>
                                                    ))}
                                                    <div
                                                        onMouseDown={(e) => {
                                                            window.__tiptapSelection = editor.state.selection;
                                                        }}
                                                        className="relative w-6 h-6 shrink-0 rounded-full overflow-hidden border border-gray-300 dark:border-gray-500 hover:scale-110 transition-transform shadow-sm flex items-center justify-center cursor-pointer" title="Custom highlight"
                                                    >
                                                        <input
                                                            type="color"
                                                            onChange={(e) => {
                                                                const c = e.target.value;
                                                                if (window.__tiptapSelection) {
                                                                    editor.commands.setTextSelection(window.__tiptapSelection);
                                                                }
                                                                editor.chain().focus().toggleHighlight({ color: c }).run();
                                                            }}
                                                            className="absolute -top-2 -left-2 w-10 h-10 opacity-0 cursor-pointer"
                                                        />
                                                        <div className="w-full h-full rounded-full" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Formatting */}
                                    <div className="px-2 py-1.5 border-b border-gray-100 dark:border-[#2a2a2a]">
                                        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 pt-1 pb-1">Format</div>
                                        {[
                                            { fn: () => editor.chain().focus().toggleBold().run(), icon: Bold, label: 'Bold', shortcut: '⌘B', active: editor.isActive('bold') },
                                            { fn: () => editor.chain().focus().toggleItalic().run(), icon: Italic, label: 'Italic', shortcut: '⌘I', active: editor.isActive('italic') },
                                            { fn: () => editor.chain().focus().toggleUnderline().run(), icon: UnderlineIcon, label: 'Underline', shortcut: '⌘U', active: editor.isActive('underline') },
                                            { fn: () => editor.chain().focus().toggleStrike().run(), icon: Strikethrough, label: 'Strikethrough', shortcut: '⌘⇧X', active: editor.isActive('strike') },
                                            { fn: () => editor.chain().focus().toggleCode().run(), icon: Code, label: 'Inline Code', shortcut: '⌘E', active: editor.isActive('code') },
                                        ].map((item, i) => (
                                            <button key={i} onMouseDown={(e) => { e.preventDefault(); item.fn(); }} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg flex items-center justify-between transition-colors ${item.active ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-900/10' : 'text-gray-700 dark:text-gray-300'}`}>
                                                <div className="flex items-center space-x-2.5">
                                                    <item.icon className="w-4 h-4" />
                                                    <span className="font-medium">{item.label}</span>
                                                </div>
                                                <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">{item.shortcut}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Lists & Structure */}
                                    <div className="px-2 py-1.5 border-b border-gray-100 dark:border-[#2a2a2a]">
                                        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 pt-1 pb-1">Structure</div>
                                        {[
                                            { fn: () => editor.chain().focus().toggleBulletList().run(), icon: List, label: 'Bullet List', active: editor.isActive('bulletList') },
                                            { fn: () => editor.chain().focus().toggleOrderedList().run(), icon: ListOrdered, label: 'Numbered List', active: editor.isActive('orderedList') },
                                            { fn: () => editor.chain().focus().toggleTaskList().run(), icon: CheckSquare, label: 'Checklist', active: editor.isActive('taskList') },
                                            { fn: () => editor.chain().focus().toggleBlockquote().run(), icon: Quote, label: 'Blockquote', active: editor.isActive('blockquote') },
                                            { fn: () => editor.chain().focus().toggleCodeBlock().run(), icon: Code2, label: 'Code Block', active: editor.isActive('codeBlock') },
                                            { fn: () => { editor.chain().focus().setHorizontalRule().run(); setIsMoreOpen(false); }, icon: MinusIcon, label: 'Divider', active: false },
                                        ].map((item, i) => (
                                            <button key={i} onMouseDown={(e) => { e.preventDefault(); item.fn(); setIsMoreOpen(false); }} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg flex items-center space-x-2.5 transition-colors ${item.active ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-900/10' : 'text-gray-700 dark:text-gray-300'}`}>
                                                <item.icon className="w-4 h-4" />
                                                <span className="font-medium">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Callouts */}
                                    <div className="px-2 py-1.5 border-b border-gray-100 dark:border-[#2a2a2a]">
                                        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 pt-1 pb-1">Callouts</div>
                                        {[
                                            { label: '💡 Tip', bg: '#fef9c3', darkBg: '#422006', color: '#854d0e' },
                                            { label: 'ℹ️ Info', bg: '#dbeafe', darkBg: '#1e3a5f', color: '#1e40af' },
                                            { label: '⚠️ Warning', bg: '#fef3c7', darkBg: '#451a03', color: '#92400e' },
                                            { label: '🚨 Important', bg: '#fee2e2', darkBg: '#450a0a', color: '#991b1b' },
                                            { label: '✅ Success', bg: '#dcfce7', darkBg: '#052e16', color: '#166534' },
                                        ].map((c, i) => (
                                            <button
                                                key={i}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    editor.chain().focus().insertContent({
                                                        type: 'calloutBlock',
                                                        attrs: { bg: c.bg, color: c.color, label: c.label },
                                                        content: [{ type: 'text', text: 'Your note here' }]
                                                    }).run();
                                                    setIsMoreOpen(false);
                                                }}
                                                className="w-full text-left px-3 py-1.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg flex items-center space-x-2.5 transition-colors font-medium"
                                            >
                                                <span>{c.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Insert & Link */}
                                    <div className="px-2 py-1.5 border-b border-gray-100 dark:border-[#2a2a2a]">
                                        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 pt-1 pb-1">Insert</div>
                                        <button onClick={() => { setIsMoreOpen(false); setLink(); }} className="w-full text-left px-3 py-1.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg flex items-center justify-between transition-colors group">
                                            <div className="flex items-center space-x-2.5">
                                                <LinkIcon className="w-4 h-4 text-indigo-500" />
                                                <span className="font-medium">Insert Link</span>
                                            </div>
                                            <span className="text-[11px] text-gray-400 font-mono">⌘K</span>
                                        </button>
                                        <button onClick={() => { setIsMoreOpen(false); addImage(); }} className="w-full text-left px-3 py-1.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg flex items-center space-x-2.5 transition-colors">
                                            <ImageIcon className="w-4 h-4 text-green-500" />
                                            <span className="font-medium">Insert Image</span>
                                        </button>
                                        <button onClick={() => { insertTable(); setIsMoreOpen(false); }} className="w-full text-left px-3 py-1.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg flex items-center space-x-2.5 transition-colors">
                                            <TableIcon className="w-4 h-4 text-blue-500" />
                                            <span className="font-medium">Insert Table</span>
                                        </button>
                                        <button onClick={() => {
                                            const date = new Date();
                                            editor.chain().focus().insertContent(
                                                `<p><strong>${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong> — ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>`
                                            ).run();
                                            setIsMoreOpen(false);
                                        }} className="w-full text-left px-3 py-1.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg flex items-center space-x-2.5 transition-colors">
                                            <CalendarDays className="w-4 h-4 text-orange-500" />
                                            <span className="font-medium">Insert Date & Time</span>
                                        </button>
                                    </div>

                                    {/* Alignment */}
                                    <div className="px-2 py-1.5 border-b border-gray-100 dark:border-[#2a2a2a]">
                                        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 pt-1 pb-1">Align</div>
                                        <div className="flex items-center space-x-1 px-2">
                                            {[
                                                { fn: () => editor.chain().focus().setTextAlign('left').run(), icon: AlignLeft, label: 'Left', active: editor.isActive({ textAlign: 'left' }) },
                                                { fn: () => editor.chain().focus().setTextAlign('center').run(), icon: AlignCenter, label: 'Center', active: editor.isActive({ textAlign: 'center' }) },
                                                { fn: () => editor.chain().focus().setTextAlign('right').run(), icon: AlignRight, label: 'Right', active: editor.isActive({ textAlign: 'right' }) },
                                                { fn: () => editor.chain().focus().setTextAlign('justify').run(), icon: AlignJustify, label: 'Justify', active: editor.isActive({ textAlign: 'justify' }) },
                                            ].map((item, i) => (
                                                <button key={i} onClick={item.fn} className={`flex-1 flex flex-col items-center py-1.5 rounded-lg transition-all ${item.active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-gray-700 dark:hover:text-gray-200'}`} title={item.label}>
                                                    <item.icon className="w-4 h-4" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Indent/Outdent */}
                                    <div className="px-2 py-1.5 border-b border-gray-100 dark:border-[#2a2a2a]">
                                        <div className="flex items-center space-x-1 px-1">
                                            <button onClick={() => editor.chain().focus().sinkListItem('listItem').run()} disabled={!editor.can().sinkListItem('listItem')} className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-1.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg disabled:opacity-25 disabled:cursor-not-allowed transition-colors font-medium">
                                                <Indent className="w-4 h-4" /> <span>Indent</span>
                                            </button>
                                            <div className="w-px h-5 bg-gray-200 dark:bg-[#333]"></div>
                                            <button onClick={() => editor.chain().focus().liftListItem('listItem').run()} disabled={!editor.can().liftListItem('listItem')} className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-1.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg disabled:opacity-25 disabled:cursor-not-allowed transition-colors font-medium">
                                                <Outdent className="w-4 h-4" /> <span>Outdent</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Advanced */}
                                    <div className="px-2 py-1.5 border-b border-gray-100 dark:border-[#2a2a2a]">
                                        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 pt-1 pb-1">Advanced</div>
                                        {[
                                            { fn: () => editor.chain().focus().toggleSuperscript().run(), icon: SuperscriptIcon, label: 'Superscript', active: editor.isActive('superscript') },
                                            { fn: () => editor.chain().focus().toggleSubscript().run(), icon: SubscriptIcon, label: 'Subscript', active: editor.isActive('subscript') },
                                        ].map((item, i) => (
                                            <button key={i} onClick={item.fn} className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg flex items-center space-x-2.5 transition-colors ${item.active ? 'text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-900/10' : 'text-gray-700 dark:text-gray-300'}`}>
                                                <item.icon className="w-4 h-4" />
                                                <span className="font-medium">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Utilities */}
                                    <div className="px-2 py-1.5">
                                        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2 pt-1 pb-1">Tools</div>
                                        <button onClick={() => { navigator.clipboard.writeText(editor.getText()); setIsMoreOpen(false); }} className="w-full text-left px-3 py-1.5 text-[13px] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg flex items-center space-x-2.5 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                                            <FilePlus className="w-4 h-4" />
                                            <span className="font-medium">Copy all text</span>
                                        </button>
                                        <button onClick={() => { printNote(); setIsMoreOpen(false); }} className="w-full text-left px-3 py-1.5 text-[13px] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg flex items-center space-x-2.5 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                                            <ArrowUpRight className="w-4 h-4" />
                                            <span className="font-medium">Print note</span>
                                        </button>
                                        <button onClick={() => { editor.chain().focus().clearNodes().run(); editor.chain().focus().unsetAllMarks().run(); setIsMoreOpen(false); }} className="w-full text-left px-3 py-1.5 text-[13px] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg flex items-center space-x-2.5 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                                            <Type className="w-4 h-4" />
                                            <span className="font-medium">Simplify formatting</span>
                                        </button>
                                        <button onClick={() => { editor.chain().focus().unsetAllMarks().run(); setIsMoreOpen(false); }} className="w-full text-left px-3 py-1.5 text-[13px] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg flex items-center space-x-2.5 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                            <X className="w-4 h-4" />
                                            <span className="font-medium">Remove all formatting</span>
                                        </button>
                                    </div>
                                </div>,
                                document.body
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <PrintPreviewModal
                isOpen={isPrintPreviewOpen}
                onClose={() => setIsPrintPreviewOpen(false)}
                html={editor ? editor.getHTML() : ""}
                title={noteTitle || "Untitled Note"}
            />
        </>
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
const RichTextEditor = ({ content, onChange, editable = true, template = 'blank', onTemplateChange, isZenMode, onToggleZenMode, isSaving, noteTitle }) => {
    const [currentTemplate, setCurrentTemplate] = useState(template);

    useEffect(() => {
        setCurrentTemplate(template);
    }, [template]);

    // Get template metadata
    const templateData = getTemplateById(currentTemplate);
    const lineHeight = templateData?.lineHeight || 28; // Default line height
    const baseFontSize = templateData?.lineHeight ? Math.floor(templateData.lineHeight * 0.65) : 16;
    const { fontSize: userFontSize, spellCheck: userSpellCheck } = useSettings();
    const fontSize = userFontSize === 'small' ? baseFontSize - 2 : userFontSize === 'large' ? baseFontSize + 4 : baseFontSize;
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
            TextStyle,
            FontSize,
            FontFamily,
            Color,
            CalloutBlock,
            Highlight.configure({ multicolor: true }),
            Subscript,
            Superscript,
            // TableOfContents,
            Youtube.configure({
                controls: false,
            }),
            VideoExtension,

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
                style: `line-height: ${lineHeight}px; font-size: ${fontSize}px; padding-top: ${paddingTop}px;`,
                spellcheck: userSpellCheck ? 'true' : 'false'
            },
        },
    }, [currentTemplate, isZenMode, fontSize, userSpellCheck]);

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
            {editable && <MenuBar editor={editor} onTemplateChange={handleTemplateChange} currentTemplate={currentTemplate} isZenMode={isZenMode} onToggleZenMode={onToggleZenMode} noteTitle={noteTitle} />}
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
            <div className={`flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-[#111111]`}>
                {/* Editor page with shadow effect */}
                <div className="min-h-full flex justify-center pt-8 pb-32 px-4 sm:px-6">
                    <div
                        className="w-full max-w-5xl bg-white dark:bg-[#1c1c1e] shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden border border-gray-200/50 dark:border-white/5 transition-colors duration-300 ring-1 ring-gray-900/5 dark:ring-white/5"
                        style={isCustomTemplate ? {
                            backgroundImage: `url(${currentTemplate})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        } : {}}
                    >
                        {/* Comfortable padding for writing */}
                        <div className={`px-12 py-8 pb-24 min-h-[1050px] template-container ${!isCustomTemplate ? `template-${currentTemplate}` : ''}`}>
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

                /* Highlight Styling */
                .ProseMirror mark {
                    padding: 0.15em 0.3em;
                    border-radius: 0.25em;
                    margin: 0 -0.1em;
                    box-decoration-break: clone;
                    -webkit-box-decoration-break: clone;
                }

                /* Checklist Styling */
                ul[data-type="taskList"] {
                    list-style: none;
                    padding: 0;
                }
                ul[data-type="taskList"] p {
                    margin: 0;
                }
                ul[data-type="taskList"] li {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 0.25rem;
                }
                ul[data-type="taskList"] li > label {
                    flex-shrink: 0;
                    margin-right: 0.5rem;
                    user-select: none;
                    margin-top: 0.2rem;
                }
                ul[data-type="taskList"] li > label input[type="checkbox"] {
                    appearance: none;
                    background-color: transparent;
                    margin: 0;
                    width: 1.1em;
                    height: 1.1em;
                    border: 2px solid #9ca3af;
                    border-radius: 4px;
                    display: grid;
                    place-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                }
                .dark ul[data-type="taskList"] li > label input[type="checkbox"] {
                    border-color: #4b5563;
                }
                ul[data-type="taskList"] li > label input[type="checkbox"]::before {
                    content: "";
                    width: 0.65em;
                    height: 0.65em;
                    transform: scale(0);
                    transition: 120ms transform ease-in-out;
                    box-shadow: inset 1em 1em white;
                    background-color: white;
                    transform-origin: center;
                    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                }
                ul[data-type="taskList"] li > label input[type="checkbox"]:checked {
                    background-color: #3b82f6;
                    border-color: #3b82f6;
                }
                ul[data-type="taskList"] li > label input[type="checkbox"]:checked::before {
                    transform: scale(1);
                }
                ul[data-type="taskList"] li[data-checked="true"] > div {
                    text-decoration: line-through;
                    color: #9ca3af;
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
