import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tag name is required'],
            trim: true,
            maxlength: [30, 'Tag name cannot exceed 30 characters'],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        color: {
            type: String,
            default: '#6b7280', // Default gray
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure unique tag names per user
tagSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model('Tag', tagSchema);
