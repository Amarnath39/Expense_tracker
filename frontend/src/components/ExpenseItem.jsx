const ExpenseItem = ({ expense, onEdit, onDelete, onView }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleDelete = () => {
    onDelete(expense._id);
  };

  return (
    <div className="expense-item">
      <div className="expense-header">
        <h3 className="expense-title">{expense.title}</h3>
        <span className="expense-amount">{formatAmount(expense.amount)}</span>
      </div>
      
      <div className="expense-details">
        <span className={`expense-category category-${expense.category.toLowerCase()}`}>
          {expense.category}
        </span>
        <span className="expense-date">{formatDate(expense.date)}</span>
      </div>

      {expense.note && (
        <div className="expense-note">
          "{expense.note}"
        </div>
      )}

      <div className="expense-actions">
        <button 
          className="btn btn-sm btn-view"
          onClick={() => onView(expense)}
        >
          View
        </button>
        <button 
          className="btn btn-sm btn-edit"
          onClick={() => onEdit(expense)}
        >
          Edit
        </button>
        <button 
          className="btn btn-sm btn-delete"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
