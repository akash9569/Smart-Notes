import express from 'express';
import * as expenseController from '../controllers/expenseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // Protect all routes

router
    .route('/')
    .get(expenseController.getExpenses)
    .post(expenseController.createExpense);

router.get('/stats', expenseController.getExpenseStats);

router
    .route('/:id')
    .delete(expenseController.deleteExpense);

export default router;
