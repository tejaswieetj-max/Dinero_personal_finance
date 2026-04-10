import React from 'react';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const { transactions, totalBalance } = useApp();

  // Display transactions (show mock entries if empty)
  const displayTransactions = transactions.length > 0 ? transactions : [
    { id: 'mock-1', date: '2026-04-10', desc: 'Initial Deposit', category: 'Income', amount: 2456200, type: 'credit' },
    { id: 'mock-2', date: '2026-04-09', desc: 'Salary Credit', category: 'Income', amount: 1500000, type: 'credit' },
    { id: 'mock-3', date: '2026-04-08', desc: 'Grocery Shopping', category: 'Food', amount: 3500, type: 'debit' },
    { id: 'mock-4', date: '2026-04-07', desc: 'Electric Bill', category: 'Bills', amount: 12840, type: 'debit' },
    { id: 'mock-5', date: '2026-04-06', desc: 'Restaurant', category: 'Food', amount: 2500, type: 'debit' },
  ];

  return (
    <div className="dashboard-content">
      {/* Net Worth Card */}
      <div className="net-worth-card">
        <h2>Net Worth</h2>
        <div className="balance-display">
          <span className="balance-amount">¥{(totalBalance / 100).toFixed(2)}</span>
        </div>
        <div className="balance-change">
          <span className="change-positive">+12.5%</span> from last month
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="transactions-section">
        <h3>Recent Transactions</h3>
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {displayTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.desc}</td>
                  <td>{transaction.category}</td>
                  <td className={transaction.type === 'credit' ? 'credit' : 'debit'}>
                    {transaction.type === 'credit' ? '+' : '-'}¥{(transaction.amount / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <h4>Monthly Income</h4>
          <p>¥15,000.00</p>
        </div>
        <div className="stat-card">
          <h4>Monthly Expenses</h4>
          <p>¥8,500.00</p>
        </div>
        <div className="stat-card">
          <h4>Savings Rate</h4>
          <p>43.3%</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
