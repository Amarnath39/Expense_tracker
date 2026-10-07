# Personal Expense Tracker

A full-stack web application for tracking personal expenses using the MERN stack (MongoDB, Express, React, Node.js). This application allows you to add, view, edit, and delete expenses with filtering capabilities and monthly summaries.

## Project Overview

The Personal Expense Tracker is a single-user application designed to help individuals track their daily expenses. It provides a clean interface for managing expenses with features like category-based organization, date filtering, title search, and automatic monthly summaries with category breakdowns.

## Features

- **Add Expense**: Create expenses with title, amount (in ₹), category, date, and optional notes
- **View Expenses**: Display all expenses in a sorted list (newest first)
- **Edit Expense**: Modify existing expenses with form validation
- **Delete Expense**: Remove expenses with confirmation dialog
- **Monthly Summary**: Automatic calculation of total spend and category breakdown for the current month
- **Category Breakdown**: Visual breakdown of expenses by category
- **Category Filtering**: Filter expenses by specific categories
- **Date-Range Filtering**: Filter expenses between specific dates
- **Partial Title Search**: Search expenses by title with case-insensitive matching
- **Validation and Error Handling**: Comprehensive validation at both frontend and backend levels
- **Empty States**: Clear feedback when no expenses exist or filters return no results
- **Loading States**: Visual feedback during API operations

## Tech Stack

### Frontend
- **React.js**: Component-based UI library for building the user interface
- **Vite**: Fast build tool and development server
- **JavaScript**: Plain JavaScript (no TypeScript)
- **Fetch API**: For making HTTP requests to the backend

### Backend
- **Node.js**: JavaScript runtime for the server
- **Express.js**: Web framework for building REST APIs
- **Mongoose**: MongoDB object modeling for Node.js
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing middleware

### Database
- **MongoDB**: NoSQL database for storing expense data
- **MongoDB Atlas**: Cloud-hosted MongoDB (supported via connection string)
- **Local MongoDB**: Also supports local MongoDB connections

## Stack Choices and Tradeoffs

### Why MongoDB
- **Simple document structure**: Expenses naturally fit into document-based storage
- **Easy integration with Mongoose**: Provides schema validation and convenient query building
- **Suitable for small personal tracker**: No complex relational requirements
- **Flexible schema**: Easy to add fields later if needed

### Why React
- **Component-based UI**: Clean separation of concerns with reusable components
- **Straightforward state management**: React hooks (useState, useEffect) are sufficient for this application's state needs
- **Large ecosystem**: Well-supported with extensive documentation and community
- **Fast development**: Vite provides hot module replacement for rapid iteration

### Why No Redux
- **Application state is small**: The state consists mainly of expenses list, filters, and editing state
- **React state/hooks are sufficient**: useState and useEffect handle all state management needs without complexity
- **Avoids over-engineering**: Adding Redux would add unnecessary boilerplate for this scope

### Why No Authentication
- **Explicitly outside scope**: The requirements explicitly state not to add authentication
- **Personal/single-user tracker**: Intended for personal use on a local machine or trusted environment
- **Simplifies deployment**: No need for user management, sessions, or JWT handling

### Why Aggregation on Backend
- **Keeps summary calculation close to data**: MongoDB aggregation pipeline is efficient for grouping and summing
- **Avoids transferring all records**: Only the aggregated summary is sent to the frontend, not all expense records
- **Consistent calculations**: Backend ensures consistent logic regardless of frontend implementation
- **Performance**: MongoDB can perform aggregations more efficiently than JavaScript in the browser

## Project Structure

```
exp_tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection configuration
│   │   ├── controllers/
│   │   │   └── expenseController.js  # Business logic for expense operations
│   │   ├── middleware/
│   │   │   └── errorMiddleware.js     # Global error handling
│   │   ├── models/
│   │   │   └── Expense.js        # Mongoose schema and model
│   │   ├── routes/
│   │   │   └── expenseRoutes.js  # API route definitions
│   │   └── server.js             # Express server setup
│   ├── .env.example              # Environment variables template
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx   # Add/Edit expense form
│   │   │   ├── ExpenseItem.jsx   # Individual expense display
│   │   │   ├── ExpenseList.jsx   # List of expenses
│   │   │   ├── ExpenseFilters.jsx # Filtering controls
│   │   │   └── MonthlySummary.jsx # Monthly summary display
│   │   ├── services/
│   │   │   └── expenseApi.js     # API service layer
│   │   ├── App.jsx               # Main application component
│   │   ├── main.jsx              # React entry point
│   │   └── styles.css            # Global styles
│   ├── .env.example              # Environment variables template
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Setup

### 1. Clone/Open Project

Clone the repository or open the project directory in your IDE.

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file and add your MongoDB connection string:

```
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/expense_tracker
PORT=5000
```

**For local MongoDB:**
```
MONGO_URI=mongodb://localhost:27017/expense_tracker
PORT=5000
```

### 4. Start Backend

```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

### 5. Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 6. Start Frontend

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

**Expected URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## MongoDB Setup

### Using MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier is sufficient)
4. Create a database user with read/write permissions
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string from the Atlas dashboard
7. Replace the connection string in your backend `.env` file

### Using Local MongoDB

1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - Windows: Run as service or use `mongod` command
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. Use the local connection string: `mongodb://localhost:27017/expense_tracker`

## API Endpoints

### Expenses

- `GET /api/expenses` - Get all expenses with optional filters
  - Query params: `category`, `from`, `to`, `title`
- `GET /api/expenses/:id` - Get a single expense by ID
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/:id` - Update an existing expense
- `DELETE /api/expenses/:id` - Delete an expense

### Summary

- `GET /api/expenses/summary/monthly` - Get monthly summary with category breakdown

## What's Done vs Skipped

### Done

- ✅ Expense CRUD operations (Create, Read, Update, Delete)
- ✅ Monthly summary with total spend calculation
- ✅ Category breakdown in monthly summary
- ✅ Combined filtering (category + date range + title search)
- ✅ Input validation (frontend and backend)
- ✅ Empty states for no expenses and no filter results
- ✅ Error handling with user-friendly messages
- ✅ Loading states during API operations
- ✅ Responsive design for desktop and mobile
- ✅ Currency formatting for Indian Rupees (₹)
- ✅ Date handling with proper timezone considerations
- ✅ MongoDB aggregation for summary calculation
- ✅ Environment variable configuration
- ✅ Proper .gitignore files

### Intentionally Skipped

- ❌ Authentication: Explicitly outside the requested scope
- ❌ Multi-user support: Application is intended as a personal/single-user tracker
- ❌ Automated test suite: Not required for this scope
- ❌ Advanced analytics: Basic summary is sufficient for personal tracking
- ❌ Export to CSV/PDF: Not in requirements
- ❌ Recurring expenses: Not in requirements
- ❌ Budget tracking: Not in requirements
- ❌ Charts/visualizations: Text-based breakdown is sufficient
- ❌ Redux: React state is sufficient for this application size
- ❌ TypeScript: Plain JavaScript as specified

## Known Rough Edges

- **No authentication**: Anyone with access to the API can modify expenses. This is acceptable for a personal local application but not for production deployment.
- **No automated tests**: Manual testing is required to verify functionality.
- **Basic UI**: The design is functional but not pixel-perfect. Focus was on functionality over visual polish.
- **Timezone behavior**: Dates are stored and displayed based on browser/database configuration. Users in different timezones may see slight variations.
- **No data persistence backup**: No automated backup mechanism for MongoDB data.
- **Limited error recovery**: Some errors may require page refresh to recover.
- **No offline support**: Application requires active internet connection (for MongoDB Atlas) or local MongoDB instance.

## Development Notes

### Adding New Categories

To add a new expense category, update the following files:
1. `backend/src/models/Expense.js` - Add to the enum values
2. `frontend/src/components/ExpenseForm.jsx` - Add to the CATEGORIES array
3. `frontend/src/components/ExpenseFilters.jsx` - Add to the CATEGORIES array
4. `frontend/src/styles.css` - Add CSS class for the new category color

### Currency

The application uses Indian Rupees (₹) as the currency. Amounts are stored as numbers in MongoDB and formatted with the ₹ symbol in the UI using `Intl.NumberFormat`.

### Date Handling

Dates are stored as ISO Date objects in MongoDB. The frontend uses HTML5 date inputs which return YYYY-MM-DD format. The backend converts these to Date objects. Monthly summary calculations use the current calendar month boundaries.

## License

ISC
