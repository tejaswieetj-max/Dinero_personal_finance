import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

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
      <div className="goals-header">
        <h2>Savings Goals</h2>
        <button 
          className="add-goal-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Goal
        </button>
      </div>

      {showAddForm && (
        <div className="add-goal-form">
          <h3>Create New Goal</h3>
          <div className="form-group">
            <label>Goal Title</label>
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              placeholder="e.g., Emergency Fund"
            />
          </div>
          <div className="form-group">
            <label>Target Amount (¥)</label>
            <input
              type="number"
              value={newGoal.target}
              onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
              placeholder="100000"
            />
          </div>
          <div className="form-group">
            <label>Current Amount (¥)</label>
            <input
              type="number"
              value={newGoal.current}
              onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
              placeholder="0"
            />
          </div>
          <div className="form-group">
            <label>Deadline</label>
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button onClick={handleAddGoal} className="btn primary">Create Goal</button>
            <button onClick={() => setShowAddForm(false)} className="btn secondary">Cancel</button>
          </div>
        </div>
      )}

      <div className="goals-grid">
        {displayGoals.map((goal) => {
          const progress = calculateProgress(goal.current, goal.target);
          const remaining = goal.target - goal.current;
          
          return (
            <div key={goal.id} className="goal-card">
              <div className="goal-header">
                <h3>{goal.title}</h3>
                <span className="goal-deadline">Due: {goal.deadline}</span>
              </div>
              
              <div className="goal-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="progress-text">
                  {progress.toFixed(1)}% Complete
                </div>
              </div>
              
              <div className="goal-amounts">
                <div className="amount-row">
                  <span>Current:</span>
                  <span>¥{(goal.current / 100).toFixed(2)}</span>
                </div>
                <div className="amount-row">
                  <span>Target:</span>
                  <span>¥{(goal.target / 100).toFixed(2)}</span>
                </div>
                <div className="amount-row remaining">
                  <span>Remaining:</span>
                  <span>¥{(remaining / 100).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="goal-actions">
                <button 
                  className="fund-btn"
                  onClick={() => handleFundGoal(goal.id)}
                  disabled={progress >= 100}
                >
                  {progress >= 100 ? 'Completed! ð' : 'Fund Goal'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {displayGoals.length === 0 && (
        <div className="no-goals">
          <h3>No goals yet</h3>
          <p>Start by creating your first savings goal!</p>
        </div>
      )}
    </div>
  );
};

export default Goals;
