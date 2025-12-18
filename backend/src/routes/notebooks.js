import express from 'express';
import { getNotebooks, createNotebook, updateNotebook, deleteNotebook } from '../controllers/notebookController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getNotebooks)
    .post(createNotebook);

router.route('/:id')
    .put(updateNotebook)
    .delete(deleteNotebook);

export default router;
