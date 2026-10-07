const ExpenseView = ({ expense, onClose }) => {
  if (!expense) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
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

  const getCategoryColor = (category) => {
    const colors = {
      'Food': '#ffeaa7',
      'Transport': '#74b9ff',
      'Shopping': '#fd79a8',
      'Bills': '#a29bfe',
      'Entertainment': '#55efc4',
      'Other': '#dfe6e9'
    };
    return colors[category] || '#dfe6e9';
  };

  const getCategoryTextColor = (category) => {
    const colors = {
      'Food': '#d35400',
      'Transport': '#0984e3',
      'Shopping': '#e84393',
      'Bills': '#6c5ce7',
      'Entertainment': '#00b894',
      'Other': '#636e72'
    };
    return colors[category] || '#636e72';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Expense Details</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="expense-view-details">
          <div className="view-section">
            <label>Title</label>
            <div className="view-value">{expense.title}</div>
          </div>

          <div className="view-section">
            <label>Amount</label>
            <div className="view-value view-amount">{formatAmount(expense.amount)}</div>
          </div>

          <div className="view-section">
            <label>Category</label>
            <div 
              className="view-value view-category"
              style={{
                backgroundColor: getCategoryColor(expense.category),
                color: getCategoryTextColor(expense.category)
              }}
            >
              {expense.category}
            </div>
          </div>

          <div className="view-section">
            <label>Date</label>
            <div className="view-value">{formatDate(expense.date)}</div>
          </div>

          {expense.note && (
            <div className="view-section">
              <label>Note</label>
              <div className="view-value view-note">"{expense.note}"</div>
            </div>
          )}

          <div className="view-section">
            <label>Created</label>
            <div className="view-value view-meta">
              {new Date(expense.createdAt).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {expense.updatedAt && expense.updatedAt !== expense.createdAt && (
            <div className="view-section">
              <label>Last Updated</label>
              <div className="view-value view-meta">
                {new Date(expense.updatedAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseView;
