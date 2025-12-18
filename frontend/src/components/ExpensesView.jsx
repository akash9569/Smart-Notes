import React, { useState, useEffect } from 'react';
import {
    DollarSign, TrendingUp, TrendingDown, Calendar, PieChart, Plus, Trash2,
    Lightbulb, CreditCard, ArrowUpRight, ArrowDownRight, Wallet, Activity,
    MoreHorizontal, Filter, Users, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { expensesAPI, loansAPI } from '../api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

const ExpensesView = () => {
    const [loading, setLoading] = useState(true);
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

    const [activeTab, setActiveTab] = useState('monthly'); // daily, weekly, monthly
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [modalType, setModalType] = useState('expense'); // 'income', 'expense', 'lent', 'borrowed'

    // Loan Modal State
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [loanModalType, setLoanModalType] = useState('lent'); // 'lent', 'borrowed'

    // Form State
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceInterval, setRecurrenceInterval] = useState('monthly');

    // Loan Form State
    const [person, setPerson] = useState('');
    const [dueDate, setDueDate] = useState('');

    const expenseCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Education', 'Other'];
    const incomeCategories = ['Home', 'Salary', 'Freelancing', 'Investment', 'Bonus', 'Gift', 'Other'];

    const templates = [
        { name: 'Daily Coffee', amount: 30, category: 'Food', type: 'expense' },
        { name: 'Lunch', amount: 40, category: 'Food', type: 'expense' },
        { name: 'Groceries', amount: 100, category: 'Food', type: 'expense' },
        { name: 'Transport', amount: 20, category: 'Transport', type: 'expense' },
        { name: 'Home', amount: 5000, category: 'Home', type: 'income' },
    ];

    useEffect(() => {
        fetchData();
        fetchLoanData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await expensesAPI.getStats();
            setData(response.data.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const fetchLoanData = async () => {
        try {
            const [loansRes, statsRes] = await Promise.all([
                loansAPI.getLoans(),
                loansAPI.getStats()
            ]);
            setLoanData({
                loans: loansRes.data.data.loans,
                stats: statsRes.data.data
            });
        } catch (error) {
            console.error('Failed to fetch loan data', error);
        }
    };

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            await expensesAPI.createExpense({
                amount: Number(amount),
                category: category || (modalType === 'income' ? 'Home' : 'Other'),
                description,
                date,
                type: modalType,
                isRecurring,
                recurrenceInterval: isRecurring ? recurrenceInterval : null
            });
            toast.success(`${modalType === 'income' ? 'Income' : 'Expense'} added!`);
            setIsAddModalOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Failed to add transaction', error);
            toast.error('Failed to add transaction');
        }
    };

    const handleAddLoan = async (e) => {
        e.preventDefault();
        try {
            await loansAPI.createLoan({
                type: loanModalType,
                person,
                amount: Number(amount),
                date,
                dueDate: dueDate || null,
                category: 'Personal', // Default for now
                description
            });
            toast.success('Loan record added!');
            setIsLoanModalOpen(false);
            resetForm();
            fetchLoanData();
        } catch (error) {
            console.error('Failed to add loan', error);
            toast.error('Failed to add loan');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await expensesAPI.deleteExpense(id);
                toast.success('Transaction deleted');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const handleDeleteLoan = async (id) => {
        if (window.confirm('Are you sure you want to delete this loan record?')) {
            try {
                await loansAPI.deleteLoan(id);
                toast.success('Loan deleted');
                fetchLoanData();
            } catch (error) {
                toast.error('Failed to delete loan');
            }
        }
    };

    const handleRepayLoan = async (id, outstandingAmount) => {
        const repayAmount = prompt(`Enter repayment amount (Max: ₹${outstandingAmount})`);
        if (repayAmount) {
            try {
                await loansAPI.addRepayment(id, {
                    amount: Number(repayAmount),
                    note: 'Manual repayment entry'
                });
                toast.success('Repayment recorded');
                fetchLoanData();
            } catch (error) {
                toast.error('Failed to record repayment');
            }
        }
    };

    const resetForm = () => {
        setAmount('');
        setCategory('');
        setDescription('');
        setPerson('');
        setDueDate('');
        setDate(new Date().toISOString().split('T')[0]);
        setIsRecurring(false);
    };

    const openModal = (type) => {
        setModalType(type);
        setCategory(type === 'income' ? 'Home' : 'Food');
        setIsAddModalOpen(true);
    };

    const openLoanModal = (type) => {
        setLoanModalType(type);
        setIsLoanModalOpen(true);
    };

    const useTemplate = (template) => {
        setModalType(template.type);
        setAmount(template.amount);
        setCategory(template.category);
        setDescription(template.name);
        setIsAddModalOpen(true);
    };

    // Smart Insights Logic
    const getInsights = () => {
        const insights = [];
        const { monthlyIncome, monthlyExpenses, totalBalance } = data.summary;
        const { totalLentOutstanding, totalBorrowedOutstanding } = loanData.stats;

        if (monthlyExpenses > monthlyIncome) {
            insights.push({ icon: TrendingDown, color: 'text-red-500', text: "You've spent more than you earned this month." });
        } else if (monthlyExpenses > monthlyIncome * 0.8) {
            insights.push({ icon: Activity, color: 'text-orange-500', text: "You've used over 80% of your monthly income." });
        } else {
            insights.push({ icon: TrendingUp, color: 'text-emerald-500', text: "Great job! You're saving well this month." });
        }

        if (totalBalance < 0) {
            insights.push({ icon: Wallet, color: 'text-red-500', text: "Your total balance is negative." });
        }

        if (totalBorrowedOutstanding > 0) {
            insights.push({ icon: AlertCircle, color: 'text-orange-500', text: `You have ₹${totalBorrowedOutstanding} in pending borrowings.` });
        }
        if (totalLentOutstanding > 0) {
            insights.push({ icon: Users, color: 'text-blue-500', text: `You are owed ₹${totalLentOutstanding} from others.` });
        }

        return insights;
    };

    if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

    return (
        <div className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-[#121212] p-4 sm:p-6 lg:p-8 font-sans text-gray-900 dark:text-gray-100">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            Income & Expenses
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your financial health.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => openModal('income')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <Plus className="w-5 h-5" />
                            Add Money
                        </button>
                        <button
                            onClick={() => openModal('expense')}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-red-500/20"
                        >
                            <Plus className="w-5 h-5" />
                            Add Expense
                        </button>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-[#1e1e1e] dark:to-[#2d2d2d] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Wallet className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-gray-400 font-medium mb-1">Total Balance</p>
                            <h2 className="text-5xl font-bold mb-6">₹{data.summary.totalBalance.toFixed(2)}</h2>

                            <div className="grid grid-cols-3 gap-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1 bg-emerald-500/20 rounded-full">
                                            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <span className="text-sm text-gray-400">Monthly Income</span>
                                    </div>
                                    <p className="text-xl font-semibold">₹{data.summary.monthlyIncome.toFixed(2)}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1 bg-red-500/20 rounded-full">
                                            <ArrowDownRight className="w-4 h-4 text-red-400" />
                                        </div>
                                        <span className="text-sm text-gray-400">Monthly Expenses</span>
                                    </div>
                                    <p className="text-xl font-semibold">₹{data.summary.monthlyExpenses.toFixed(2)}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1 bg-blue-500/20 rounded-full">
                                            <Activity className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="text-sm text-gray-400">Remaining</span>
                                    </div>
                                    <p className="text-xl font-semibold">₹{data.summary.remainingMonthlyBalance.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Smart Insights */}
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#333] flex flex-col">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                            Smart Insights
                        </h3>
                        <div className="flex-1 space-y-4">
                            {getInsights().map((insight, idx) => (
                                <div key={idx} className="flex gap-3 items-start p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl">
                                    <insight.icon className={`w-5 h-5 ${insight.color} mt-0.5`} />
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{insight.text}</p>
                                </div>
                            ))}
                            {getInsights().length === 0 && (
                                <p className="text-sm text-gray-500">Not enough data for insights yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Loan Management Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Users className="w-6 h-6 text-indigo-500" />
                            Loans & Borrowings
                        </h2>
                        <div className="flex gap-3">
                            <button
                                onClick={() => openLoanModal('lent')}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                            >
                                <Plus className="w-5 h-5" />
                                Lend Money
                            </button>
                            <button
                                onClick={() => openLoanModal('borrowed')}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-orange-500/20"
                            >
                                <Plus className="w-5 h-5" />
                                Borrow Money
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-[#333]">
                            <p className="text-sm text-gray-500 mb-1">Total Lent (Outstanding)</p>
                            <h3 className="text-2xl font-bold text-blue-500">₹{loanData.stats.totalLentOutstanding.toFixed(2)}</h3>
                        </div>
                        <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-[#333]">
                            <p className="text-sm text-gray-500 mb-1">Total Borrowed (Outstanding)</p>
                            <h3 className="text-2xl font-bold text-orange-500">₹{loanData.stats.totalBorrowedOutstanding.toFixed(2)}</h3>
                        </div>
                        <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-[#333]">
                            <p className="text-sm text-gray-500 mb-1">Returned (This Month)</p>
                            <h3 className="text-2xl font-bold text-emerald-500">₹{loanData.stats.returnedThisMonth.toFixed(2)}</h3>
                        </div>
                        <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-[#333]">
                            <p className="text-sm text-gray-500 mb-1">Paid Back (This Month)</p>
                            <h3 className="text-2xl font-bold text-indigo-500">₹{loanData.stats.paidBackThisMonth.toFixed(2)}</h3>
                        </div>
                    </div>

                    {/* Loan List */}
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#333]">
                        <h3 className="text-lg font-bold mb-4">Active Loans</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-sm text-gray-500 border-b border-gray-100 dark:border-[#333]">
                                        <th className="py-3 font-medium">Person</th>
                                        <th className="py-3 font-medium">Type</th>
                                        <th className="py-3 font-medium">Amount</th>
                                        <th className="py-3 font-medium">Outstanding</th>
                                        <th className="py-3 font-medium">Due Date</th>
                                        <th className="py-3 font-medium">Status</th>
                                        <th className="py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-[#333]">
                                    {loanData.loans.map(loan => (
                                        <tr key={loan._id} className="group hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                                            <td className="py-4 font-medium">{loan.person}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${loan.type === 'lent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                    }`}>
                                                    {loan.type === 'lent' ? 'Lent' : 'Borrowed'}
                                                </span>
                                            </td>
                                            <td className="py-4">₹{loan.amount}</td>
                                            <td className="py-4 font-bold">₹{loan.outstandingAmount}</td>
                                            <td className="py-4 text-sm text-gray-500">
                                                {loan.dueDate ? format(new Date(loan.dueDate), 'MMM d, yyyy') : '-'}
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${loan.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                                    loan.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {loan.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right flex items-center justify-end gap-2">
                                                {loan.outstandingAmount > 0 && (
                                                    <button
                                                        onClick={() => handleRepayLoan(loan._id, loan.outstandingAmount)}
                                                        className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        {loan.type === 'lent' ? 'Mark Returned' : 'Mark Paid'}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteLoan(loan._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {loanData.loans.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="py-8 text-center text-gray-500">No active loans.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Analytics & Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#333]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold">Financial Analytics</h3>
                            <div className="flex bg-gray-100 dark:bg-[#2a2a2a] rounded-lg p-1">
                                {['daily', 'weekly', 'monthly'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition-all ${activeTab === tab
                                            ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.charts.incomeVsExpense}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="income" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="expense" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Pie Chart */}
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#333]">
                        <h3 className="text-lg font-bold mb-6">Spending by Category</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={data.charts.categoryPie}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.charts.categoryPie.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Transactions */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#333]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold">Recent Transactions</h3>
                            <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">View All</button>
                        </div>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {data.recentTransactions.map((t) => (
                                <div key={t._id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-2xl transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                            }`}>
                                            {t.type === 'income' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{t.description || t.category}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span>{format(new Date(t.date), 'MMM d, yyyy')}</span>
                                                <span>•</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${t.type === 'income' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}>{t.category}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`font-bold text-lg ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(t._id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {data.recentTransactions.length === 0 && (
                                <p className="text-center text-gray-500 py-8">No transactions yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Quick Add / Templates */}
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-[#333]">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-indigo-500" />
                            Quick Add
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {templates.map((template, index) => (
                                <button
                                    key={index}
                                    onClick={() => useTemplate(template)}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2a2a2a] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all group border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${template.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                                            }`}>
                                            {template.name.charAt(0)}
                                        </div>
                                        <span className="font-medium">{template.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                        ₹{template.amount}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Add Transaction Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-[#333] flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {modalType === 'income' ? <Plus className="w-6 h-6 text-emerald-500" /> : <Plus className="w-6 h-6 text-red-500" />}
                                Add {modalType === 'income' ? 'Income' : 'Expense'}
                            </h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <Trash2 className="w-5 h-5 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleAddTransaction} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#2a2a2a] text-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#2a2a2a] outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {(modalType === 'income' ? incomeCategories : expenseCategories).map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#2a2a2a] outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Description (Optional)</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#2a2a2a] outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder={modalType === 'income' ? "e.g. Home, Salary, Freelance" : "e.g. Lunch, Taxi"}
                                />
                            </div>

                            {modalType === 'expense' && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl">
                                    <input
                                        type="checkbox"
                                        id="recurring"
                                        checked={isRecurring}
                                        onChange={(e) => setIsRecurring(e.target.checked)}
                                        className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="recurring" className="text-sm font-medium cursor-pointer flex-1">Recurring Expense</label>
                                    {isRecurring && (
                                        <select
                                            value={recurrenceInterval}
                                            onChange={(e) => setRecurrenceInterval(e.target.value)}
                                            className="text-sm bg-transparent border-none focus:ring-0 text-indigo-600 font-medium"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    )}
                                </div>
                            )}

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl font-medium bg-gray-100 dark:bg-[#333] hover:bg-gray-200 dark:hover:bg-[#444] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`flex-1 px-4 py-3 rounded-xl font-medium text-white shadow-lg transition-all ${modalType === 'income'
                                        ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                                        : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                        }`}
                                >
                                    Save {modalType === 'income' ? 'Income' : 'Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Loan Modal */}
            {isLoanModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-[#333] flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Users className={`w-6 h-6 ${loanModalType === 'lent' ? 'text-blue-500' : 'text-orange-500'}`} />
                                {loanModalType === 'lent' ? 'Lend Money' : 'Borrow Money'}
                            </h2>
                            <button onClick={() => setIsLoanModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <Trash2 className="w-5 h-5 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleAddLoan} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Person Name</label>
                                <input
                                    type="text"
                                    required
                                    value={person}
                                    onChange={(e) => setPerson(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#2a2a2a] outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Rahul, SBI Bank"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#2a2a2a] text-xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#2a2a2a] outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Due Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#2a2a2a] outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Description / Note</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#2a2a2a] outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Emergency, EMI"
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsLoanModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl font-medium bg-gray-100 dark:bg-[#333] hover:bg-gray-200 dark:hover:bg-[#444] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`flex-1 px-4 py-3 rounded-xl font-medium text-white shadow-lg transition-all ${loanModalType === 'lent'
                                        ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'
                                        : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                                        }`}
                                >
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpensesView;
