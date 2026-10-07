const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const expenseApi = {
  // Get all expenses with optional filters
  getExpenses: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.category && filters.category !== 'All Categories') {
      queryParams.append('category', filters.category);
    }
    if (filters.from) {
      queryParams.append('from', filters.from);
    }
    if (filters.to) {
      queryParams.append('to', filters.to);
    }
    if (filters.title) {
      queryParams.append('title', filters.title);
    }

    const url = `${API_URL}/expenses${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url);
    return response.json();
  },

  // Get single expense
  getExpenseById: async (id) => {
    const response = await fetch(`${API_URL}/expenses/${id}`);
    return response.json();
  },

  // Create expense
  createExpense: async (expenseData) => {
    const response = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
    return response.json();
  },

  // Update expense
  updateExpense: async (id, expenseData) => {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
    return response.json();
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Get monthly summary
  getMonthlySummary: async () => {
    const response = await fetch(`${API_URL}/expenses/summary/monthly`);
    return response.json();
  },
};
