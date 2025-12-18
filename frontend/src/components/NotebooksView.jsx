import React, { useState, useEffect, useRef } from 'react';
import { Book, Plus, MoreHorizontal, Search, Filter, ArrowUpDown, ChevronRight, User, Pencil, Trash2, LayoutGrid, List, Star } from 'lucide-react';
import { notebooksAPI } from '../api';
import { format } from 'date-fns';
import CreateNotebookModal from './CreateNotebookModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import NotebookDetailsPanel from './NotebookDetailsPanel';
import { toast } from 'react-hot-toast';

const NotebooksView = ({ onCreateNote, notes, onSelectNote }) => {
    const [notebooks, setNotebooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'updatedAt', direction: 'desc' });
    const [editingNotebook, setEditingNotebook] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [notebookToDelete, setNotebookToDelete] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [selectedNotebook, setSelectedNotebook] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        fetchNotebooks();

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotebooks = async () => {
        try {
            const response = await notebooksAPI.getNotebooks();
            setNotebooks(response.data.data.notebooks);
        } catch (error) {
            console.error('Failed to fetch notebooks');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNotebook = async (notebookData) => {
        const response = await notebooksAPI.createNotebook(notebookData);
        setNotebooks([response.data.data.notebook, ...notebooks]);
    };

    const handleDuplicateNotebook = async (notebook) => {
        try {
            const newNotebookData = {
                ...notebook,
                name: `${notebook.name} (Copy)`,
                _id: undefined,
                createdAt: undefined,
                updatedAt: undefined,
                __v: undefined
            };
            await handleCreateNotebook(newNotebookData);
            toast.success('Notebook duplicated successfully');
        } catch (error) {
            console.error('Failed to duplicate notebook:', error);
            toast.error('Failed to duplicate notebook');
        }
    };

    const handleUpdateNotebook = async (id, notebookData) => {
        const response = await notebooksAPI.updateNotebook(id, notebookData);
        const updatedNotebook = response.data.data.notebook;
        setNotebooks(notebooks.map(n => n._id === id ? updatedNotebook : n));
        setEditingNotebook(null);
        if (selectedNotebook?._id === id) {
            setSelectedNotebook(updatedNotebook);
        }
        return updatedNotebook;
    };

    const handleDeleteClick = (notebook) => {
        setNotebookToDelete(notebook);
        setDeleteModalOpen(true);
        setOpenMenuId(null);
    };

    const confirmDeleteNotebook = async () => {
        if (!notebookToDelete) return;

        try {
            await notebooksAPI.deleteNotebook(notebookToDelete._id);
            setNotebooks(notebooks.filter(n => n._id !== notebookToDelete._id));
            toast.success('Notebook deleted successfully');
            setDeleteModalOpen(false);
            setNotebookToDelete(null);
            if (selectedNotebook?._id === notebookToDelete._id) {
                setSelectedNotebook(null);
            }
        } catch (error) {
            console.error('Failed to delete notebook:', error);
            toast.error('Failed to delete notebook');
        }
    };

    const handleEditClick = (notebook) => {
        setEditingNotebook(notebook);
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filteredNotebooks = notebooks
        .filter(notebook =>
            notebook.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortConfig.key === 'name') {
                return sortConfig.direction === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            }
            // Date sort
            const dateA = new Date(a[sortConfig.key]);
            const dateB = new Date(b[sortConfig.key]);
            return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        });

    return (
        <div className="flex-1 bg-gray-50 dark:bg-[#121212] flex h-full overflow-hidden text-gray-900 dark:text-white">
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="px-4 sm:px-8 pt-8 pb-4 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-1">Notebooks</h1>
                            <p className="text-gray-500 dark:text-gray-400">Organize your notes and ideas.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#252525] p-1 rounded-lg w-fit">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                                    ? 'bg-white dark:bg-[#333] text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'table'
                                    ? 'bg-white dark:bg-[#333] text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search notebooks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-64 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#252525] rounded-xl transition-colors">
                                <Filter className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => {
                                    setEditingNotebook(null);
                                    setIsModalOpen(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-blue-500/20 transition-all flex-1 sm:flex-none justify-center"
                            >
                                <Plus className="w-4 h-4" />
                                New Notebook
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredNotebooks.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center pb-20 opacity-60">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-[#252525] rounded-full flex items-center justify-center mb-4">
                                <Book className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No notebooks found</h3>
                            <p className="text-gray-500">Create a new notebook to get started.</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        // Grid View
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredNotebooks.map((notebook) => (
                                <div
                                    key={notebook._id}
                                    onClick={() => setSelectedNotebook(notebook)}
                                    className={`group bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer ${selectedNotebook?._id === notebook._id ? 'ring-2 ring-blue-500 border-transparent' : ''
                                        }`}
                                >
                                    {/* Cover */}
                                    <div className={`h-24 w-full ${notebook.cover || 'bg-gradient-to-r from-blue-500 to-cyan-500'} relative`}>
                                        {notebook.isFavorite && (
                                            <div className="absolute top-2 right-2 p-1.5 bg-black/20 backdrop-blur-sm rounded-full">
                                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 pt-8 relative flex flex-col h-[180px]">
                                        {/* Icon */}
                                        <div className="absolute -top-8 left-5 w-14 h-14 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-md flex items-center justify-center text-2xl border-4 border-white dark:border-[#1e1e1e]">
                                            {notebook.icon || '📚'}
                                        </div>

                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">
                                            {notebook.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
                                            {notebook.description || 'No description'}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {notebook.tags?.slice(0, 2).map((tag, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#2d2d2d] text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    #{tag}
                                                </span>
                                            ))}
                                            {notebook.tags?.length > 2 && (
                                                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#2d2d2d] text-xs font-medium text-gray-500">
                                                    +{notebook.tags.length - 2}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4 mt-auto">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 border-2 border-white dark:border-[#1e1e1e] flex items-center justify-center text-[10px] text-white font-bold">
                                                        A
                                                    </div>
                                                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-[#333] border-2 border-white dark:border-[#1e1e1e] flex items-center justify-center text-[10px] text-gray-500">
                                                        +2
                                                    </div>
                                                </div>
                                                <span>•</span>
                                                <span>{format(new Date(notebook.updatedAt), 'MMM d')}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span>12 notes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Table View
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-[#252525]">
                                <div className="col-span-8 md:col-span-4 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" onClick={() => handleSort('name')}>
                                    Name
                                </div>
                                <div className="hidden md:block col-span-3">Tags</div>
                                <div className="hidden lg:block col-span-2">Created By</div>
                                <div className="hidden md:block col-span-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" onClick={() => handleSort('updatedAt')}>
                                    Last Updated
                                </div>
                                <div className="col-span-4 md:col-span-1 text-right">Actions</div>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredNotebooks.map((notebook) => (
                                    <div
                                        key={notebook._id}
                                        onClick={() => setSelectedNotebook(notebook)}
                                        className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors cursor-pointer group ${selectedNotebook?._id === notebook._id ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                            }`}
                                    >
                                        <div className="col-span-8 md:col-span-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#2d2d2d] flex items-center justify-center text-lg shadow-sm">
                                                {notebook.icon || '📚'}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-medium text-gray-900 dark:text-white truncate">{notebook.name}</h3>
                                                <p className="text-xs text-gray-500 truncate max-w-[150px]">{notebook.description}</p>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex col-span-3 flex-wrap gap-1">
                                            {notebook.tags?.slice(0, 3).map((tag, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#2d2d2d] text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="hidden lg:flex col-span-2 items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xs text-purple-600 dark:text-purple-400 font-medium border border-purple-200 dark:border-purple-800">
                                                A
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Akash</span>
                                        </div>
                                        <div className="hidden md:block col-span-2 text-sm text-gray-500">
                                            {format(new Date(notebook.updatedAt), 'MMM d, yyyy')}
                                        </div>
                                        <div className="col-span-4 md:col-span-1 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(notebook);
                                                }}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Side Panel */}
            {selectedNotebook && (
                <div className="w-full lg:w-auto h-full fixed inset-0 lg:static z-50 lg:z-auto bg-white dark:bg-[#1e1e1e]">
                    <NotebookDetailsPanel
                        notebook={selectedNotebook}
                        onClose={() => setSelectedNotebook(null)}
                        onUpdate={(id, data) => handleUpdateNotebook(id, data)}
                        onDelete={handleDeleteClick}
                        onCreateNote={onCreateNote}
                        notes={notes}
                        onSelectNote={onSelectNote}
                        onDuplicate={handleDuplicateNotebook}
                    />
                </div>
            )}

            <CreateNotebookModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingNotebook(null);
                }}
                onCreate={handleCreateNotebook}
                onUpdate={handleUpdateNotebook}
                notebookToEdit={editingNotebook}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setNotebookToDelete(null);
                }}
                onConfirm={confirmDeleteNotebook}
                itemName={notebookToDelete?.name}
                itemType="Notebook"
            />
        </div>
    );
};

export default NotebooksView;
