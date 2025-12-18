import mongoose from 'mongoose';

const repaymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        trim: true
    }
});

const loanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['lent', 'borrowed'],
        required: true
    },
    person: {
        type: String,
        required: [true, 'Please add the person name'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add the loan amount'],
        min: 0
    },
    outstandingAmount: {
        type: Number,
        default: function () {
            return this.amount;
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'partially_paid', 'overdue'],
        default: 'pending'
    },
    category: {
        type: String,
        default: 'Personal'
    },
    description: {
        type: String,
        trim: true
    },
    repaymentHistory: [repaymentSchema]
}, {
    timestamps: true
});

// Calculate status based on outstanding amount and due date
loanSchema.pre('save', function (next) {
    if (this.outstandingAmount <= 0) {
        this.status = 'paid';
        this.outstandingAmount = 0;
    } else if (this.outstandingAmount < this.amount) {
        this.status = 'partially_paid';
    } else {
        this.status = 'pending';
    }

    if (this.dueDate && new Date() > this.dueDate && this.outstandingAmount > 0) {
        this.status = 'overdue';
    }

    next();
});

export default mongoose.model('Loan', loanSchema);
