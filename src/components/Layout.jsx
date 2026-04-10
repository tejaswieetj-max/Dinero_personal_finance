import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Layout = ({ children }) => {
  const { user, totalBalance } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('dineroAppState');
    navigate('/login');
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
      <main>
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="user-info">
              <h1>Hi, {user?.name || 'User'}</h1>
              <p className="balance-display">
                Net Worth: <span className="balance-amount">¥{(totalBalance / 100).toFixed(2)}</span>
              </p>
            </div>
            <div className="header-actions">
              <button className="theme-toggle">ð</button>
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
