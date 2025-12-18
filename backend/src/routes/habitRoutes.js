import express from 'express';
import {
    getHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
} from '../controllers/habitController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // Protect all routes

router.get('/', getHabits);
router.post('/', createHabit);
router.patch('/:id', updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/toggle', toggleHabitCompletion);

export default router;
