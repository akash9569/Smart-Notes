import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, X, Mail, Lock, Eye, EyeOff, User, MapPin, Phone, Send, Twitter, Github, Linkedin, Instagram, ArrowRight, Zap, Target, Shield, Heart, CheckCircle2, Star, Sparkles, TrendingUp } from 'lucide-react';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Landing = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

    // Scroll handlers
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <div className="min-h-screen bg-[#121212] text-white relative flex flex-col font-sans overflow-x-hidden">
                {/* Header (Navbar) */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-[#121212]/80 backdrop-blur-md border-b border-gray-800 transition-all duration-300">
                    <div className="w-full px-6 md:px-12 lg:px-10 h-20 flex justify-between items-center">
                        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => scrollToSection('home')}>
                            <img src="/logo.png" alt="Smart Notes Logo" className="w-12 h-12 object-contain rounded-xl group-hover:scale-105 transition-transform shadow-lg" />
                            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-300 to-slate-400">
                                Smart Notes
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                            <button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors duration-200">Home</button>
                            <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors duration-200">Features</button>
                            <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors duration-200">About Us</button>
                            <Link to="/contact" className="hover:text-white transition-colors duration-200">Contact Us</Link>
                        </nav>

                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-indigo-500/30"
                        >
                            Login / Register
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-grow pt-20">
                    {/* Hero section */}
                    <section id="home" className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 overflow-hidden pt-24 pb-16">
                        {/* Background Gradients */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[8s] opacity-30"></div>
                            <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[150px] mix-blend-screen opacity-30"></div>
                            <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-slate-800/20 rounded-full blur-[120px] mix-blend-screen"></div>
                        </div>

                        <div className="relative z-10 max-w-5xl mx-auto text-center">
                            {/* Badge */}
                            <div className="inline-flex items-center space-x-2 bg-[#1a1f2e]/80 border border-indigo-500/30 rounded-full px-5 py-2 mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                <span className="text-sm font-semibold text-indigo-200 tracking-wide">Notes · Tasks · Habits · Expenses · Journals · AI Assistant</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[1.1] text-slate-200">
                                The smart workspace<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm">
                                    for your entire life.
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
                                Smart Notes unifies <strong className="text-slate-300">rich text notes</strong>, <strong className="text-slate-300">expense & loan tracking</strong>, <strong className="text-slate-300">habit building</strong>, <strong className="text-slate-300">task calendars</strong>, <strong className="text-slate-300">daily journals</strong>, and an <strong className="text-slate-300">AI writing assistant</strong> — all in one dark-mode workspace.
                            </p>

                            {/* Feature Pills */}
                            <div className="flex flex-wrap justify-center gap-2 mb-10">
                                {[
                                    { label: '📝 Rich Text Editor', color: 'bg-slate-800/50 text-slate-300 border-slate-700/50' },
                                    { label: '🤖 AI Chatbot', color: 'bg-slate-800/50 text-slate-300 border-slate-700/50' },
                                    { label: '💰 Expense Tracker', color: 'bg-slate-800/50 text-slate-300 border-slate-700/50' },
                                    { label: '✅ Task Manager', color: 'bg-slate-800/50 text-slate-300 border-slate-700/50' },
                                    { label: '🔥 Habit Streaks', color: 'bg-slate-800/50 text-slate-300 border-slate-700/50' },
                                    { label: '📔 Daily Journal', color: 'bg-slate-800/50 text-slate-300 border-slate-700/50' },
                                    { label: '📅 Calendar View', color: 'bg-slate-800/50 text-slate-300 border-slate-700/50' },
                                    { label: '🗒️ Sticky Notes', color: 'bg-slate-800/50 text-slate-300 border-slate-700/50' },
                                ].map(({ label, color }) => (
                                    <span key={label} className={`text-xs font-medium border px-3 py-1 rounded-full ${color}`}>{label}</span>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center items-center mb-12">
                                <button
                                    onClick={() => setShowSignupModal(true)}
                                    className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-lg hover:scale-105 duration-200 flex items-center justify-center space-x-2"
                                >
                                    <span>Get Started Free</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => scrollToSection('features')}
                                    className="w-full sm:w-auto bg-[#1a1f2e] text-white border border-gray-700 hover:border-gray-500 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200"
                                >
                                    Explore Features
                                </button>
                            </div>

                            {/* Social Proof / Stats Row */}
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 text-sm text-gray-500 border-t border-gray-800 pt-8">
                                <div className="flex items-center space-x-2">
                                    <BookOpen className="w-4 h-4 text-indigo-400" />
                                    <span><strong className="text-gray-300">7 powerful tools</strong> in 1 app</span>
                                </div>
                                <div className="hidden sm:block w-px h-5 bg-gray-700"></div>
                                <div className="flex items-center space-x-2">
                                    <Shield className="w-4 h-4 text-emerald-400" />
                                    <span><strong className="text-gray-300">JWT-secured</strong> private data</span>
                                </div>
                                <div className="hidden sm:block w-px h-5 bg-gray-700"></div>
                                <div className="flex items-center space-x-2">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                    <span><strong className="text-gray-300">AI-powered</strong> writing assistant</span>
                                </div>
                                <div className="hidden sm:block w-px h-5 bg-gray-700"></div>
                                <div className="flex items-center space-x-2">
                                    <Zap className="w-4 h-4 text-amber-400" />
                                    <span><strong className="text-gray-300">100% free</strong> to get started</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section - Bento Box Style */}
                    <section id="features" className="py-16 bg-[#09090b] relative z-20 border-t border-gray-900/50">
                        <div className="w-full px-6 lg:px-12 xl:px-20">
                            <div className="text-center mb-10 max-w-3xl mx-auto">
                                <h2 className="text-indigo-500 font-semibold tracking-wide uppercase mb-2 text-sm drop-shadow-sm">Everything in One Place</h2>
                                <h3 className="text-3xl md:text-4xl font-bold text-slate-200 mb-3">Your complete productivity OS</h3>
                                <p className="text-base text-gray-400">Smart Notes replaces 6 different apps. Capture, track, plan, and reflect — all from a single beautiful workspace.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                {/* Feature 1 - Rich Text Notes (Large) */}
                                <div className="md:col-span-2 bg-gradient-to-br from-[#161b22] to-[#0d1117] p-5 lg:p-6 rounded-2xl border border-gray-800 hover:border-indigo-500/30 transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
                                    <div className="relative z-10">
                                        <div className="bg-indigo-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3 border border-indigo-500/30">
                                            <BookOpen className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-200 mb-2">Rich Text Notes & Notebooks</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                                            Full-featured rich text editor with headings, tables, images, video embeds, code blocks, and checklists. Organise into Notebooks with tags, colours, and emoji.
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {['Rich Editor', 'Notebooks', 'Tags', 'Templates', 'Image Gallery', 'Sticky Notes'].map(t => (
                                                <span key={t} className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Feature 2 - AI Assistant */}
                                <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] p-5 lg:p-6 rounded-2xl border border-gray-800 hover:border-purple-500/30 transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
                                    <div className="relative z-10">
                                        <div className="bg-purple-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3 border border-purple-500/30">
                                            <Sparkles className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-200 mb-2">AI Writing Assistant</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Built-in AI chatbot and AI menu inside the editor. Summarise, rewrite, expand, or brainstorm — powered by OpenAI.
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {['AI Chatbot', 'AI Menu', 'OpenAI'].map(t => (
                                                <span key={t} className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Feature 3 - Expense Tracker */}
                                <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] p-5 lg:p-6 rounded-2xl border border-gray-800 hover:border-emerald-500/30 transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
                                    <div className="relative z-10">
                                        <div className="bg-emerald-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3 border border-emerald-500/30">
                                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-200 mb-2">Expense & Loan Tracker</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Log expenses, categorise spending, manage loans with repayment schedules, and see insightful charts of where your money goes.
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {['Expenses', 'Loans', 'Analytics', 'Charts'].map(t => (
                                                <span key={t} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Feature 4 - Tasks & Calendar (Large) */}
                                <div className="md:col-span-2 bg-gradient-to-br from-[#161b22] to-[#0d1117] p-5 lg:p-6 rounded-2xl border border-gray-800 hover:border-blue-500/30 transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
                                    <div className="relative z-10 flex items-start space-x-4">
                                        <div className="bg-blue-500/20 w-10 h-10 rounded-xl flex items-center justify-center border border-blue-500/30 flex-shrink-0">
                                            <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-200 mb-2">Task Manager + Calendar & Timeline</h4>
                                            <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                                                Create tasks with priorities, due dates, and subtasks. Switch between Calendar, Timeline, and list views for daily tracking and project planning.
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {['Tasks', 'Subtasks', 'Calendar View', 'Timeline View', 'Priorities', 'Due Dates'].map(t => (
                                                    <span key={t} className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Feature 5 - Habit Tracker */}
                                <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] p-5 lg:p-6 rounded-2xl border border-gray-800 hover:border-pink-500/30 transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all"></div>
                                    <div className="relative z-10">
                                        <div className="bg-pink-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3 border border-pink-500/30">
                                            <Target className="w-5 h-5 text-pink-400" />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-200 mb-2">Habit Builder</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Build daily habits with streak counters, completion rings, and weekly progress heatmaps. Stay consistent and motivated.
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {['Streaks', 'Heatmap', 'Daily Check-ins'].map(t => (
                                                <span key={t} className="text-xs bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded-full">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Feature 6 - Journals */}
                                <div className="md:col-span-2 bg-gradient-to-br from-[#161b22] to-[#0d1117] p-5 lg:p-6 rounded-2xl border border-gray-800 hover:border-amber-500/30 transition-all group overflow-hidden relative">
                                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all"></div>
                                    <div className="relative z-10">
                                        <div className="bg-amber-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3 border border-amber-500/30">
                                            <Zap className="w-5 h-5 text-amber-400" />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-200 mb-2">Daily Journal & Reflection</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                                            Write daily journal entries in a clean, distraction-free interface. Reflect on your day, set intentions, and build a personal archive of your growth.
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {['Daily Entries', 'Mood Tracking', 'Reflections', 'Private Archive'].map(t => (
                                                <span key={t} className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Feature 7 - Security */}
                                <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] p-5 lg:p-6 rounded-2xl border border-gray-800 hover:border-slate-500/30 transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-slate-500/10 rounded-full blur-3xl group-hover:bg-slate-500/15 transition-all"></div>
                                    <div className="relative z-10">
                                        <div className="bg-slate-500/20 w-10 h-10 rounded-xl flex items-center justify-center mb-3 border border-slate-500/30">
                                            <Shield className="w-5 h-5 text-slate-300" />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-200 mb-2">Secure & Private</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            JWT authentication with refresh tokens and bcrypt-hashed passwords. Your notes, journals, and financial data stay private — always.
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {['JWT Auth', 'Encrypted', 'Private'].map(t => (
                                                <span key={t} className="text-xs bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2 py-0.5 rounded-full">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* About Us redesigned */}
                    <section id="about" className="py-32 bg-[#12141a] relative overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute -left-40 top-20 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
                        <div className="absolute -right-40 bottom-20 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl"></div>

                        <div className="w-full px-6 lg:px-12 xl:px-20 relative z-10">
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                {/* Left Side text */}
                                <div className="space-y-8">
                                    <div className="inline-flex items-center space-x-2 bg-purple-500/10 text-purple-400 rounded-full px-4 py-1.5 font-medium text-sm border border-purple-500/20">
                                        <BookOpen className="w-4 h-4" />
                                        <span>About Smart Notes</span>
                                    </div>
                                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-200 leading-tight">
                                        One app to run your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">entire life.</span>
                                    </h2>
                                    <p className="text-xl text-gray-400 leading-relaxed font-light">
                                        Smart Notes was born from a simple frustration: why juggle five different apps to manage your day? Notes, tasks, expenses, habits, journals — all scattered across different tools.
                                    </p>
                                    <p className="text-xl text-gray-400 leading-relaxed font-light">
                                        We built a unified, AI-powered workspace that brings everything together — a rich text editor, expense & loan tracker, habit builder, calendar, sticky notes, and an AI assistant, all in one elegant dark-mode app.
                                    </p>
                                    <div className="pt-2">
                                        <button onClick={() => setShowLoginModal(true)} className="flex items-center space-x-2 text-white font-semibold hover:text-purple-400 transition-colors group">
                                            <span>Start for free today</span>
                                            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                {/* Right Side Cards — real project features */}
                                <div className="relative space-y-5">
                                    <div className="bg-[#1a1f2e] border border-gray-700/50 p-6 rounded-2xl shadow-xl transform translate-x-4 lg:translate-x-8 hover:-translate-y-1 transition-transform">
                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="p-2 bg-indigo-500/20 rounded-lg"><Sparkles className="w-5 h-5 text-indigo-400" /></div>
                                            <h4 className="text-white font-semibold text-lg">AI-Powered Notes</h4>
                                        </div>
                                        <p className="text-gray-400 text-sm">A full rich text editor with AI writing assistance, image galleries, page templates, tagging, and notebook organisation — everything a power user needs.</p>
                                    </div>

                                    <div className="bg-[#1a1f2e] border border-gray-700/50 p-6 rounded-2xl shadow-xl transform -translate-x-4 lg:-translate-x-8 hover:-translate-y-1 transition-transform relative z-10">
                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="p-2 bg-green-500/20 rounded-lg"><TrendingUp className="w-5 h-5 text-green-400" /></div>
                                            <h4 className="text-white font-semibold text-lg">Track Every Habit & Expense</h4>
                                        </div>
                                        <p className="text-gray-400 text-sm">Built-in expense tracker with loan management, daily habit streaks, task management with timeline & calendar views — your full productivity suite in one place.</p>
                                    </div>

                                    <div className="bg-[#1a1f2e] border border-gray-700/50 p-6 rounded-2xl shadow-xl transform translate-x-0 lg:translate-x-4 hover:-translate-y-1 transition-transform">
                                        <div className="flex items-center space-x-4 mb-3">
                                            <div className="p-2 bg-pink-500/20 rounded-lg"><Shield className="w-5 h-5 text-pink-400" /></div>
                                            <h4 className="text-white font-semibold text-lg">Private & Secure by Design</h4>
                                        </div>
                                        <p className="text-gray-400 text-sm">JWT-secured authentication with encrypted storage. Your notes, journals, and financial data are yours alone — no ads, no data selling, ever.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Shared Footer */}
                <Footer onGetStarted={() => setShowLoginModal(true)} />
            </div >

            {/* Login Modal Overlay */}
            {
                showLoginModal && (
                    <LoginModal
                        onClose={() => setShowLoginModal(false)}
                        onSwitchToSignup={() => {
                            setShowLoginModal(false);
                            setShowSignupModal(true);
                        }}
                        onSwitchToForgotPassword={() => {
                            setShowLoginModal(false);
                            setShowForgotPasswordModal(true);
                        }}
                    />
                )
            }
            {
                showSignupModal && (
                    <SignupModal
                        onClose={() => setShowSignupModal(false)}
                        onSwitchToLogin={() => {
                            setShowSignupModal(false);
                            setShowLoginModal(true);
                        }}
                    />
                )
            }
            {
                showForgotPasswordModal && (
                    <ForgotPasswordModal
                        onClose={() => setShowForgotPasswordModal(false)}
                        onSwitchToLogin={() => {
                            setShowForgotPasswordModal(false);
                            setShowLoginModal(true);
                        }}
                        onSwitchToSignup={() => {
                            setShowForgotPasswordModal(false);
                            setShowSignupModal(true);
                        }}
                    />
                )
            }
        </>
    );
};

// Reusable Login Modal Component integrated into the landing page
const LoginModal = ({ onClose, onSwitchToSignup, onSwitchToForgotPassword }) => {
    const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedEmail'));
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            await login(email, password);
            navigate('/');
            toast.success('Welcome back!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-[#0f111a]/80 w-full max-w-md rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10 p-8 pt-10 text-left animate-in fade-in zoom-in duration-300 backdrop-blur-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-slate-200 transition-colors bg-white/5 hover:bg-white/10 rounded-full p-1 z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8 text-center sm:text-left relative z-10">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-sm text-slate-400 font-medium">Sign in to continue to your dashboard</p>
                </div>

                <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5 pl-1">
                            Email address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-11 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3.5 transition-all outline-none placeholder-slate-500 shadow-inner"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5 pl-1">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-11 pr-10 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3.5 transition-all outline-none placeholder-slate-500 shadow-inner"
                                placeholder="Min. 8 characters"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-500 hover:text-gray-300 focus:outline-none transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <input
                                    id="modal-remember-me"
                                    name="modal-remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-indigo-500 focus:ring-2 focus:ring-indigo-500 border-gray-600 rounded bg-[#0f111a] cursor-pointer"
                                />
                                <label htmlFor="modal-remember-me" className="ml-2 block text-sm text-slate-300 cursor-pointer select-none">
                                    Remember me
                                </label>
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={onSwitchToForgotPassword} className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                                    Forgot Password?
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Sign In
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400 border-t border-white/10 pt-6 relative z-10">
                    New to Smart Notes?{' '}
                    <button onClick={onSwitchToSignup} className="font-bold text-white hover:text-indigo-300 transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                        Create an account
                    </button>
                </div>
            </div>
        </div>
    );
};

// Reusable Signup Modal Component integrated into the landing page
const SignupModal = ({ onClose, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(name, email, password);
            navigate('/');
            toast.success('Account created successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-[#0f111a]/80 w-full max-w-md rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10 p-8 pt-10 text-left animate-in fade-in zoom-in duration-300 backdrop-blur-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-slate-200 transition-colors bg-white/5 hover:bg-white/10 rounded-full p-1 z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8 text-center sm:text-left relative z-10">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2 tracking-tight">Create your account</h2>
                    <p className="text-sm text-slate-400 font-medium">Join the ultimate workspace</p>
                </div>

                <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5 pl-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full pl-11 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3.5 transition-all outline-none placeholder-slate-500 shadow-inner"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5 pl-1">
                            Email address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-11 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3.5 transition-all outline-none placeholder-slate-500 shadow-inner"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5 pl-1">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-11 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3.5 transition-all outline-none placeholder-slate-500 shadow-inner"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Create Account
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400 border-t border-white/10 pt-6 relative z-10">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="font-bold text-white hover:text-indigo-300 transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
};

// Reusable Forgot Password Modal Component integrated into the landing page
const ForgotPasswordModal = ({ onClose, onSwitchToLogin, onSwitchToSignup }) => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { sendOtp, verifyOtp, resetPassword } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await sendOtp(email);
            toast.success('OTP sent to your email.');
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP email');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await verifyOtp(email, otp);
            toast.success('OTP verified successfully.');
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setIsSubmitting(true);
        try {
            await resetPassword(email, otp, newPassword);
            toast.success('Password reset and logged in successfully!');
            onClose(); // Close modal, user is now logged in
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-[#0f111a]/80 w-full max-w-md rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10 p-8 pt-10 text-left animate-in fade-in zoom-in duration-300 backdrop-blur-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-slate-200 transition-colors bg-white/5 hover:bg-white/10 rounded-full p-1 z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-8 text-center sm:text-left relative z-10">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2 tracking-tight">
                        {step === 1 ? 'Reset Password' : step === 2 ? 'Verify OTP' : 'New Password'}
                    </h2>
                    <p className="text-sm text-slate-400 font-medium">
                        {step === 1 ? 'Enter your email to receive an OTP' : step === 2 ? 'Enter the 6-digit code sent to your email' : 'Create a new secure password'}
                    </p>
                </div>

                {step === 1 && (
                    <form className="space-y-5 relative z-10" onSubmit={handleEmailSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5 pl-1">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3.5 transition-all outline-none placeholder-slate-500 shadow-inner"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 transform ${isSubmitting ? 'opacity-70 cursor-not-allowed border border-white/20' : 'hover:-translate-y-1'}`}
                            >
                                {isSubmitting ? 'Sending...' : 'Send OTP'}
                            </button>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form className="space-y-5 relative z-10" onSubmit={handleOtpSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5 pl-1">
                                6-Digit OTP
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Shield className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="block w-full pl-11 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3.5 transition-all outline-none placeholder-slate-500 shadow-inner tracking-widest text-xl font-bold"
                                    placeholder="123456"
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                                    Change Email
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || otp.length !== 6}
                                className={`w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 transform ${isSubmitting || otp.length !== 6 ? 'opacity-70 cursor-not-allowed border border-white/20' : 'hover:-translate-y-1'}`}
                            >
                                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form className="space-y-5 relative z-10" onSubmit={handlePasswordSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5 pl-1">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength="6"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="block w-full pl-11 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3.5 transition-all outline-none placeholder-slate-500 shadow-inner"
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5 pl-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength="6"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-11 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3.5 transition-all outline-none placeholder-slate-500 shadow-inner"
                                    placeholder="Re-enter password"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 transform ${isSubmitting ? 'opacity-70 cursor-not-allowed border border-white/20' : 'hover:-translate-y-1'}`}
                            >
                                {isSubmitting ? 'Resetting...' : 'Reset & Login'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-8 text-center text-sm text-slate-400 border-t border-white/10 pt-6 relative z-10">
                    <button onClick={onSwitchToLogin} className="hover:text-indigo-300 transition-colors mx-2">
                        Back to Login
                    </button>
                    <span className="text-gray-600">|</span>
                    <button onClick={onSwitchToSignup} className="hover:text-indigo-300 transition-colors mx-2">
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;
