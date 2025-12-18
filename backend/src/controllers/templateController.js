import CustomTemplate from '../models/CustomTemplate.js';
import cloudinary from 'cloudinary';

// @desc    Upload a custom template
// @route   POST /api/templates/upload
// @access  Private
export const uploadTemplate = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                {
                    folder: 'smart-notes/templates',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        // Create CustomTemplate record
        const template = await CustomTemplate.create({
            userId: req.user.id,
            name: req.body.name || req.file.originalname,
            url: result.secure_url,
            publicId: result.public_id,
            type: 'image',
        });

        res.status(201).json({ success: true, data: { template } });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
};

// @desc    Get user's custom templates
// @route   GET /api/templates
// @access  Private
export const getTemplates = async (req, res) => {
    try {
        const templates = await CustomTemplate.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: { templates } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
