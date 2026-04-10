import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Layout = ({ children }) => {
  const { user, totalBalance } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Apply dark theme by default
    document.body.classList.add('dark');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('dineroAppState');
    navigate('/login');
  };

  const toggleTheme = () => {
    document.body.classList.toggle('dark');
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Dinero</h2>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/bills">Bills</Link>
          <Link to="/goals">Goals</Link>
          <Link to="/splits">Splits</Link>
          <a className="logout-link" href="#" onClick={handleLogout}>Logout</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="page-header">
            <div className="page-title">
              <h1>Hi, {user?.name || 'User'}</h1>
              <p>Net Worth: <span className="amount positive">â{ (totalBalance / 100).toFixed(2) }</span></p>
            </div>
            <div className="header-actions">
              <button className="theme-toggle" onClick={toggleTheme}>ð</button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
