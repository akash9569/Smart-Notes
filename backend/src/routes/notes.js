import express from 'express';
import { getNotes, createNote, updateNote, deleteNote, pinNote, shareNote } from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getNotes)
    .post(createNote);

router.route('/:id')
    .put(updateNote)
    .delete(deleteNote);

router.patch('/:id/pin', pinNote);
router.post('/:id/share', shareNote);

export default router;
