import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

// Mock backend data from original app.js
const MOCK_SPLITS = [
  { id: "split-1", person: "Alex", note: "Dinner at Italian Restaurant", amount: 3500, isOwed: false },
  { id: "split-2", person: "Sarah", note: "Movie tickets and snacks", amount: 1800, isOwed: true },
  { id: "split-3", person: "Mike", note: "Uber ride to airport", amount: 2500, isOwed: false },
  { id: "split-4", person: "Emma", note: "Coffee shop meetup", amount: 850, isOwed: true },
  { id: "split-5", person: "John", note: "Shared groceries", amount: 4200, isOwed: false }
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
      <div className="splits-header">
        <h2>Split Tracker</h2>
        <button 
          className="add-split-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Split
        </button>
      </div>

      {/* Summary Cards */}
      <div className="splits-summary">
        <div className="summary-card owed">
          <h4>Total Owed to You</h4>
          <span className="amount positive">¥{(totalOwed / 100).toFixed(2)}</span>
        </div>
        <div className="summary-card you-owe">
          <h4>Total You Owe</h4>
          <span className="amount negative">¥{(totalYouOwe / 100).toFixed(2)}</span>
        </div>
        <div className="summary-card net">
          <h4>Net Balance</h4>
          <span className={`amount ${totalOwed - totalYouOwe >= 0 ? 'positive' : 'negative'}`}>
            ¥{((totalOwed - totalYouOwe) / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {showAddForm && (
        <div className="add-split-form">
          <h3>Add New Split</h3>
          <div className="form-group">
            <label>Person</label>
            <input
              type="text"
              value={newSplit.person}
              onChange={(e) => setNewSplit({...newSplit, person: e.target.value})}
              placeholder="e.g., Alex"
            />
          </div>
          <div className="form-group">
            <label>Note</label>
            <input
              type="text"
              value={newSplit.note}
              onChange={(e) => setNewSplit({...newSplit, note: e.target.value})}
              placeholder="e.g., Dinner at Italian Restaurant"
            />
          </div>
          <div className="form-group">
            <label>Amount (¥)</label>
            <input
              type="number"
              value={newSplit.amount}
              onChange={(e) => setNewSplit({...newSplit, amount: e.target.value})}
              placeholder="35.00"
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={newSplit.isOwed}
                onChange={(e) => setNewSplit({...newSplit, isOwed: e.target.checked})}
              />
              They owe you (uncheck if you owe them)
            </label>
          </div>
          <div className="form-actions">
            <button onClick={handleAddSplit} className="btn primary">Add Split</button>
            <button onClick={() => setShowAddForm(false)} className="btn secondary">Cancel</button>
          </div>
        </div>
      )}

      <div className="splits-table">
        <table>
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
                <td>¥{(split.amount / 100).toFixed(2)}</td>
                <td>
                  <span className={`split-type ${split.isOwed ? 'owed' : 'you-owe'}`}>
                    {split.isOwed ? 'Owed to You' : 'You Owe'}
                  </span>
                </td>
                <td>
                  <span className="status-pending">Pending</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displaySplits.length === 0 && (
        <div className="no-splits">
          <h3>No splits yet</h3>
          <p>Start tracking shared expenses with friends!</p>
        </div>
      )}
    </div>
  );
};

export default Splits;
