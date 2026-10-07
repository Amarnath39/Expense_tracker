import Expense from '../models/Expense.js';

// @desc    Get all expenses with optional filters
// @route   GET /api/expenses
// @access  Public
export const getExpenses = async (req, res) => {
  try {
    const { category, from, to, title } = req.query;

    // Build query
    const query = {};

    // Category filter
    if (category && category !== 'All Categories') {
      query.category = category;
    }

    // Date range filter
    if (from || to) {
      query.date = {};
      if (from) {
        // Parse as local date (midnight)
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        query.date.$gte = fromDate;
      }
      if (to) {
        // Parse as local date (end of day)
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        query.date.$lte = toDate;
      }
    }

    // Title search (case-insensitive partial match)
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    const expenses = await Expense.find(query).sort({ date: -1, createdAt: -1 });

    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Public
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid expense ID' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Public
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (!/^[a-zA-Z\s]+$/.test(title.trim())) {
      return res.status(400).json({ success: false, message: 'Title should contain only alphabets and spaces' });
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }
    const validCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }
    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({ success: false, message: 'Invalid date' });
    }

    // Parse date as local date to avoid timezone issues
    const expenseDate = new Date(date);
    expenseDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone boundary issues

    const expense = await Expense.create({
      title,
      amount: parseFloat(amount),
      category,
      date: expenseDate,
      note: note || ''
    });

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Public
export const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;

    // Validation
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ success: false, message: 'Title cannot be empty' });
      }
      if (!/^[a-zA-Z\s]+$/.test(title.trim())) {
        return res.status(400).json({ success: false, message: 'Title should contain only alphabets and spaces' });
      }
    }
    if (amount !== undefined && (isNaN(amount) || Number(amount) <= 0)) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }
    if (category !== undefined) {
      const validCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ success: false, message: 'Invalid category' });
      }
    }
    if (date !== undefined && isNaN(Date.parse(date))) {
      return res.status(400).json({ success: false, message: 'Invalid date' });
    }

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Update fields
    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = parseFloat(amount);
    if (category !== undefined) expense.category = category;
    if (date !== undefined) {
      const expenseDate = new Date(date);
      expenseDate.setHours(12, 0, 0, 0);
      expense.date = expenseDate;
    }
    if (note !== undefined) expense.note = note;

    await expense.save();

    res.json({ success: true, data: expense });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid expense ID' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Public
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    await expense.deleteOne();

    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid expense ID' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get monthly summary
// @route   GET /api/expenses/summary/monthly
// @access  Public
export const getMonthlySummary = async (req, res) => {
  try {
    const now = new Date();
    // Use local timezone for month boundaries
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const summary = await Expense.aggregate([
      {
        $match: {
          date: {
            $gte: firstDay,
            $lte: lastDay
          }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    // Calculate total
    const total = summary.reduce((sum, item) => sum + item.total, 0);

    // Format response
    const breakdown = summary.map(item => ({
      category: item._id,
      amount: item.total
    }));

    res.json({
      success: true,
      data: {
        total,
        breakdown,
        month: now.toLocaleString('default', { month: 'long', year: 'numeric' })
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
