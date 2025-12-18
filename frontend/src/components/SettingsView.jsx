import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User, Moon, Sun, Shield, Bell, Save, Camera } from 'lucide-react';
import { authAPI } from '../api';
import toast from 'react-hot-toast';
import ImageGalleryModal from './ImageGalleryModal';

const SettingsView = () => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
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
            await authAPI.updateDetails(formData);
            toast.success('Profile updated successfully');
            setIsEditing(false);
            // Ideally, update user context here, but a refresh will also work
            // Or trigger a re-fetch of 'me'
            window.location.reload();
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

    return (
        <div className="flex-1 bg-white dark:bg-[#1a1a1a] p-4 sm:p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Profile Section */}
                <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-[#2d2d2d] rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Profile Details
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
                        <div className="relative group">
                            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    formData.name?.charAt(0) || 'U'
                                )}
                            </div>
                            {isEditing && (
                                <div
                                    onClick={() => setShowGalleryModal(true)}
                                    className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{formData.name || 'User Name'}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{formData.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="+1 (555) 000-0000"
                                className="w-full px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed dark:text-white"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Image URL</label>
                            <input
                                type="url"
                                name="profileImage"
                                value={formData.profileImage}
                                onChange={handleChange}
                                disabled={!isEditing}
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed dark:text-white"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                            >
                                {loading ? 'Saving...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </form>

                {/* Preferences Section */}
                <div className="bg-gray-50 dark:bg-[#2d2d2d] rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Preferences
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                {isDark ? (
                                    <>
                                        <Moon className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <Sun className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-700 dark:text-gray-300">Light Mode</span>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${isDark ? 'bg-blue-600' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${isDark ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Bell className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-700 dark:text-gray-300">Notifications</span>
                            </div>
                            <button className="w-12 h-6 rounded-full p-1 bg-gray-300 transition-colors">
                                <div className="w-4 h-4 rounded-full bg-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Log Out
                    </button>
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

export default SettingsView;
