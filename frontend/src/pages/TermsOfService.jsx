import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Footer from '../components/Footer';

const TermsOfService = () => {
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
                        <span className="text-indigo-400 font-semibold cursor-default">Terms of Service</span>
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
                        Terms of Service
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
                                    <FileText className="w-5 h-5 text-indigo-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-200">Agreement to Terms</h2>
                            </div>
                            <p className="text-slate-400 leading-relaxed">
                                By accessing or using Smart Notes App, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access or use our services. These terms apply to all visitors, users, and others who access or use the service.
                            </p>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">1. User Accounts</h2>
                            <div className="space-y-3 text-slate-400 leading-relaxed">
                                <p>When you create an account with us, you must provide accurate, complete, and up-to-date information. Failure to do so constitutes a breach of these Terms.</p>
                                <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>
                                <p>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
                            </div>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">2. Acceptable Use</h2>
                            <p className="text-slate-400 leading-relaxed">You agree not to use Smart Notes App to:</p>
                            <ul className="list-disc list-inside text-slate-400 leading-relaxed space-y-2 ml-2">
                                <li>Violate any applicable laws or regulations</li>
                                <li>Transmit any content that is unlawful, harmful, threatening, abusive, or otherwise objectionable</li>
                                <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity</li>
                                <li>Interfere with or disrupt the service or servers or networks connected to the service</li>
                                <li>Attempt to gain unauthorized access to any portion of the service or any other systems or networks</li>
                                <li>Use bots, scrapers, or automated tools to access the service without our written permission</li>
                            </ul>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">3. Intellectual Property</h2>
                            <p className="text-slate-400 leading-relaxed">
                                The service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Smart Notes App and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service without prior written consent.
                            </p>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">4. User Content</h2>
                            <div className="space-y-3 text-slate-400 leading-relaxed">
                                <p>You retain ownership of all content you create in Smart Notes App, including notes, journals, expense records, habit data, and task lists. We do not claim any ownership rights over your content.</p>
                                <p>By using our service, you grant us a limited license to store, process, and display your content solely for the purpose of providing and improving our services to you.</p>
                            </div>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">5. Service Availability</h2>
                            <p className="text-slate-400 leading-relaxed">
                                We strive to maintain high availability of the service, but we do not guarantee that the service will be uninterrupted, timely, secure, or error-free. We reserve the right to modify, suspend, or discontinue the service (or any part thereof) at any time with or without notice.
                            </p>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">6. Limitation of Liability</h2>
                            <p className="text-slate-400 leading-relaxed">
                                In no event shall Smart Notes App, its directors, employees, partners, or suppliers be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of (or inability to access or use) the service.
                            </p>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">7. Termination</h2>
                            <p className="text-slate-400 leading-relaxed">
                                We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms. Upon termination, your right to use the service will immediately cease. You may also delete your account at any time by contacting us.
                            </p>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">8. Changes to Terms</h2>
                            <p className="text-slate-400 leading-relaxed">
                                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
                            </p>
                        </section>

                        <hr className="border-gray-800/50" />

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-200">9. Contact Us</h2>
                            <p className="text-slate-400 leading-relaxed">
                                If you have any questions about these Terms, please contact us:
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

export default TermsOfService;
