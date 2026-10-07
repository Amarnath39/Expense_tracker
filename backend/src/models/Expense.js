import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'],
      message: '{VALUE} is not a valid category'
    }
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  note: {
    type: String,
    trim: true,
    maxlength: [1000, 'Note cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ title: 'text' });

export default mongoose.model('Expense', expenseSchema);
