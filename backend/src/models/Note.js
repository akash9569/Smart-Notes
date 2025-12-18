import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        content: {
            type: String,
            default: '',
        },
        plainText: {
            type: String,
            default: '',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        notebookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notebook',
            default: null,
        },
        tags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tag',
            },
        ],
        isPinned: {
            type: Boolean,
            default: false,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            default: '#ffffff',
        },
        sharedWith: [
            {
                email: {
                    type: String,
                    required: true,
                },
                permission: {
                    type: String,
                    enum: ['view', 'edit', 'comment', 'full'],
                    default: 'view',
                },
                addedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        isPublic: {
            type: Boolean,
            default: false,
        },
        isJournal: {
            type: Boolean,
            default: false,
            index: true,
        },
        isPrivate: {
            type: Boolean,
            default: false,
        },
        template: {
            type: String,
            default: 'blank',
        },
        templateConfig: {
            lineHeight: {
                type: Number,
                default: 32,
            },
            gridSize: {
                type: Number,
                default: 20,
            },
            colorVariant: {
                type: String,
                enum: ['default', 'cream', 'dark'],
                default: 'default',
            },
            customImage: {
                type: String,
                default: null,
            },
        },
        attachments: [
            {
                url: String,
                name: String,
                size: Number,
                type: String,
                publicId: String,
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        version: {
            type: Number,
            default: 1,
        },
        versions: [
            {
                content: String,
                savedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Text index for search functionality
noteSchema.index({ title: 'text', plainText: 'text' });

// Compound index for efficient queries
noteSchema.index({ userId: 1, updatedAt: -1 });
noteSchema.index({ userId: 1, isPinned: -1, updatedAt: -1 });

// Pre-save middleware to update version history
noteSchema.pre('save', function (next) {
    if (this.isModified('content') && !this.isNew) {
        this.versions.push({
            content: this.content,
            savedAt: new Date(),
        });

        // Keep only last 10 versions
        if (this.versions.length > 10) {
            this.versions = this.versions.slice(-10);
        }

        this.version += 1;
    }
    next();
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
