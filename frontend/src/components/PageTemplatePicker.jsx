import React, { useState, useMemo, useEffect, useRef } from 'react';
import { templatesAPI } from '../api';
import toast from 'react-hot-toast';
import {
    X,
    Search,
    FileText,
    Grid3x3,
    Circle,
    Columns,
    Calendar,
    CalendarDays,
    ListChecks,
    Upload,
    Star,
    Eye,
    Image as ImageIcon,
    Loader2,
    Check,
    ChevronRight,
    Layout,
    Trash2
} from 'lucide-react';
import { TEMPLATES } from '../constants/templates';

const PageTemplatePicker = ({ isOpen, onClose, currentTemplate, onSelectTemplate }) => {
    const [selectedCategory, setSelectedCategory] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    const [customTemplates, setCustomTemplates] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState(currentTemplate);
    const [selectedVariantId, setSelectedVariantId] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            // Find parent template of current template if it's a variant
            const current = currentTemplate || 'blank';
            let foundParent = false;

            for (const t of TEMPLATES) {
                if (t.id === current) {
                    setSelectedTemplateId(current);
                    setSelectedVariantId(null);
                    foundParent = true;
                    break;
                }
                const variant = t.variants.find(v => v.id === current);
                if (variant) {
                    setSelectedTemplateId(t.id);
                    setSelectedVariantId(current);
                    foundParent = true;
                    break;
                }
            }

            if (!foundParent) {
                setSelectedTemplateId('blank');
                setSelectedVariantId(null);
            }
        }
    }, [isOpen, currentTemplate]);

    useEffect(() => {
        fetchCustomTemplates();
    }, []);

    const fetchCustomTemplates = async () => {
        try {
            const response = await templatesAPI.getTemplates();
            const formattedTemplates = response.data.data.templates.map(t => ({
                id: t.url, // Use URL as ID for easy application
                name: t.name,
                description: 'Custom uploaded template',
                category: 'custom',
                icon: ImageIcon,
                preview: 'custom',
                url: t.url,
                variants: []
            }));
            setCustomTemplates(formattedTemplates);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            const response = await templatesAPI.uploadTemplate(formData);
            const newTemplate = response.data.data.template;

            const formattedTemplate = {
                id: newTemplate.url,
                name: newTemplate.name,
                description: 'Custom uploaded template',
                category: 'custom',
                icon: ImageIcon,
                preview: 'custom',
                url: newTemplate.url,
                variants: []
            };

            setCustomTemplates([formattedTemplate, ...customTemplates]);
            toast.success('Template uploaded successfully');
            setSelectedCategory('custom');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload template');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Template definitions
    const templates = TEMPLATES;

    const categories = [
        { id: 'default', name: 'Essentials' },
        { id: 'planning', name: 'Planning' },
        { id: 'custom', name: 'Custom' },
    ];

    // Filter templates
    const filteredTemplates = useMemo(() => {
        let filtered = templates;

        if (selectedCategory === 'custom') {
            filtered = customTemplates;
        } else if (selectedCategory === 'planning') {
            filtered = templates.filter(t => ['monthly-planner', 'weekly-planner', 'calendar', 'checklist'].includes(t.id));
        } else {
            // Default category excludes planning templates for cleaner view
            filtered = templates.filter(t => !['monthly-planner', 'weekly-planner', 'calendar', 'checklist'].includes(t.id));
        }

        if (searchQuery) {
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    }, [selectedCategory, searchQuery, customTemplates]);

    const handleTemplateClick = (template) => {
        setSelectedTemplateId(template.id);
        // If it has variants, select the first one by default if none selected
        if (template.variants && template.variants.length > 0) {
            setSelectedVariantId(template.variants[0].id);
        } else {
            setSelectedVariantId(null);
        }
    };

    const handleApply = () => {
        const finalId = selectedVariantId || selectedTemplateId;
        onSelectTemplate(finalId);
        onClose();
    };

    const renderTemplatePreview = (preview) => {
        switch (preview) {
            case 'lined':
                return (
                    <div className="absolute inset-0 flex flex-col pt-6 px-4 gap-4 opacity-60">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-px bg-blue-400 dark:bg-blue-500 w-full" />
                        ))}
                    </div>
                );
            case 'grid':
                return (
                    <div className="absolute inset-0 opacity-60"
                        style={{
                            backgroundImage: `linear-gradient(to right, #60a5fa 1px, transparent 1px), linear-gradient(to bottom, #60a5fa 1px, transparent 1px)`,
                            backgroundSize: '20px 20px'
                        }}
                    />
                );
            case 'dotgrid':
                return (
                    <div className="absolute inset-0 opacity-60"
                        style={{
                            backgroundImage: `radial-gradient(circle, #60a5fa 1.5px, transparent 1.5px)`,
                            backgroundSize: '20px 20px'
                        }}
                    />
                );
            case 'cornell':
                return (
                    <div className="absolute inset-0 flex opacity-60">
                        <div className="w-1/3 border-r-2 border-blue-400 dark:border-blue-500 h-full" />
                        <div className="flex-1 h-full relative">
                            <div className="absolute bottom-0 left-0 right-0 h-1/4 border-t-2 border-blue-400 dark:border-blue-500" />
                        </div>
                    </div>
                );
            case 'checklist':
                return (
                    <div className="absolute inset-0 p-4 flex flex-col gap-3 opacity-60">
                        <div className="h-1 bg-blue-400 w-1/3 mb-2" />
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-3 h-3 border border-blue-400 rounded-sm" />
                                <div className="h-px bg-blue-300 w-full" />
                            </div>
                        ))}
                    </div>
                );
            case 'monthly':
            case 'calendar':
                return (
                    <div className="absolute inset-0 grid grid-cols-7 grid-rows-5 gap-px bg-blue-200 opacity-50 p-2">
                        {[...Array(35)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#2d2d2d]" />
                        ))}
                    </div>
                );
            case 'weekly':
                return (
                    <div className="absolute inset-0 flex flex-col gap-px bg-blue-200 opacity-50 p-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex-1 bg-white dark:bg-[#2d2d2d] flex items-center px-2">
                                <div className="w-1 h-4 bg-blue-400 rounded-full" />
                            </div>
                        ))}
                    </div>
                );
            case 'custom':
                return (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-[#252525]">
                        <ImageIcon className="w-10 h-10 text-gray-300" />
                    </div>
                );
            default: // blank
                return null;
        }
    };

    if (!isOpen) return null;

    const activeTemplate = templates.find(t => t.id === selectedTemplateId) || customTemplates.find(t => t.id === selectedTemplateId);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4 sm:p-6">
            <div className="bg-white dark:bg-[#191919] rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-[#333]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-[#333] flex items-center justify-between bg-white dark:bg-[#191919] shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Layout className="w-5 h-5 text-blue-500" />
                            Page Templates
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Select a layout for your note</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar / Categories */}
                    <div className="w-64 bg-gray-50 dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-[#333] flex flex-col p-4 gap-2 shrink-0 overflow-y-auto">
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search templates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-[#2d2d2d] border border-gray-200 dark:border-[#333] text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">Categories</div>

                        <div className="flex flex-col gap-1 mb-4">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${selectedCategory === cat.id
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2d2d2d]'
                                        }`}
                                >
                                    <span>{cat.name}</span>
                                    {selectedCategory === cat.id && <ChevronRight className="w-4 h-4 opacity-70" />}
                                </button>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-[#333] mt-auto">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white dark:bg-[#2d2d2d] border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-blue-500 hover:text-blue-500 transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                <span>{isUploading ? 'Uploading...' : 'Import Template'}</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#191919] custom-scrollbar">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                            {filteredTemplates.map((template) => {
                                const isSelected = selectedTemplateId === template.id;
                                const Icon = template.icon;

                                return (
                                    <div
                                        key={template.id}
                                        onClick={() => handleTemplateClick(template)}
                                        className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${isSelected
                                            ? 'border-blue-500 ring-4 ring-blue-500/10 dark:ring-blue-500/20'
                                            : 'border-gray-200 dark:border-[#333] hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="aspect-[3/4] bg-gray-50 dark:bg-[#222] relative p-4">
                                            <div className="w-full h-full bg-white dark:bg-[#1e1e1e] shadow-sm border border-gray-100 dark:border-[#333] relative overflow-hidden">
                                                {renderTemplatePreview(template.preview)}
                                                {/* Center Icon Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 dark:bg-white/5">
                                                    <div className="bg-white dark:bg-[#333] p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                                        <Icon className="w-6 h-6 text-blue-500" />
                                                    </div>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full shadow-lg animate-in zoom-in">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 bg-white dark:bg-[#1e1e1e] border-t border-gray-100 dark:border-[#333]">
                                            <h3 className={`font-medium text-sm truncate ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-200'}`}>
                                                {template.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {template.variants?.length > 0 ? `${template.variants.length} variants` : template.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Variants Ribbon / Footer */}
                {activeTemplate?.variants?.length > 0 && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-[#333] shrink-0 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-4 overflow-x-auto custom-scrollbar pb-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0">Variants:</span>
                            {activeTemplate.variants.map(variant => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariantId(variant.id)}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap border ${selectedVariantId === variant.id
                                        ? 'bg-white dark:bg-[#2d2d2d] border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'bg-transparent border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2d2d2d]'
                                        }`}
                                >
                                    {variant.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-[#333] bg-white dark:bg-[#191919] flex items-center justify-between shrink-0">
                    <button
                        onClick={() => {
                            onSelectTemplate('blank');
                            onClose();
                        }}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Remove Template
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApply}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                        >
                            Apply Template
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PageTemplatePicker;
