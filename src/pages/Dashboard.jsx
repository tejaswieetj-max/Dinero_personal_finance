import React from 'react';
import { useApp } from '../context/AppContext';

// Mock backend data from original app.js
const MOCK_TRANSACTIONS = [
  { id: "trans-1", date: "2026-04-10", desc: "Initial Deposit", category: "Income", amount: 2456200, type: "credit" },
  { id: "trans-2", date: "2026-04-09", desc: "Salary Credit", category: "Income", amount: 1500000, type: "credit" },
  { id: "trans-3", date: "2026-04-08", desc: "Grocery Shopping", category: "Food", amount: 3500, type: "debit" },
  { id: "trans-4", date: "2026-04-07", desc: "Electric Bill Payment", category: "Bills", amount: 12840, type: "debit" },
  { id: "trans-5", date: "2026-04-06", desc: "Restaurant", category: "Food", amount: 2500, type: "debit" }
];

const Dashboard = () => {
  const { transactions, totalBalance, user } = useApp();

  // Display transactions (show mock entries if empty)
  const displayTransactions = transactions.length > 0 ? transactions : MOCK_TRANSACTIONS;

  return (
    <div className="dashboard-content">
      {/* Net Worth Card */}
      <div className="virtual-card">
        <div className="virtual-card-left">
          <div className="virtual-card-label">Total Balance</div>
          <div className="virtual-card-number">â{(totalBalance / 100).toFixed(2)}</div>
          <div className="virtual-card-holder">
            <strong>{user?.name || 'User'}</strong>
            Primary Account
          </div>
        </div>
        <div className="virtual-card-right">
          <div className="virtual-card-tag">DINERO</div>
          <div className="virtual-card-expiry">
            VALID
            <strong>THRU</strong>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="cards">
        <div className="card">
          <div className="card-icon">ð</div>
          <h3>Monthly Income</h3>
          <p className="amount positive">â15,000.00</p>
          <div className="card-trend positive">
            <span>+</span> 8.2% from last month
          </div>
        </div>
        <div className="card">
          <div className="card-icon">ð</div>
          <h3>Monthly Expenses</h3>
          <p className="amount negative">â8,500.00</p>
          <div className="card-trend negative">
            <span>+</span> 3.1% from last month
          </div>
        </div>
        <div className="card">
          <div className="card-icon">ð</div>
          <h3>Savings Rate</h3>
          <p className="amount positive">43.3%</p>
          <div className="card-trend positive">
            <span>+</span> 2.4% from last month
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="panel">
        <div className="page-header">
          <div className="page-title">
            <h2>Recent Transactions</h2>
            <p>Your latest financial activity</p>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {displayTransactions.slice(0, 5).map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.desc}</td>
                <td>{transaction.category}</td>
                <td className={`amount ${transaction.type === 'credit' ? 'positive' : 'negative'}`}>
                  {transaction.type === 'credit' ? '+' : '-'}â{(transaction.amount / 100).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
