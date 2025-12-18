import express from 'express';
import { getTags } from '../controllers/tagController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getTags);

export default router;
