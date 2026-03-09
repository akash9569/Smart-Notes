import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { GripVertical, Trash2 } from 'lucide-react';

const TaskItemNode = ({ node, updateAttributes, deleteNode }) => {
    const isChecked = node.attrs.checked;

    return (
        <NodeViewWrapper className="group flex items-start space-x-2 my-1 relative">
            {/* Drag Handle */}
            <div
                className="drag-handle cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                contentEditable="false"
                draggable="true"
                data-drag-handle
            >
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Checkbox */}
            <div className="relative flex items-center justify-center mt-1" contentEditable="false">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => updateAttributes({ checked: e.target.checked })}
                    className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:bg-purple-500 checked:border-purple-500 cursor-pointer transition-colors"
                />
                {isChecked && (
                    <svg className="w-3 h-3 text-white absolute pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <NodeViewContent
                    as="div"
                    className={`outline-none ${isChecked ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'}`}
                />



            </div>

            {/* Delete Button */}
            <button
                onClick={deleteNode}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                contentEditable="false"
                title="Delete Task"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </NodeViewWrapper>
    );
};

export default TaskItemNode;
