import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import Toast from '../components/Toast';
import { expenseApi } from '../services/expenseApi';

const AddExpense = () => {
  const navigate = useNavigate();
  const [editingExpense, setEditingExpense] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSubmit = async (expenseData) => {
    try {
      const result = await expenseApi.createExpense(expenseData);
      if (result.success) {
        showToast('Expense added successfully!', 'success');
        // Reset form to allow adding more expenses
        setEditingExpense(null);
      } else {
        showToast('Failed to add expense: ' + result.message, 'error');
      }
    } catch (error) {
      showToast('Failed to add expense. Please try again.', 'error');
    }
  };

  const handleCancel = () => {
    navigate('/expenses');
  };

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1>Add Expense</h1>
        </div>
        <ExpenseForm
          editingExpense={editingExpense}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
      <div className="toast-container">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
};

export default AddExpense;
