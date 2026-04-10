import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import '../public/css/main.css';
import '../public/css/dashboard.css';
import '../public/css/features.css';

// Mock backend data from original app.js
const MOCK_SPLITS = [
  { id: "split-1", person: "Tejas", note: "Dinner at Italian Restaurant", amount: 3500, isOwed: false },
  { id: "split-2", person: "Zeph", note: "Movie tickets and snacks", amount: 1800, isOwed: true },
  { id: "split-3", person: "Abir", note: "Uber ride to airport", amount: 2500, isOwed: false },
  { id: "split-4", person: "Divya", note: "Coffee shop meetup", amount: 850, isOwed: true },
  { id: "split-5", person: "Mrini", note: "Shared groceries", amount: 4200, isOwed: false }
];

const Splits = () => {
  const { splits, addSplit } = useApp();
  
  // Use mock splits if no splits in state
  const displaySplits = splits.length > 0 ? splits : MOCK_SPLITS;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSplit, setNewSplit] = useState({
    person: '',
    note: '',
    amount: '',
    isOwed: false
  });

  const totalOwed = displaySplits
    .filter(split => split.isOwed)
    .reduce((sum, split) => sum + split.amount, 0);
  
  const totalYouOwe = displaySplits
    .filter(split => !split.isOwed)
    .reduce((sum, split) => sum + split.amount, 0);

  const handleAddSplit = () => {
    if (!newSplit.person || !newSplit.note || !newSplit.amount) {
      alert('Please fill in all fields');
      return;
    }

    const splitData = {
      ...newSplit,
      amount: parseFloat(newSplit.amount) * 100 // Convert to cents
    };

    addSplit(splitData);
    setShowAddForm(false);
    setNewSplit({ person: '', note: '', amount: '', isOwed: false });
  };

  return (
    <div className="splits-content">
      <div className="page-header">
        <div className="page-title">
          <h2>Split Tracker</h2>
          <p>Manage shared expenses and debt tracking</p>
        </div>
        <button 
          className="btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Split
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row">
        <div className="card">
          <div className="card-icon">ð</div>
          <h4>Total Owed to You</h4>
          <p className="amount positive">â{(totalOwed / 100).toFixed(2)}</p>
          <div className="card-trend positive">
            <span>Amount to collect</span>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">ð</div>
          <h4>Total You Owe</h4>
          <p className="amount negative">â{(totalYouOwe / 100).toFixed(2)}</p>
          <div className="card-trend negative">
            <span>Amount to pay</span>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">â</div>
          <h4>Net Balance</h4>
          <p className={`amount ${totalOwed - totalYouOwe >= 0 ? 'positive' : 'negative'}`}>
            â{((totalOwed - totalYouOwe) / 100).toFixed(2)}
          </p>
          <div className="card-trend">
            <span>Overall position</span>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="panel">
          <div className="page-header">
            <div className="page-title">
              <h3>Add New Split</h3>
              <p>Record a shared expense</p>
            </div>
          </div>
          <div className="row">
            <div>
              <label>Person</label>
              <input
                className="input"
                type="text"
                value={newSplit.person}
                onChange={(e) => setNewSplit({...newSplit, person: e.target.value})}
                placeholder="e.g., Tejas"
              />
            </div>
            <div>
              <label>Amount (â)</label>
              <input
                className="input"
                type="number"
                value={newSplit.amount}
                onChange={(e) => setNewSplit({...newSplit, amount: e.target.value})}
                placeholder="35.00"
              />
            </div>
          </div>
          <div>
            <label>Note</label>
            <input
              className="input"
              type="text"
              value={newSplit.note}
              onChange={(e) => setNewSplit({...newSplit, note: e.target.value})}
              placeholder="e.g., Dinner at Italian Restaurant"
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ margin: '16px 0' }}>
            <label>
              <input
                type="checkbox"
                checked={newSplit.isOwed}
                onChange={(e) => setNewSplit({...newSplit, isOwed: e.target.checked})}
              />
              They owe you (uncheck if you owe them)
            </label>
          </div>
          <div className="row">
            <button onClick={handleAddSplit} className="btn">Add Split</button>
            <button onClick={() => setShowAddForm(false)} className="btn secondary">Cancel</button>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="page-header">
          <div className="page-title">
            <h3>All Splits</h3>
            <p>View and manage your shared expenses</p>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Person</th>
              <th>Note</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displaySplits.map((split) => (
              <tr key={split.id}>
                <td>{split.person}</td>
                <td>{split.note}</td>
                <td className="amount">â{(split.amount / 100).toFixed(2)}</td>
                <td>
                  <span className={`badge ${split.isOwed ? 'paid' : 'overdue'}`}>
                    {split.isOwed ? 'Owed to You' : 'You Owe'}
                  </span>
                </td>
                <td>
                  <span className="badge upcoming">Pending</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displaySplits.length === 0 && (
        <div className="panel">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>No splits yet</h3>
            <p>Start tracking shared expenses with friends!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Splits;
