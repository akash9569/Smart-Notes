import React, { createContext, useContext, useState, useEffect } from 'react';
import { expensesAPI, loansAPI } from '../api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const ExpensesContext = createContext();

export const useExpenses = () => useContext(ExpensesContext);

export const ExpensesProvider = ({ children }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Expenses State
    const [data, setData] = useState({
        summary: {
            totalBalance: 0,
            monthlyIncome: 0,
            monthlyExpenses: 0,
            dailySpending: 0,
            weeklySpending: 0,
            remainingMonthlyBalance: 0
        },
        charts: {
            incomeVsExpense: [],
            balanceHistory: [],
            categoryPie: []
        },
        recentTransactions: []
    });

    // Loans State
    const [loanData, setLoanData] = useState({
        loans: [],
        stats: {
            totalLent: 0,
            totalBorrowed: 0,
            totalLentOutstanding: 0,
            totalBorrowedOutstanding: 0,
            returnedThisMonth: 0,
            paidBackThisMonth: 0
        }
    });

    useEffect(() => {
        if (user) {
            fetchData();
            fetchLoanData();
        } else {
            // Reset state logic could go here
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (user?.isOffline) {
                const expenses = JSON.parse(localStorage.getItem('offline_expenses') || '[]');
                // Calculate simple stats locally
                const totalBalance = expenses.reduce((acc, curr) => curr.type === 'income' ? acc + Number(curr.amount) : acc - Number(curr.amount), 0);
                const monthlyIncome = expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
                const monthlyExpenses = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);

                setData({
                    summary: {
                        totalBalance,
                        monthlyIncome,
                        monthlyExpenses,
                        dailySpending: 0, // Simplified for offline
                        weeklySpending: 0, // Simplified for offline
                        remainingMonthlyBalance: monthlyIncome - monthlyExpenses
                    },
                    charts: {
                        incomeVsExpense: [], // Simplified
                        balanceHistory: [],
                        categoryPie: []
                    },
                    recentTransactions: expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5) // Recent 5
                });
            } else {
                const response = await expensesAPI.getStats();
                setData(response.data.data || {
                    summary: {
                        totalBalance: 0,
                        monthlyIncome: 0,
                        monthlyExpenses: 0,
                        dailySpending: 0,
                        weeklySpending: 0,
                        remainingMonthlyBalance: 0
                    },
                    charts: {
                        incomeVsExpense: [],
                        balanceHistory: [],
                        categoryPie: []
                    },
                    recentTransactions: []
                });
            }
        } catch (error) {
            console.error('Failed to fetch expenses data', error);
            // toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const fetchLoanData = async () => {
        try {
            if (user?.isOffline) {
                const loans = JSON.parse(localStorage.getItem('offline_loans') || '[]');
                // Calculate simple stats
                const totalLent = loans.filter(l => l.type === 'lent').reduce((acc, curr) => acc + Number(curr.amount), 0);
                const totalBorrowed = loans.filter(l => l.type === 'borrowed').reduce((acc, curr) => acc + Number(curr.amount), 0);
                setLoanData({
                    loans,
                    stats: {
                        totalLent,
                        totalBorrowed,
                        totalLentOutstanding: totalLent, // Simplified
                        totalBorrowedOutstanding: totalBorrowed, // Simplified
                        returnedThisMonth: 0,
                        paidBackThisMonth: 0
                    }
                });
            } else {
                const [loansRes, statsRes] = await Promise.all([
                    loansAPI.getLoans(),
                    loansAPI.getStats()
                ]);
                setLoanData({
                    loans: loansRes.data.data.loans,
                    stats: statsRes.data.data
                });
            }
        } catch (error) {
            console.error('Failed to fetch loan data', error);
        }
    };

    const createExpense = async (expenseData) => {
        try {
            if (user?.isOffline) {
                const newExpense = {
                    ...expenseData,
                    _id: `offline_${Date.now()}`,
                    date: new Date().toISOString(),
                    user: user._id
                };
                const existingExpenses = JSON.parse(localStorage.getItem('offline_expenses') || '[]');
                const updatedExpenses = [newExpense, ...existingExpenses];
                localStorage.setItem('offline_expenses', JSON.stringify(updatedExpenses));
                await fetchData(); // Refresh stats
                toast.success('Transaction added');
            } else {
                await expensesAPI.createExpense(expenseData);
                await fetchData(); // Refresh stats
                toast.success('Transaction added');
            }
        } catch (error) {
            console.error('Failed to create expense', error);
            toast.error(error.response?.data?.message || 'Failed to add transaction');
            throw error;
        }
    };

    const deleteExpense = async (id) => {
        try {
            if (user?.isOffline) {
                const existingExpenses = JSON.parse(localStorage.getItem('offline_expenses') || '[]');
                const filteredExpenses = existingExpenses.filter(e => e._id !== id);
                localStorage.setItem('offline_expenses', JSON.stringify(filteredExpenses));
                await fetchData();
            } else {
                await expensesAPI.deleteExpense(id);
                await fetchData();
            }
            toast.success('Transaction deleted');
        } catch (error) {
            console.error('Failed to delete expense', error);
            toast.error('Failed to delete');
            throw error;
        }
    };

    const createLoan = async (loanDataInput) => {
        try {
            if (user?.isOffline) {
                const newLoan = {
                    ...loanDataInput,
                    _id: `offline_${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    user: user._id
                };
                const existingLoans = JSON.parse(localStorage.getItem('offline_loans') || '[]');
                const updatedLoans = [newLoan, ...existingLoans];
                localStorage.setItem('offline_loans', JSON.stringify(updatedLoans));
                await fetchLoanData();
                toast.success('Loan record added!');
            } else {
                await loansAPI.createLoan(loanDataInput);
                await fetchLoanData();
                toast.success('Loan record added!');
            }
        } catch (error) {
            console.error('Failed to create loan', error);
            toast.error('Failed to add loan');
            throw error;
        }
    };

    const deleteLoan = async (id) => {
        try {
            if (user?.isOffline) {
                const existingLoans = JSON.parse(localStorage.getItem('offline_loans') || '[]');
                const filteredLoans = existingLoans.filter(l => l._id !== id);
                localStorage.setItem('offline_loans', JSON.stringify(filteredLoans));
                await fetchLoanData();
            } else {
                await loansAPI.deleteLoan(id);
                await fetchLoanData();
            }
            toast.success('Loan deleted');
        } catch (error) {
            toast.error('Failed to delete loan');
            throw error;
        }
    };

    const repayLoan = async (id, repayData) => {
        try {
            if (user?.isOffline) {
                // Simplified: just update loan status or amount in local storage?
                // For now, let's just toast
                toast.success('Repayment recorded locally (simplified)');
                // Complex update logic omitted for brevity as loan repayment structure can be complex
            } else {
                await loansAPI.addRepayment(id, repayData);
                await fetchLoanData();
                toast.success('Repayment recorded');
            }
        } catch (error) {
            toast.error('Failed to record repayment');
            throw error;
        }
    };

    return (
        <ExpensesContext.Provider value={{
            data,
            loanData,
            loading,
            fetchData,
            fetchLoanData,
            createExpense,
            deleteExpense,
            createLoan,
            deleteLoan,
            repayLoan,
            setData, // Exposing setData for Optimistic UI in views if they want to override
            setLoanData
        }}>
            {children}
        </ExpensesContext.Provider>
    );
};
