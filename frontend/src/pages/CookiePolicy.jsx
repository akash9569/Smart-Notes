import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import Footer from '../components/Footer';

const CookiePolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#121212] text-white relative flex flex-col font-sans overflow-x-hidden">
            {/* Header (Navbar) */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-[#121212]/80 backdrop-blur-md border-b border-gray-800 transition-all duration-300">
                <div className="w-full px-6 md:px-12 lg:px-20 h-20 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
                        <img src="/logo.png" alt="Smart Notes Logo" className="w-12 h-12 object-contain rounded-xl group-hover:scale-105 transition-transform shadow-lg" />
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300 drop-shadow-md">
                            Smart Notes
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                        <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
                        <Link to="/contact" className="hover:text-white transition-colors duration-200">Contact Us</Link>
                        <span className="text-indigo-400 font-semibold cursor-default">Cookie Policy</span>
                    </nav>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-indigo-500/30"
                    >
                        Login / Register
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow pt-28 pb-16 bg-[#09090b] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Page Header */}
                <div className="text-center mb-16 pt-6 relative z-10">
                    <span className="inline-block text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-3 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        Legal
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 mb-4 tracking-tight">
                        Cookie Policy
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Last updated: March 8, 2026
                    </p>
                </div>

                {/* Content */}
                <div className="w-full px-6 lg:px-12 xl:px-20 max-w-5xl mx-auto relative z-10">
                    <div className="bg-[#12161f] border border-gray-800/80 rounded-3xl p-8 lg:p-12 shadow-2xl space-y-10">

                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                    <Cookie className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-200">What Are Cookies?</h2>
                            </div>
                            <p className="text-slate-400 leading-relaxed">
                                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and to provide information to the site owners. Smart Notes App uses cookies and similar technologies to enhance your experience.
                            </p>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">1. Types of Cookies We Use</h2>
                            <div className="space-y-6">
                                <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-emerald-400 mb-2">✅ Essential Cookies</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        These cookies are strictly necessary for the operation of our application. They include cookies that enable you to log in, maintain your session via JWT tokens, and use secure areas of the app. Without these cookies, the services you have requested cannot be provided.
                                    </p>
                                </div>

                                <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-blue-400 mb-2">🔧 Functional Cookies</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        These cookies allow our app to remember choices you make (such as your preferred theme — light or dark mode, language preferences, and the "Remember Me" option on the login page) and provide enhanced, personalized features.
                                    </p>
                                </div>

                                <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-amber-400 mb-2">📊 Performance Cookies</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        These cookies collect anonymous information about how visitors use our app, such as which pages are visited most often. This data helps us improve the performance and user experience of Smart Notes. We do not use these cookies to personally identify you.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">2. Local Storage</h2>
                            <p className="text-slate-400 leading-relaxed">
                                In addition to cookies, Smart Notes App uses browser Local Storage to store:
                            </p>
                            <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2 ml-2">
                                <li><strong className="text-slate-300">Authentication Tokens:</strong> Access tokens and refresh tokens are stored in Local Storage to maintain your logged-in session securely.</li>
                                <li><strong className="text-slate-300">User Preferences:</strong> Your theme preference (dark/light mode) and UI settings are stored locally for a seamless experience across sessions.</li>
                                <li><strong className="text-slate-300">Remember Me Data:</strong> If you choose "Remember Me" on the login page, your email is saved locally to auto-fill on your next visit.</li>
                                <li><strong className="text-slate-300">Offline Data:</strong> When using the app in offline mode, your notes, expenses, and habits are cached locally until you reconnect.</li>
                            </ul>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">3. Third-Party Cookies</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Smart Notes App does <strong className="text-slate-300">not</strong> use third-party advertising cookies. We do not serve ads and we do not share your browsing data with advertising networks. However, if you access our social media links (GitHub, LinkedIn, Twitter, Instagram), those platforms may set their own cookies when you visit them.
                            </p>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">4. Managing Cookies</h2>
                            <p className="text-slate-400 leading-relaxed">
                                You can control and manage cookies in several ways. Most browsers allow you to:
                            </p>
                            <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2 ml-2">
                                <li>View what cookies are stored and delete them individually</li>
                                <li>Block third-party cookies</li>
                                <li>Block all cookies from all sites</li>
                                <li>Clear all cookies when you close the browser</li>
                            </ul>
                            <p className="text-slate-400 leading-relaxed mt-3">
                                <strong className="text-amber-400">⚠️ Please note:</strong> If you disable essential cookies, some features of Smart Notes App may not function properly, including login and session management.
                            </p>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">5. Updates to This Policy</h2>
                            <p className="text-slate-400 leading-relaxed">
                                We may update this Cookie Policy from time to time. Any changes will be posted on this page with a revised "Last updated" date. We encourage you to periodically review this page to stay informed about our use of cookies.
                            </p>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">6. Contact Us</h2>
                            <p className="text-slate-400 leading-relaxed">
                                If you have any questions about our use of cookies, please contact us:
                            </p>
                            <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-6 space-y-2">
                                <p className="text-slate-300">📧 Email: <a href="mailto:smartnotes95@gmail.com" className="text-indigo-400 hover:text-indigo-300">smartnotes95@gmail.com</a></p>
                                <p className="text-slate-300">📞 Phone: +91 95695 81233</p>
                                <p className="text-slate-300">🌐 Website: <Link to="/contact" className="text-indigo-400 hover:text-indigo-300">Contact Us Page</Link></p>
                            </div>
                        </section>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CookiePolicy;
