import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import '../public/css/main.css';
import '../public/css/dashboard.css';
import '../public/css/features.css';

// Mock backend data from original app.js
const MOCK_TRANSACTIONS = [
  { id: "trans-1", date: "2026-04-10", desc: "Initial Deposit", category: "Income", amount: 2456200, type: "credit" },
  { id: "trans-2", date: "2026-04-09", desc: "Salary Credit", category: "Income", amount: 1500000, type: "credit" },
  { id: "trans-3", date: "2026-04-08", desc: "Grocery Shopping", category: "Food", amount: 3500, type: "debit" },
  { id: "trans-4", date: "2026-04-07", desc: "Electric Bill Payment", category: "Bills", amount: 12840, type: "debit" },
  { id: "trans-5", date: "2026-04-06", desc: "Restaurant", category: "Food", amount: 2500, type: "debit" },
  { id: "trans-6", date: "2026-04-05", desc: "Gas Station", category: "Transport", amount: 4500, type: "debit" },
  { id: "trans-7", date: "2026-04-04", desc: "Internet Bill", category: "Bills", amount: 7999, type: "debit" },
  { id: "trans-8", date: "2026-04-03", desc: "Coffee Shop", category: "Food", amount: 850, type: "debit" },
  { id: "trans-9", date: "2026-04-02", desc: "Streaming Service", category: "Entertainment", amount: 1299, type: "debit" },
  { id: "trans-10", date: "2026-04-01", desc: "Freelance Payment", category: "Income", amount: 75000, type: "credit" }
];

const Transactions = () => {
  const { transactions } = useApp();
  
  // Use mock transactions if no transactions in state
  const displayTransactions = transactions.length > 0 ? transactions : MOCK_TRANSACTIONS;
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = displayTransactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = transaction.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalIncome = displayTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = displayTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="transactions-content">
      <div className="page-header">
        <div className="page-title">
          <h2>Transactions</h2>
          <p>View your complete transaction history</p>
        </div>
      </div>

      <div className="row">
        <div className="card">
          <div className="card-icon">ð</div>
          <h4>Total Income</h4>
          <p className="amount positive">â{(totalIncome / 100).toFixed(2)}</p>
          <div className="card-trend positive">
            <span>Money received</span>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">ð</div>
          <h4>Total Expenses</h4>
          <p className="amount negative">â{(totalExpenses / 100).toFixed(2)}</p>
          <div className="card-trend negative">
            <span>Money spent</span>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">â</div>
          <h4>Net</h4>
          <p className={`amount ${totalIncome - totalExpenses >= 0 ? 'positive' : 'negative'}`}>
            â{((totalIncome - totalExpenses) / 100).toFixed(2)}
          </p>
          <div className="card-trend">
            <span>Overall balance</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="panel">
        <div className="page-header">
          <div className="page-title">
            <h3>Filter Transactions</h3>
            <p>Search and filter your transaction history</p>
          </div>
        </div>
        <div className="row">
          <div style={{ flex: 2 }}>
            <input
              className="input"
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select 
              className="input"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="credit">Income</option>
              <option value="debit">Expenses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="panel">
        <div className="page-header">
          <div className="page-title">
            <h3>Transaction History</h3>
            <p>{filteredTransactions.length} transactions found</p>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.desc}</td>
                <td>{transaction.category}</td>
                <td>
                  <span className={`badge ${transaction.type === 'credit' ? 'paid' : 'overdue'}`}>
                    {transaction.type === 'credit' ? 'Income' : 'Expense'}
                  </span>
                </td>
                <td className={`amount ${transaction.type === 'credit' ? 'positive' : 'negative'}`}>
                  {transaction.type === 'credit' ? '+' : '-'}â{(transaction.amount / 100).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="panel">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>No transactions found</h3>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        </div>
      )}

      {displayTransactions.length === 0 && (
        <div className="panel">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>No transactions yet</h3>
            <p>Your transaction history will appear here once you start using the app.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
