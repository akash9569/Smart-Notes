import express from 'express';
import * as loanController from '../controllers/loanController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // Protect all routes

router
    .route('/')
    .get(loanController.getLoans)
    .post(loanController.createLoan);

router.get('/stats', loanController.getLoanStats);

router
    .route('/:id')
    .put(loanController.updateLoan)
    .delete(loanController.deleteLoan);

router.post('/:id/repay', loanController.addRepayment);

export default router;
