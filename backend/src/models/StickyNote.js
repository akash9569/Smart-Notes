import mongoose from 'mongoose';

const stickyNoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    content: {
        type: mongoose.Schema.Types.Mixed, // String for text, Array for checklist
        default: ''
    },
    type: {
        type: String,
        enum: ['text', 'checklist', 'image'],
        default: 'text'
    },
    color: {
        type: String,
        default: '#feefc3' // Default yellow
    },
    style: {
        type: String,
        enum: ['basic', 'lined', 'grid', 'dot', 'rounded'],
        default: 'basic'
    },
    position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 }
    },
    dimension: {
        w: { type: Number, default: 200 },
        h: { type: Number, default: 200 }
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String
    }],
    images: [{
        type: String
    }]
}, {
    timestamps: true
});

const StickyNote = mongoose.model('StickyNote', stickyNoteSchema);

export default StickyNote;
