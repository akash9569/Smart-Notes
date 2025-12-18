import express from 'express';
import {
    getStickyNotes,
    createStickyNote,
    updateStickyNote,
    deleteStickyNote
} from '../controllers/stickyNoteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getStickyNotes)
    .post(createStickyNote);

router.route('/:id')
    .put(updateStickyNote)
    .delete(deleteStickyNote);

export default router;
