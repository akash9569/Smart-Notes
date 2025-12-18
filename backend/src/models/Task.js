import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        completedDates: {
            type: [String], // ISO date string (YYYY-MM-DD)
            default: []
        },
        dueDate: {
            type: Date,
        },
        type: {
            type: String,
            enum: ['task', 'event'],
            default: 'task',
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        category: {
            type: String,
            enum: ['task', 'event', 'deadline', 'reminder', 'class', 'personal', 'work'],
            default: 'task',
        },
        color: {
            type: String,
            default: '#3B82F6', // Default blue
        },
        recurrence: {
            type: {
                type: String, // 'daily', 'weekly', 'monthly', 'yearly', 'custom'
                enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom', null],
            },
            interval: Number, // e.g., every 2 weeks
            days: [Number], // e.g., [1, 3] for Mon, Wed
            endDate: Date,
            applicableMonths: [Number], // Array of month numbers (1-12) to limit when task appears
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        description: {
            type: String,
            trim: true,
        },
        isFlagged: {
            type: Boolean,
            default: false,
        },
        reminder: {
            type: Date,
        },
        reminderSent: {
            type: Boolean,
            default: false,
        },
        assignedTo: {
            type: String, // Placeholder for now, could be ObjectId later
            default: '',
        },
        noteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note',
            default: null,
        },
        subtasks: [{
            title: {
                type: String,
                trim: true,
                required: true
            },
            completed: {
                type: Boolean,
                default: false
            }
        }],
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
taskSchema.index({ userId: 1, completed: 1, dueDate: 1 });

export default mongoose.model('Task', taskSchema);
