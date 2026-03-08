import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Mail, Phone, ArrowRight,
    Twitter, Github, Linkedin, Instagram, Heart
} from 'lucide-react';

const Footer = ({ onGetStarted }) => {
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        // If we're on the landing page, scroll to the section
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Navigate to landing and scroll
            navigate('/');
        }
    };

    const handleGetStarted = () => {
        if (onGetStarted) {
            onGetStarted();
        } else {
            navigate('/login');
        }
    };

    return (
        <footer className="bg-[#09090b] border-t border-gray-800 pt-16 pb-10">
            <div className="w-full px-6 lg:px-12 xl:px-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

                    {/* Brand & Mission */}
                    <div className="md:col-span-1 space-y-5">
                        <Link to="/" className="flex items-center space-x-3">
                            <img src="/logo.png" alt="Smart Notes Logo" className="w-12 h-12 object-contain rounded-xl" />
                            <span className="text-2xl font-bold tracking-tight text-white">Smart Notes</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your all-in-one productivity workspace. Capture ideas, track expenses, build habits, and manage tasks — all in one beautifully unified app.
                        </p>
                        {/* Social Icons */}
                        <div className="flex items-center space-x-3 pt-1">
                            <a href="https://x.com/AkashSingh57860" aria-label="Twitter" className="p-2 bg-gray-800/50 rounded-full text-gray-400 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/50 border border-transparent transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="https://github.com/akash9569" aria-label="GitHub" className="p-2 bg-gray-800/50 rounded-full text-gray-400 hover:text-white hover:bg-purple-500/20 hover:border-purple-500/50 border border-transparent transition-all">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="https://www.linkedin.com/in/iamakashsingh9/" aria-label="LinkedIn" className="p-2 bg-gray-800/50 rounded-full text-gray-400 hover:text-white hover:bg-blue-500/20 hover:border-blue-500/50 border border-transparent transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="https://www.instagram.com/iamakashsingh9/" aria-label="Instagram" className="p-2 bg-gray-800/50 rounded-full text-gray-400 hover:text-white hover:bg-pink-500/20 hover:border-pink-500/50 border border-transparent transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div className="space-y-5">
                        <h3 className="text-white font-semibold uppercase tracking-wider text-xs">Product</h3>
                        <ul className="space-y-3">
                            <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors text-sm text-left">Notes &amp; Notebooks</button></li>
                            <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors text-sm text-left">Expense Tracker</button></li>
                            <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors text-sm text-left">Habit Builder</button></li>
                            <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors text-sm text-left">Task Manager</button></li>
                            <li><button onClick={handleGetStarted} className="text-gray-400 hover:text-white transition-colors text-sm text-left">Get Started Free</button></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-5">
                        <h3 className="text-white font-semibold uppercase tracking-wider text-xs">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3 text-gray-400 text-sm">
                                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                <span>smartnotes95@gmail.com</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400 text-sm">
                                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                <span>+91 95695 81233</span>
                            </li>
                            <li>
                                <Link to="/contact" className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors mt-1 text-sm">
                                    <span>Send a Message</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-5">
                        <h3 className="text-white font-semibold uppercase tracking-wider text-xs">Legal</h3>
                        <ul className="space-y-3">
                            <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">Privacy Policy</span></li>
                            <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">Terms of Service</span></li>
                            <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">Cookie Policy</span></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Smart Notes App. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Designed with</span>
                        <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
                        <span>for productivity</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
