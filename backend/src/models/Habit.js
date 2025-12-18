import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Habit name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        category: {
            type: String,
            enum: ['Health', 'Study', 'Fitness', 'Skills', 'Routine', 'Work', 'Mindfulness', 'Other'],
            default: 'Other',
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            default: 'daily',
        },
        days: {
            type: [String], // ['Mon', 'Tue', ...]
            default: [],
        },
        reminder: {
            type: String, // "08:00"
            default: null,
        },
        color: {
            type: String,
            default: '#10B981', // Emerald-500
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        completedDates: {
            type: [Date], // Stores dates when the habit was completed (normalized to midnight)
            default: [],
        },
        streak: {
            type: Number,
            default: 0,
        },
        longestStreak: {
            type: Number,
            default: 0,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
habitSchema.index({ userId: 1, isArchived: 1 });

export default mongoose.model('Habit', habitSchema);
