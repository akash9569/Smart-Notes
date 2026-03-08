import React, { useState, useEffect, useCallback } from 'react';
import { X, Upload, Image as ImageIcon, Trash2, Check, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { galleryAPI } from '../api';
import toast from 'react-hot-toast';
import getCroppedImg from '../utils/canvasUtils';

const ImageGalleryModal = ({ isOpen, onClose, onSelect }) => {
    const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' or 'upload'
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Cropping State
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    useEffect(() => {
        if (isOpen && activeTab === 'gallery') {
            fetchImages();
        }
    }, [isOpen, activeTab]);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const { data } = await galleryAPI.getImages();
            setImages(data.data.images);
        } catch (error) {
            console.error('Failed to fetch images:', error);
            toast.error('Failed to load gallery');
        } finally {
            setLoading(false);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileSelect = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.addEventListener('load', () => setImageSrc(reader.result));
            reader.readAsDataURL(file);
        }
    };

    const handleUploadCroppedImage = async () => {
        try {
            setUploading(true);
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            const formData = new FormData();
            formData.append('file', croppedImageBlob, 'profile-image.jpg');

            await galleryAPI.uploadImage(formData);
            toast.success('Image uploaded successfully');

            // Reset and switch to gallery
            setImageSrc(null);
            setZoom(1);
            setActiveTab('gallery');
            fetchImages();
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            await galleryAPI.deleteImage(id);
            toast.success('Image deleted');
            setImages(images.filter(img => img._id !== id));
            if (selectedImage?._id === id) setSelectedImage(null);
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Failed to delete image');
        }
    };

    const handleCancelCrop = () => {
        setImageSrc(null);
        setZoom(1);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Gallery</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Tabs - Only show when not cropping */}
                {!imageSrc && (
                    <div className="flex border-b border-gray-200 dark:border-gray-800">
                        <button
                            onClick={() => setActiveTab('gallery')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'gallery'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            My Photos
                        </button>
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'upload'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            Upload New
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 min-h-[400px]">
                    {imageSrc ? (
                        // Cropper UI
                        <div className="flex flex-col h-full">
                            <div className="relative flex-1 bg-black rounded-lg overflow-hidden min-h-[300px]">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>

                            <div className="mt-4 space-y-4">
                                <div className="flex items-center space-x-2 px-4">
                                    <ZoomOut className="w-4 h-4 text-gray-500" />
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    />
                                    <ZoomIn className="w-4 h-4 text-gray-500" />
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={handleCancelCrop}
                                        disabled={uploading}
                                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUploadCroppedImage}
                                        disabled={uploading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                    >
                                        {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        {uploading ? 'Processing...' : 'Upload Image'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'gallery' ? (
                        // Gallery Grid
                        <>
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                    Loading your photos...
                                </div>
                            ) : images.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p>No images found. Upload one to get started!</p>
                                    <button
                                        onClick={() => setActiveTab('upload')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Upload Photo
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {images.map((img) => (
                                        <div
                                            key={img._id}
                                            onClick={() => setSelectedImage(img)}
                                            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group border-2 transition-all ${selectedImage?._id === img._id
                                                ? 'border-blue-500 ring-2 ring-blue-500/20 scale-95'
                                                : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                                }`}
                                        >
                                            <img
                                                src={img.url}
                                                alt="Gallery"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={(e) => handleDelete(e, img._id)}
                                                    className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                                                    title="Delete image"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {selectedImage?._id === img._id && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm">
                                                    <Check className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        // Upload Box
                        <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                                <Upload className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Upload a photo</h3>
                            <p className="text-gray-500 text-center mb-6 max-w-xs">
                                Choose an image to crop and set as your profile picture.
                            </p>
                            <label className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center">
                                <Upload className="w-4 h-4 mr-2" />
                                Choose File
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Footer - Hide when cropping */}
                {!imageSrc && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end space-x-3 bg-gray-50 dark:bg-[#252525]">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (selectedImage) {
                                    onSelect(selectedImage.url);
                                    onClose();
                                }
                            }}
                            disabled={!selectedImage || activeTab !== 'gallery'}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            Set as Profile Photo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageGalleryModal;
