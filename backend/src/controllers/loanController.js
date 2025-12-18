import Loan from '../models/Loan.js';
import Expense from '../models/Expense.js';
import { startOfMonth, endOfMonth, format } from 'date-fns';

// Get all loans for a user
export const getLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json({
            status: 'success',
            results: loans.length,
            data: { loans }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Create a new loan
export const createLoan = async (req, res) => {
    try {
        const newLoan = await Loan.create({
            ...req.body,
            user: req.user.id
        });

        // Create corresponding transaction
        // If borrowed -> Income (money coming in)
        // If lent -> Expense (money going out)
        const transactionType = req.body.type === 'borrowed' ? 'income' : 'expense';
        const description = req.body.type === 'borrowed'
            ? `Borrowed from ${req.body.person}`
            : `Lent to ${req.body.person}`;

        await Expense.create({
            user: req.user.id,
            amount: Number(req.body.amount),
            category: 'Other', // Or a specific 'Loan' category if available
            description: description,
            date: req.body.date || new Date(),
            type: transactionType,
            source: 'Loan'
        });

        res.status(201).json({
            status: 'success',
            data: { loan: newLoan }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update a loan
export const updateLoan = async (req, res) => {
    try {
        const loan = await Loan.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!loan) {
            return res.status(404).json({
                status: 'fail',
                message: 'No loan found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { loan }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete a loan
export const deleteLoan = async (req, res) => {
    try {
        const loan = await Loan.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!loan) {
            return res.status(404).json({
                status: 'fail',
                message: 'No loan found with that ID'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Add repayment
export const addRepayment = async (req, res) => {
    try {
        const { amount, date, note } = req.body;
        const loan = await Loan.findOne({ _id: req.params.id, user: req.user.id });

        if (!loan) {
            return res.status(404).json({
                status: 'fail',
                message: 'No loan found with that ID'
            });
        }

        if (amount > loan.outstandingAmount) {
            return res.status(400).json({
                status: 'fail',
                message: 'Repayment amount cannot exceed outstanding amount'
            });
        }

        loan.repaymentHistory.push({ amount, date, note });
        loan.outstandingAmount -= amount;

        // Status update logic is handled in pre-save hook, but we need to save first
        await loan.save();

        // Create corresponding transaction for repayment
        // If borrowed (repaying) -> Expense (money going out)
        // If lent (receiving) -> Income (money coming in)
        const transactionType = loan.type === 'borrowed' ? 'expense' : 'income';
        const description = loan.type === 'borrowed'
            ? `Loan repayment to ${loan.person}`
            : `Loan repayment from ${loan.person}`;

        await Expense.create({
            user: req.user.id,
            amount: Number(amount),
            category: 'Other',
            description: description,
            date: date || new Date(),
            type: transactionType,
            source: 'Loan Repayment'
        });

        res.status(200).json({
            status: 'success',
            data: { loan }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get loan statistics
export const getLoanStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const loans = await Loan.find({ user: userId });

        let totalLent = 0;
        let totalBorrowed = 0;
        let totalLentOutstanding = 0;
        let totalBorrowedOutstanding = 0;
        let returnedThisMonth = 0;
        let paidBackThisMonth = 0;

        const now = new Date();
        const startOfThisMonth = startOfMonth(now);
        const endOfThisMonth = endOfMonth(now);

        loans.forEach(loan => {
            if (loan.type === 'lent') {
                totalLent += loan.amount;
                totalLentOutstanding += loan.outstandingAmount;
            } else {
                totalBorrowed += loan.amount;
                totalBorrowedOutstanding += loan.outstandingAmount;
            }

            // Calculate monthly repayments
            loan.repaymentHistory.forEach(rep => {
                const repDate = new Date(rep.date);
                if (repDate >= startOfThisMonth && repDate <= endOfThisMonth) {
                    if (loan.type === 'lent') {
                        returnedThisMonth += rep.amount;
                    } else {
                        paidBackThisMonth += rep.amount;
                    }
                }
            });
        });

        res.status(200).json({
            status: 'success',
            data: {
                totalLent,
                totalBorrowed,
                totalLentOutstanding,
                totalBorrowedOutstanding,
                returnedThisMonth,
                paidBackThisMonth
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
