import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
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
                        <span className="text-indigo-400 font-semibold cursor-default">Privacy Policy</span>
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
                        Privacy Policy
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
                                    <Shield className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-200">Introduction</h2>
                            </div>
                            <p className="text-slate-400 leading-relaxed">
                                Smart Notes App ("we", "our", or "us") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application and services.
                            </p>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">1. Information We Collect</h2>
                            <div className="space-y-3 text-slate-400 leading-relaxed">
                                <p><strong className="text-slate-300">Personal Information:</strong> When you create an account, we collect your name, email address, and password (stored securely using industry-standard hashing).</p>
                                <p><strong className="text-slate-300">Usage Data:</strong> We automatically collect information about how you interact with our app, including notes created, expenses tracked, habits logged, and tasks managed. This data is tied to your account and is used solely to provide you with our services.</p>
                                <p><strong className="text-slate-300">Device Information:</strong> We may collect information about the device you use to access our services, including browser type, operating system, and screen resolution, for optimization purposes.</p>
                                <p><strong className="text-slate-300">Cookies & Local Storage:</strong> We use cookies and local storage to maintain your session, remember your preferences (such as dark mode and "Remember Me"), and improve your experience.</p>
                            </div>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">2. How We Use Your Information</h2>
                            <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2 ml-2">
                                <li>To provide, operate, and maintain our services</li>
                                <li>To manage your account and provide customer support</li>
                                <li>To personalize your experience and deliver relevant features</li>
                                <li>To send you important notifications, such as OTP verification emails and password reset links</li>
                                <li>To monitor and analyze usage patterns to improve our app</li>
                                <li>To protect against fraudulent or unauthorized activity</li>
                            </ul>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">3. Data Sharing & Third Parties</h2>
                            <p className="text-slate-400 leading-relaxed">
                                We do <strong className="text-slate-300">not</strong> sell, rent, or trade your personal information to third parties. We may share your data only in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2 ml-2">
                                <li><strong className="text-slate-300">Service Providers:</strong> We use trusted third-party services (e.g., email delivery via Nodemailer/Gmail SMTP) to operate our platform. These providers only access your data as needed to perform their tasks.</li>
                                <li><strong className="text-slate-300">Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.</li>
                            </ul>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">4. Data Security</h2>
                            <p className="text-slate-400 leading-relaxed">
                                We implement industry-standard security measures to protect your data. Passwords are hashed using bcrypt before storage. Authentication is managed via JSON Web Tokens (JWT). However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">5. Your Rights</h2>
                            <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2 ml-2">
                                <li><strong className="text-slate-300">Access & Update:</strong> You can view and update your personal information from the Settings page within the app.</li>
                                <li><strong className="text-slate-300">Data Deletion:</strong> You may request deletion of your account and all associated data by contacting us at smartnotes95@gmail.com.</li>
                                <li><strong className="text-slate-300">Withdraw Consent:</strong> You can withdraw consent at any time by deleting your account.</li>
                            </ul>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">6. Data Retention</h2>
                            <p className="text-slate-400 leading-relaxed">
                                We retain your personal data for as long as your account is active or as needed to provide you services. If you delete your account, we will remove your data from our active databases within 30 days.
                            </p>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">7. Contact Us</h2>
                            <p className="text-slate-400 leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us:
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

export default PrivacyPolicy;
