import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <h1>Personal Expense Tracker</h1>
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/add" className={`nav-link ${isActive('/add')}`}>
              Add Expense
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/expenses" className={`nav-link ${isActive('/expenses')}`}>
              View Expenses
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
