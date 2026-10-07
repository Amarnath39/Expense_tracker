import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { expenseApi } from '../services/expenseApi';

const Home = () => {
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

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>Track Your Expenses</h1>
        <p className="hero-description">
          Easily track and manage your personal spending. Keep tabs on where your money goes 
          with our simple and intuitive expense tracker.
        </p>
      </div>

      <div className="home-summary">
        {isLoading ? (
          <div className="loading">Loading summary...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : summary ? (
          <>
            <div className="summary-card">
              <h2>This Month's Spending</h2>
              <div className="total-amount">{formatAmount(summary.total)}</div>
              <p className="summary-month">{summary.month}</p>
            </div>

            {summary.breakdown && summary.breakdown.length > 0 && (
              <div className="summary-card breakdown-card">
                <h3>Category Breakdown</h3>
                <ul className="breakdown-list">
                  {summary.breakdown.map(item => (
                    <li key={item.category} className="breakdown-item">
                      <span className="breakdown-category">{item.category}</span>
                      <span className="breakdown-amount">{formatAmount(item.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="no-data">No expense data available</div>
        )}
      </div>

      <div className="home-actions">
        <Link to="/add" className="btn btn-primary btn-large">
          Add Expense
        </Link>
        <Link to="/expenses" className="btn btn-secondary btn-large">
          View Expenses
        </Link>
      </div>
    </div>
  );
};

export default Home;
