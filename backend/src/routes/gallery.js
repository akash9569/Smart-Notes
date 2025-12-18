import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import { uploadImage, getImages, deleteImage } from '../controllers/galleryController.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
});

router.route('/')
    .get(protect, getImages);

router.route('/upload')
    .post(protect, upload.single('file'), uploadImage);

router.route('/:id')
    .delete(protect, deleteImage);

export default router;
