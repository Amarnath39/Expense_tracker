import { useState } from 'react';

const CATEGORIES = ['All Categories', 'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

const ExpenseFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [dateError, setDateError] = useState('');

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // Clear date error when user changes dates
    if (name === 'from' || name === 'to') {
      setDateError('');
    }

    // Validate date range before applying
    if (name === 'from' || name === 'to') {
      const newFilters = { ...filters, [name]: value };
      if (newFilters.from && newFilters.to && new Date(newFilters.from) > new Date(newFilters.to)) {
        setDateError('From date cannot be later than To date');
        // Don't apply invalid filter
        return;
      }
    }

    onFilterChange(name, value);
  };

  return (
    <div className="expense-filters">
      <h3>Filters</h3>
      
      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="search">Search by title</label>
          <input
            type="text"
            id="search"
            name="title"
            value={filters.title || ''}
            onChange={handleFilterChange}
            placeholder="Search by title..."
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category || 'All Categories'}
            onChange={handleFilterChange}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="from">From</label>
          <input
            type="date"
            id="from"
            name="from"
            value={filters.from || ''}
            onChange={handleFilterChange}
            className={dateError ? 'error' : ''}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="to">To</label>
          <input
            type="date"
            id="to"
            name="to"
            value={filters.to || ''}
            onChange={handleFilterChange}
            className={dateError ? 'error' : ''}
          />
        </div>
      </div>

      {dateError && <div className="error-message">{dateError}</div>}

      <div className="filter-actions">
        <button 
          className="btn btn-sm btn-secondary"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default ExpenseFilters;
