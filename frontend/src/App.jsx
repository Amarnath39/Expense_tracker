import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddExpense from './pages/AddExpense';
import ViewExpenses from './pages/ViewExpenses';
import Toast from './components/Toast';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/expenses" element={<ViewExpenses />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
