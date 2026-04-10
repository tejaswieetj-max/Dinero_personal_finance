import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import '../css/main.css';
import '../css/dashboard.css';
import '../css/features.css';

// Mock backend data from original app.js
const MOCK_GOALS = [
  { id: "goal-1", title: "Emergency Fund", target: 1000000, current: 250000, deadline: "2026-12-31" },
  { id: "goal-2", title: "Vacation Fund", target: 500000, current: 100000, deadline: "2026-08-15" },
  { id: "goal-3", title: "New Laptop", target: 150000, current: 75000, deadline: "2026-06-30" },
  { id: "goal-4", title: "Home Renovation", target: 2000000, current: 500000, deadline: "2027-03-31" }
];

const Goals = () => {
  const { goals, updateGoalProgress, totalBalance } = useApp();
  
  // Use mock goals if no goals in state
  const displayGoals = goals.length > 0 ? goals : MOCK_GOALS;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    current: '',
    deadline: ''
  });

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    // This would add a new goal to the state
    // For now, we'll just close the form
    setShowAddForm(false);
    setNewGoal({ title: '', target: '', current: '', deadline: '' });
  };

  const handleFundGoal = (goalId, amount) => {
    const fundAmount = prompt(`Enter amount to fund (in rupees):`);
    if (fundAmount && !isNaN(fundAmount)) {
      const amountInCents = parseFloat(fundAmount) * 100;
      if (amountInCents <= totalBalance) {
        updateGoalProgress(goalId, amountInCents);
      } else {
        alert('Insufficient balance');
      }
    }
  };

  return (
    <div className="goals-content">
      <div className="page-header">
        <div className="page-title">
          <h2>Savings Goals</h2>
          <p>Track your financial targets and progress</p>
        </div>
        <button 
          className="btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Goal
        </button>
      </div>

      {showAddForm && (
        <div className="panel">
          <div className="page-header">
            <div className="page-title">
              <h3>Create New Goal</h3>
              <p>Set a new savings target</p>
            </div>
          </div>
          <div className="row">
            <div>
              <label>Goal Title</label>
              <input
                className="input"
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                placeholder="e.g., Emergency Fund"
              />
            </div>
            <div>
              <label>Target Amount (<span className="rupee-symbol">₹</span>)</label>
              <input
                className="input"
                type="number"
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                placeholder="100000"
              />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Current Amount (<span className="rupee-symbol">₹</span>)</label>
              <input
                className="input"
                type="number"
                value={newGoal.current}
                onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <label>Deadline</label>
              <input
                className="input"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
              />
            </div>
          </div>
          <div className="row">
            <button onClick={handleAddGoal} className="btn">Create Goal</button>
            <button onClick={() => setShowAddForm(false)} className="btn secondary">Cancel</button>
          </div>
        </div>
      )}

      <div className="cards">
        {displayGoals.map((goal) => {
          const progress = calculateProgress(goal.current, goal.target);
          const remaining = goal.target - goal.current;
          
          return (
            <div key={goal.id} className="card">
              <div className="card-icon">ð</div>
              <h3>{goal.title}</h3>
              <p className="amount positive"><span className="rupee-symbol">₹</span>{(goal.current / 100).toFixed(2)} / <span className="rupee-symbol">₹</span>{(goal.target / 100).toFixed(2)}</p>
              <div className="card-trend positive">
                <span>{progress.toFixed(1)}% Complete</span>
              </div>
              <small>Due: {goal.deadline}</small>
              <div style={{ marginTop: '12px' }}>
                <button 
                  className="btn"
                  onClick={() => handleFundGoal(goal.id)}
                  disabled={progress >= 100}
                  style={{ width: '100%' }}
                >
                  {progress >= 100 ? 'Completed! ð' : 'Fund Goal'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {displayGoals.length === 0 && (
        <div className="panel">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>No goals yet</h3>
            <p>Start by creating your first savings goal!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
