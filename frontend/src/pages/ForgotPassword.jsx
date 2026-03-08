import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, BookOpen, ArrowLeft, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { sendOtp, verifyOtp, resetPassword } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

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
            navigate('/dashboard'); // Navigate to dashboard, user is now logged in
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden z-0">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center transform transition-transform hover:scale-110 duration-300">
                    <img src="/logo.png" alt="Smart Notes Logo" className="w-20 h-20 object-contain rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.3)] cursor-pointer" onClick={() => navigate('/')} />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2 tracking-tight">
                    {step === 1 ? 'Reset Password' : step === 2 ? 'Verify OTP' : 'New Password'}
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    {step === 1 ? 'Enter your email to receive an OTP' : step === 2 ? 'Enter the 6-digit code sent to your email' : 'Create a new secure password'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-[#0f111a]/80 py-8 px-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] sm:rounded-3xl sm:px-10 border border-white/10 backdrop-blur-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>

                    {step === 1 && (
                        <form className="space-y-6 relative z-10" onSubmit={handleEmailSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3.5 transition-all outline-none placeholder-slate-500 shadow-inner"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
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
                        <form className="space-y-6 relative z-10" onSubmit={handleOtpSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    6-Digit OTP
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Shield className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="block w-full pl-10 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3.5 transition-all outline-none placeholder-slate-500 shadow-inner tracking-widest text-xl font-bold"
                                        placeholder="123456"
                                    />
                                </div>
                                <div className="flex justify-end mt-2">
                                    <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                                        Change Email
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
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
                        <form className="space-y-6 relative z-10" onSubmit={handlePasswordSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    New Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        minLength="6"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="block w-full pl-10 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3.5 transition-all outline-none placeholder-slate-500 shadow-inner"
                                        placeholder="Min. 6 characters"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        minLength="6"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-10 bg-black/20 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3.5 transition-all outline-none placeholder-slate-500 shadow-inner"
                                        placeholder="Re-enter password"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
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

                    <div className="mt-8 relative z-10">
                        <Link
                            to="/login"
                            className="w-full flex justify-center items-center py-4 px-4 border border-white/20 hover:border-white/40 rounded-xl shadow-sm text-sm font-bold text-white bg-white/5 hover:bg-white/10 transition-all backdrop-blur-md"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
