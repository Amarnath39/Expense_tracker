import { useEffect, useState } from 'react';
import { expenseApi } from '../services/expenseApi';

const MonthlySummary = () => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await expenseApi.getMonthlySummary();
      if (result.success) {
        setSummary(result.data);
      } else {
        setError('Failed to load summary');
      }
    } catch (error) {
      setError('Failed to load summary');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (isLoading) {
    return <div className="monthly-summary loading">Loading summary...</div>;
  }

  if (error) {
    return <div className="monthly-summary error">{error}</div>;
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="monthly-summary">
      <h2>Monthly Summary - {summary.month}</h2>
      
      <div className="summary-total">
        <span className="total-label">Total Spend:</span>
        <span className="total-amount">{formatAmount(summary.total)}</span>
      </div>

      {summary.breakdown && summary.breakdown.length > 0 ? (
        <div className="summary-breakdown">
          <h3>Breakdown by Category</h3>
          <ul className="breakdown-list">
            {summary.breakdown.map(item => (
              <li key={item.category} className="breakdown-item">
                <span className="breakdown-category">{item.category}</span>
                <span className="breakdown-amount">{formatAmount(item.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="no-expenses">No expenses this month</p>
      )}
    </div>
  );
};

export default MonthlySummary;
