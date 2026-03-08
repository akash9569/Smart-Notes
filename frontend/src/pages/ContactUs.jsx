import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Send, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Footer from '../components/Footer';

const ContactUs = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5001/api/contact', formData);
            toast.success('Message sent! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            const msg = error?.response?.data?.message || 'Failed to send message. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const scrollToHome = () => navigate('/');

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

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                        <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
                        <Link to="/" className="hover:text-white transition-colors duration-200">Features</Link>
                        <Link to="/" className="hover:text-white transition-colors duration-200">About Us</Link>
                        <span className="text-indigo-400 font-semibold cursor-default">Contact Us</span>
                    </nav>

                    <button
                        onClick={() => navigate('/login')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-indigo-500/30"
                    >
                        Login / Register
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow pt-28 pb-16 bg-[#09090b] relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Page Header */}
                <div className="text-center mb-16 pt-6 relative z-10">
                    <span className="inline-block text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-3 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Smart Notes Support</span>
                    <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 mb-4 tracking-tight">Contact Us</h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">We'd love to hear from you. Our friendly team is always here to chat.</p>
                </div>

                {/* Contact Us Section — full-width two-column layout */}
                <div className="w-full px-6 lg:px-12 xl:px-20">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left: Contact Info Column */}
                        <div className="lg:w-2/5 xl:w-1/3 space-y-5 relative z-10">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-200 mb-3">Reach Out to Us</h2>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    Have questions about Smart Notes or need technical support? Our team is here to help you around the clock.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-gray-800 rounded-2xl p-6 flex items-start space-x-5 hover:border-indigo-500/30 transition-all group shadow-lg">
                                <div className="bg-indigo-500/10 p-3 rounded-xl flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
                                    <MapPin className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-slate-200 font-semibold text-lg mb-1">Office Location</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">Infosys Foundation,<br />Bengaluru, Karnataka</p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-gray-800 rounded-2xl p-6 flex items-start space-x-5 hover:border-blue-500/30 transition-all group shadow-lg">
                                <div className="bg-blue-500/10 p-3 rounded-xl flex-shrink-0 group-hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                                    <Phone className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-slate-200 font-semibold text-lg mb-1">Phone Number</h3>
                                    <p className="text-slate-400 text-sm">+91 95695 81233</p>
                                    <p className="text-slate-500 text-xs mt-1">Mon-Fri from 8am to 5pm.</p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-gray-800 rounded-2xl p-6 flex items-start space-x-5 hover:border-purple-500/30 transition-all group shadow-lg">
                                <div className="bg-purple-500/10 p-3 rounded-xl flex-shrink-0 group-hover:bg-purple-500/20 transition-colors border border-purple-500/20">
                                    <Mail className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-slate-200 font-semibold text-lg mb-1">Email Address</h3>
                                    <p className="text-slate-400 text-sm">smartnotes95@gmail.com</p>
                                    <p className="text-slate-500 text-xs mt-1">We'll respond within 24 hours.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Contact Form Column */}
                        <div className="lg:w-3/5 xl:w-2/3 relative z-10">
                            <div className="bg-[#12161f] border border-gray-800/80 rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                <h2 className="text-2xl font-bold text-slate-200 mb-8 pb-4 border-b border-gray-800/50 relative z-10">
                                    Send us a Message
                                </h2>

                                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Your Name <span className="text-indigo-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-[#090b10] border border-gray-800 text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 py-3.5 px-5 transition-all outline-none placeholder-slate-600 shadow-inner"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                Email Address <span className="text-indigo-400">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-[#090b10] border border-gray-800 text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 py-3.5 px-5 transition-all outline-none placeholder-slate-600 shadow-inner"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-[#090b10] border border-gray-800 text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 py-3.5 px-5 transition-all outline-none placeholder-slate-600 shadow-inner"
                                            placeholder="+91 99999 99999"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Message <span className="text-indigo-400">*</span>
                                        </label>
                                        <textarea
                                            required
                                            name="message"
                                            rows="5"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full bg-[#090b10] border border-gray-800 text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 py-4 px-5 transition-all outline-none placeholder-slate-600 resize-none shadow-inner"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-4 px-6 rounded-xl flex justify-center items-center space-x-2 transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Sending...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    <span>Send Message</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modern Footer */}
            <Footer />
        </div>
    );
};

export default ContactUs;
