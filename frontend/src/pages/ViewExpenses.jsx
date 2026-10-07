import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseList from '../components/ExpenseList';
import ExpenseFilters from '../components/ExpenseFilters';
import MonthlySummary from '../components/MonthlySummary';
import ExpenseView from '../components/ExpenseView';
import ExpenseForm from '../components/ExpenseForm';
import Toast from '../components/Toast';
import { expenseApi } from '../services/expenseApi';

const ViewExpenses = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [viewingExpense, setViewingExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All Categories',
    from: '',
    to: '',
    title: ''
  });
  const [summaryKey, setSummaryKey] = useState(0);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const hasActiveFilters = () => {
    return filters.category !== 'All Categories' || 
           filters.from !== '' || 
           filters.to !== '' || 
           filters.title !== '';
  };

  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await expenseApi.getExpenses(filters);
      if (result.success) {
        setExpenses(result.data);
      } else {
        setError(result.message || 'Failed to fetch expenses');
      }
    } catch (error) {
      setError('Failed to connect to server. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'All Categories',
      from: '',
      to: '',
      title: ''
    });
  };

  const handleExpenseSubmit = async (expenseData) => {
    if (editingExpense) {
      try {
        const result = await expenseApi.updateExpense(editingExpense._id, expenseData);
        if (result.success) {
          setExpenses(prev => 
            prev.map(exp => 
              exp._id === expenseData._id ? result.data : exp
            )
          );
          setEditingExpense(null);
          setSummaryKey(prev => prev + 1);
          showToast('Expense updated successfully!', 'success');
        } else {
          showToast('Failed to update expense: ' + result.message, 'error');
        }
      } catch (error) {
        showToast('Failed to update expense. Please try again.', 'error');
      }
    }
  };

  const handleExpenseEdit = (expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExpenseView = (expense) => {
    setViewingExpense(expense);
  };

  const handleExpenseDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const result = await expenseApi.deleteExpense(id);
        if (result.success) {
          setExpenses(prev => prev.filter(exp => exp._id !== id));
          setSummaryKey(prev => prev + 1);
          showToast('Expense deleted successfully!', 'success');
        } else {
          showToast('Failed to delete expense: ' + result.message, 'error');
        }
      } catch (error) {
        showToast('Failed to delete expense. Please try again.', 'error');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1>View Expenses</h1>
        </div>

        <MonthlySummary key={summaryKey} />

        {editingExpense && (
          <div className="edit-section">
            <h2>Edit Expense</h2>
            <ExpenseForm
              editingExpense={editingExpense}
              onSubmit={handleExpenseSubmit}
              onCancel={handleCancelEdit}
            />
          </div>
        )}

        <ExpenseFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {error && <div className="error-message">{error}</div>}

        <ExpenseList
          expenses={expenses}
          onEdit={handleExpenseEdit}
          onDelete={handleExpenseDelete}
          onView={handleExpenseView}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters()}
        />

        {viewingExpense && (
          <ExpenseView
            expense={viewingExpense}
            onClose={() => setViewingExpense(null)}
          />
        )}
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

export default ViewExpenses;
