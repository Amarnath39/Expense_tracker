import express from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getMonthlySummary
} from '../controllers/expenseController.js';

const router = express.Router();

// Get all expenses with filters
router.get('/', getExpenses);

// Get monthly summary
router.get('/summary/monthly', getMonthlySummary);

// Get single expense
router.get('/:id', getExpenseById);

// Create expense
router.post('/', createExpense);

// Update expense
router.put('/:id', updateExpense);

// Delete expense
router.delete('/:id', deleteExpense);

export default router;
