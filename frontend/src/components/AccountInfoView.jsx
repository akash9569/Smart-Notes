import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Save, Camera, Mail, Phone, Calendar, Shield, ChevronRight, KeyRound } from 'lucide-react';
import { authAPI } from '../api';
import toast from 'react-hot-toast';
import ImageGalleryModal from './ImageGalleryModal';

const AccountInfoView = () => {
    const { user, logout, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        profileImage: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
                gender: user.gender || '',
                profileImage: user.profileImage || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authAPI.updateDetails(formData);
            if (updateUser && response.data?.data?.user) {
                updateUser(response.data.data.user);
            }
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Update failed:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getJoinDate = () => {
        if (user?.createdAt) {
            return new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'long', year: 'numeric'
            });
        }
        return 'Recently';
    };

    return (
        <div className="flex-1 bg-gray-50 dark:bg-[#141414] overflow-y-auto custom-scrollbar">
            {/* Hero Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-90" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0wLTR2LTJINDI0djJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

                <div className="relative px-4 sm:px-8 pt-8 pb-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Account Info</h1>
                                <p className="text-white/70 text-sm mt-1">Manage your personal information and account</p>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-medium rounded-xl border border-white/20 transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-14 pb-10 relative z-10">
                {/* Profile Card */}
                <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-[#333] shadow-xl overflow-hidden mb-6">
                    <div className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-lg ring-4 ring-white dark:ring-[#1e1e1e]">
                                    {formData.profileImage ? (
                                        <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        getInitials(formData.name)
                                    )}
                                </div>
                                {isEditing && (
                                    <div
                                        onClick={() => setShowGalleryModal(true)}
                                        className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer backdrop-blur-sm"
                                    >
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="text-center sm:text-left flex-1 min-w-0">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{formData.name || 'User Name'}</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5 truncate">{formData.email}</p>
                                <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start flex-wrap">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full border border-green-200 dark:border-green-800">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        Active
                                    </span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        Joined {getJoinDate()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden mb-6">
                        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-[#2a2a2a]">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <User className="w-4 h-4 text-indigo-500" />
                                Personal Information
                            </h3>
                        </div>
                        <div className="p-5 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Date of Birth</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all outline-none appearance-none"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Profile Image URL */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Profile Image URL</label>
                                    <input
                                        type="url"
                                        name="profileImage"
                                        value={formData.profileImage}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="https://example.com/avatar.jpg"
                                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Save / Cancel */}
                            {isEditing && (
                                <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-[#2a2a2a]">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            // Reset form to original user data
                                            if (user) {
                                                setFormData({
                                                    name: user.name || '',
                                                    email: user.email || '',
                                                    phone: user.phone || '',
                                                    dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
                                                    gender: user.gender || '',
                                                    profileImage: user.profileImage || ''
                                                });
                                            }
                                        }}
                                        className="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333] rounded-xl text-sm font-medium transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                {/* Security Section */}
                <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden mb-6">
                    <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-[#2a2a2a]">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-4 h-4 text-indigo-500" />
                            Security
                        </h3>
                    </div>
                    <div className="p-5 sm:p-6 space-y-1">
                        <button
                            onClick={() => toast('Password change coming soon!', { icon: '🔐' })}
                            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-[#252525] rounded-xl transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                    <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Change Password</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Update your account password</div>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-red-200 dark:border-red-900/30 shadow-sm overflow-hidden">
                    <div className="px-5 sm:px-6 py-4 border-b border-red-100 dark:border-red-900/20 bg-red-50/50 dark:bg-red-900/10">
                        <h3 className="text-base font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                            <LogOut className="w-4 h-4" />
                            Session
                        </h3>
                    </div>
                    <div className="p-5 sm:p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Signing out will end your session on this device. You'll need to log in again to access your notes.
                        </p>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-50 dark:bg-red-900/15 hover:bg-red-100 dark:hover:bg-red-900/25 text-red-600 dark:text-red-400 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-red-200 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-800"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <ImageGalleryModal
                isOpen={showGalleryModal}
                onClose={() => setShowGalleryModal(false)}
                onSelect={(url) => {
                    setFormData({ ...formData, profileImage: url });
                    setShowGalleryModal(false);
                }}
            />
        </div>
    );
};

export default AccountInfoView;
