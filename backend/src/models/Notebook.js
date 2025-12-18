import mongoose from 'mongoose';

const notebookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Notebook name is required'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        cover: {
            type: String, // URL or gradient class
            default: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        },
        icon: {
            type: String, // Emoji or icon name
            default: '📚',
        },
        color: {
            type: String, // Accent color hex or class
            default: 'blue',
        },
        tags: [{
            type: String,
            trim: true,
        }],
        isFavorite: {
            type: Boolean,
            default: false,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure unique notebook names per user
notebookSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model('Notebook', notebookSchema);
