import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        // Removed strict enum to allow for custom categories from templates
        default: 'Other'
    },
    source: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['expense', 'income'],
        default: 'expense'
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurrenceInterval: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        required: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Expense', expenseSchema);
