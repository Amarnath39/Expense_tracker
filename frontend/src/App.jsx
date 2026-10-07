import { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseFilters from './components/ExpenseFilters';
import MonthlySummary from './components/MonthlySummary';
import ExpenseView from './components/ExpenseView';
import { expenseApi } from './services/expenseApi';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [viewingExpense, setViewingExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All Categories',
    from: '',
    to: '',
    title: ''
  });
  const [summaryKey, setSummaryKey] = useState(0);

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

  const handleExpenseSubmit = (expenseData) => {
    if (editingExpense) {
      // Update existing expense in the list
      setExpenses(prev => 
        prev.map(exp => 
          exp._id === expenseData._id ? expenseData : exp
        )
      );
      setEditingExpense(null);
    } else {
      // Add new expense to the list
      setExpenses(prev => [expenseData, ...prev]);
    }
    // Refresh summary
    setSummaryKey(prev => prev + 1);
  };

  const handleExpenseEdit = (expense) => {
    setEditingExpense(expense);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExpenseView = (expense) => {
    setViewingExpense(expense);
  };

  const handleExpenseDelete = (id) => {
    setExpenses(prev => prev.filter(exp => exp._id !== id));
    // Refresh summary
    setSummaryKey(prev => prev + 1);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <div className="app">
      <header>
        <h1>Personal Expense Tracker</h1>
      </header>

      <main>
        <MonthlySummary key={summaryKey} />

        <ExpenseForm 
          editingExpense={editingExpense}
          onSubmit={handleExpenseSubmit}
          onCancel={handleCancelEdit}
        />

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
      </main>
    </div>
  );
}

export default App;
