import Expense from '../models/Expense.js';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';

// Get all expenses for a user
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json({
            status: 'success',
            results: expenses.length,
            data: { expenses }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Create a new expense
export const createExpense = async (req, res) => {
    try {
        const newExpense = await Expense.create({
            ...req.body,
            user: req.user.id
        });

        res.status(201).json({
            status: 'success',
            data: { expense: newExpense }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!expense) {
            return res.status(404).json({
                status: 'fail',
                message: 'No expense found with that ID'
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

// Get expense statistics
export const getExpenseStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();

        // Date ranges
        const startOfToday = startOfDay(now);
        const endOfToday = endOfDay(now);
        const startOfThisWeek = startOfWeek(now);
        const endOfThisWeek = endOfWeek(now);
        const startOfThisMonth = startOfMonth(now);
        const endOfThisMonth = endOfMonth(now);

        // Fetch all transactions for the user
        const transactions = await Expense.find({ user: userId }).sort({ date: 1 });

        let totalIncome = 0;
        let totalExpenses = 0;
        let monthlyIncome = 0;
        let monthlyExpenses = 0;
        let dailySpending = 0;
        let weeklySpending = 0;

        // For Charts
        const incomeVsExpenseMap = {}; // date -> { income, expense }
        const categorySpending = {}; // category -> amount

        transactions.forEach(t => {
            const tDate = new Date(t.date);
            const amount = t.amount;
            const dateStr = format(tDate, 'yyyy-MM-dd');

            // Initialize chart data point if not exists
            if (!incomeVsExpenseMap[dateStr]) {
                incomeVsExpenseMap[dateStr] = { date: dateStr, income: 0, expense: 0 };
            }

            if (t.type === 'income') {
                totalIncome += amount;
                incomeVsExpenseMap[dateStr].income += amount;

                if (tDate >= startOfThisMonth && tDate <= endOfThisMonth) {
                    monthlyIncome += amount;
                }
            } else {
                totalExpenses += amount;
                incomeVsExpenseMap[dateStr].expense += amount;

                // Category Pie Data
                if (!categorySpending[t.category]) categorySpending[t.category] = 0;
                categorySpending[t.category] += amount;

                if (tDate >= startOfThisMonth && tDate <= endOfThisMonth) {
                    monthlyExpenses += amount;
                }
                if (tDate >= startOfThisWeek && tDate <= endOfThisWeek) {
                    weeklySpending += amount;
                }
                if (tDate >= startOfToday && tDate <= endOfToday) {
                    dailySpending += amount;
                }
            }
        });

        const totalBalance = totalIncome - totalExpenses;
        const remainingMonthlyBalance = monthlyIncome - monthlyExpenses;

        // Prepare Chart Arrays
        const incomeVsExpenseChart = Object.values(incomeVsExpenseMap).sort((a, b) => new Date(a.date) - new Date(b.date));

        // Balance Over Time (Cumulative)
        let runningBalance = 0;
        const balanceHistoryChart = incomeVsExpenseChart.map(day => {
            runningBalance += (day.income - day.expense);
            return { date: day.date, balance: runningBalance };
        });

        const categoryPieChart = Object.entries(categorySpending)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        res.status(200).json({
            status: 'success',
            data: {
                summary: {
                    totalBalance,
                    monthlyIncome,
                    monthlyExpenses,
                    dailySpending,
                    weeklySpending,
                    remainingMonthlyBalance
                },
                charts: {
                    incomeVsExpense: incomeVsExpenseChart,
                    balanceHistory: balanceHistoryChart,
                    categoryPie: categoryPieChart
                },
                recentTransactions: transactions.reverse().slice(0, 10) // Last 10
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
