import GalleryImage from '../models/GalleryImage.js';
import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Upload an image to gallery
// @route   POST /api/gallery/upload
// @access  Private
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        let imageUrl, publicId;

        // Check if Cloudinary is configured
        const isCloudinaryConfigured = process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_KEY !== 'placeholder';

        if (isCloudinaryConfigured) {
            // Upload to Cloudinary
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    {
                        folder: 'smart-notes/gallery',
                        resource_type: 'image',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            imageUrl = result.secure_url;
            publicId = result.public_id;
        } else {
            // Local Storage Fallback
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(req.file.originalname);
            const filename = `${req.user.id}-${uniqueSuffix}${ext}`;
            const uploadPath = path.join(__dirname, '../../public/uploads', filename);

            // Ensure directory exists
            await fs.promises.mkdir(path.dirname(uploadPath), { recursive: true });

            await fs.promises.writeFile(uploadPath, req.file.buffer);

            // Use full URL
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
            publicId = `local_${filename}`;
        }

        // Create GalleryImage record
        const image = await GalleryImage.create({
            userId: req.user.id,
            url: imageUrl,
            publicId: publicId,
        });

        res.status(201).json({ success: true, data: { image } });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Upload failed'
        });
    }
};

// @desc    Get user's gallery images
// @route   GET /api/gallery
// @access  Private
export const getImages = async (req, res) => {
    try {
        const images = await GalleryImage.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: { images } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete an image from gallery
// @route   DELETE /api/gallery/:id
// @access  Private
export const deleteImage = async (req, res) => {
    try {
        const image = await GalleryImage.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        // Check user ownership
        if (image.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        if (image.publicId && image.publicId.startsWith('local_')) {
            // Delete local file
            const filename = image.publicId.replace('local_', '');
            const filePath = path.join(__dirname, '../../public/uploads', filename);
            try {
                await fs.promises.unlink(filePath);
            } catch (err) {
                console.error('Failed to delete local file:', err);
                // Continue to delete from DB even if file missing
            }
        } else {
            // Delete from Cloudinary
            await cloudinary.v2.uploader.destroy(image.publicId);
        }

        // Delete from DB
        await image.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
};
