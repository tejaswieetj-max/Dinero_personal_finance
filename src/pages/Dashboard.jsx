import React from 'react';
import { useApp } from '../context/AppContext';
import '../css/main.css';
import '../css/dashboard.css';

// Mock backend data from original app.js
const MOCK_TRANSACTIONS = [
  { id: "trans-1", date: "2026-04-10", desc: "Initial Deposit", category: "Income", amount: 2456200, type: "credit" },
  { id: "trans-2", date: "2026-04-09", desc: "Salary Credit", category: "Income", amount: 1500000, type: "credit" },
  { id: "trans-3", date: "2026-04-08", desc: "Grocery Shopping", category: "Food", amount: 3500, type: "debit" },
  { id: "trans-4", date: "2026-04-07", desc: "Electric Bill Payment", category: "Bills", amount: 12840, type: "debit" },
  { id: "trans-5", date: "2026-04-06", desc: "Restaurant", category: "Food", amount: 2500, type: "debit" }
];

const Dashboard = () => {
  const { transactions, totalBalance, user, bills, goals } = useApp();

  // Display transactions (show mock entries if empty)
  const displayTransactions = transactions.length > 0 ? transactions : MOCK_TRANSACTIONS;

  // Calculate monthly income from transactions
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyIncome = displayTransactions
    .filter(tx => tx.type === 'credit' && 
      new Date(tx.date).getMonth() === currentMonth && 
      new Date(tx.date).getFullYear() === currentYear)
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate remaining bills for current month
  const currentMonthBills = bills.filter(bill => {
    const billDate = new Date(bill.due);
    return billDate.getMonth() === currentMonth && 
           billDate.getFullYear() === currentYear && 
           bill.status === 'unpaid';
  });
  const totalRemainingBills = currentMonthBills.reduce((sum, bill) => sum + bill.amount, 0);

  // Calculate remaining goals for current month
  const currentMonthGoals = goals.filter(goal => {
    const goalDate = new Date(goal.deadline);
    return goalDate.getMonth() === currentMonth && 
           goalDate.getFullYear() === currentYear &&
           goal.current < goal.target;
  });
  const totalRemainingGoals = currentMonthGoals.reduce((sum, goal) => sum + (goal.target - goal.current), 0);

  // Calculate financial health
  const totalAvailable = monthlyIncome + totalBalance;
  const totalObligations = totalRemainingBills + totalRemainingGoals;
  const financialHealth = totalAvailable - totalObligations;

  const isMonthCovered = financialHealth >= 0;

  return (
    <div className="dashboard-content">
      {/* Net Worth Card */}
      <div className="virtual-card">
        <div className="virtual-card-left">
          <div className="virtual-card-label">Total Balance</div>
          <div className="virtual-card-number"><span className="rupee-symbol">₹</span>{(totalBalance / 100).toFixed(2)}</div>
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
          <p className="amount positive"><span className="rupee-symbol">₹</span>15,000.00</p>
          <div className="card-trend positive">
            <span>+</span> 8.2% from last month
          </div>
        </div>
        <div className="card">
          <div className="card-icon">ð</div>
          <h3>Monthly Expenses</h3>
          <p className="amount negative"><span className="rupee-symbol">₹</span>8,500.00</p>
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

      {/* Monthly Financial Health Card */}
      <div className="card" style={{
        background: isMonthCovered ? 
          'linear-gradient(135deg, #065f46, #047857)' : 
          'linear-gradient(135deg, #7f1d1d, #991b1b)',
        color: 'white',
        border: 'none'
      }}>
        <div className="card-icon">💰</div>
        <h3>Monthly Financial Health</h3>
        <div style={{ margin: '16px 0' }}>
          {isMonthCovered ? (
            <div style={{ color: '#4ade80', fontSize: '1.2rem', fontWeight: '700' }}>
              Your month is covered!
            </div>
          ) : (
            <div style={{ color: '#f87171', fontSize: '1.2rem', fontWeight: '700' }}>
              You are short <span className="rupee-symbol">₹</span>
              {Math.abs(financialHealth / 100).toFixed(2)} this month!
            </div>
          )}
        </div>
        <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>
          Available: <span className="rupee-symbol">₹</span>{(totalAvailable / 100).toFixed(2)} | 
          Obligations: <span className="rupee-symbol">₹</span>{(totalObligations / 100).toFixed(2)}
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
                  {transaction.type === 'credit' ? '+' : '-'}<span className="rupee-symbol">₹</span>{(transaction.amount / 100).toFixed(2)}
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
