import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, onEdit, onDelete, onView, isLoading, hasActiveFilters }) => {
  if (isLoading) {
    return <div className="expense-list loading">Loading expenses...</div>;
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="expense-list empty">
        <p>{hasActiveFilters ? 'No expenses match your filters.' : 'No expenses yet. Add your first expense above!'}</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map(expense => (
        <ExpenseItem
          key={expense._id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default ExpenseList;
