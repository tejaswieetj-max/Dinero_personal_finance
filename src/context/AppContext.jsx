import React, { createContext, useContext, useEffect, useState } from 'react';

// Initial data models
const initialState = {
  user: null,
  totalBalance: 2456200, // stored in cents
  transactions: [
    {
      id: 'trans-1',
      date: '2026-04-10',
      desc: 'Initial Deposit',
      category: 'Income',
      amount: 2456200,
      type: 'credit'
    }
  ],
  bills: [
    {
      id: 'bill-1',
      name: 'Electricity - City Power',
      due: '2026-04-15',
      amount: 12840,
      status: 'unpaid'
    },
    {
      id: 'bill-2',
      name: 'Internet - FiberNet',
      due: '2026-04-18',
      amount: 7999,
      status: 'unpaid'
    },
    {
      id: 'bill-3',
      name: 'Credit Card - NeoBank',
      due: '2026-04-20',
      amount: 20386,
      status: 'unpaid'
    }
  ],
  goals: [
    {
      id: 'goal-1',
      title: 'Emergency Fund',
      target: 1000000,
      current: 250000,
      deadline: '2026-12-31'
    },
    {
      id: 'goal-2',
      title: 'Vacation Fund',
      target: 500000,
      current: 100000,
      deadline: '2026-08-15'
    }
  ],
  splits: [
    {
      id: 'split-1',
      person: 'Alex',
      note: 'Dinner at Italian Restaurant',
      amount: 3500,
      isOwed: false
    },
    {
      id: 'split-2',
      person: 'Sarah',
      note: 'Movie tickets and snacks',
      amount: 1800,
      isOwed: true
    }
  ]
};

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('dineroAppState');
    if (savedState) {
      try {
        setState(JSON.parse(savedState));
      } catch (error) {
        console.error('Error loading state from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('dineroAppState', JSON.stringify(state));
  }, [state]);

  // Bill payment logic
  const payBill = (billId) => {
    setState(prevState => {
      const updatedBills = prevState.bills.map(bill => 
        bill.id === billId ? { ...bill, status: 'paid' } : bill
      );
      
      const bill = prevState.bills.find(b => b.id === billId);
      
      if (bill && bill.status === 'unpaid') {
        const newTransaction = {
          id: `trans-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          desc: `Bill Payment: ${bill.name}`,
          category: 'Bills',
          amount: bill.amount,
          type: 'debit'
        };

        return {
          ...prevState,
          totalBalance: prevState.totalBalance - bill.amount,
          bills: updatedBills,
          transactions: [newTransaction, ...prevState.transactions]
        };
      }
      
      return { ...prevState, bills: updatedBills };
    });
  };

  // Goal progress logic
  const updateGoalProgress = (goalId, amount) => {
    setState(prevState => ({
      ...prevState,
      goals: prevState.goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, current: Math.min(goal.current + amount, goal.target) }
          : goal
      ),
      totalBalance: prevState.totalBalance - amount,
      transactions: [
        {
          id: `trans-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          desc: `Goal Funding: ${prevState.goals.find(g => g.id === goalId)?.title}`,
          category: 'Goals',
          amount,
          type: 'debit'
        },
        ...prevState.transactions
      ]
    }));
  };

  // Split management
  const addSplit = (split) => {
    setState(prevState => ({
      ...prevState,
      splits: [...prevState.splits, { ...split, id: `split-${Date.now()}` }]
    }));
  };

  // User authentication
  const setUser = (user) => {
    setState(prevState => ({ ...prevState, user }));
  };

  const value = {
    ...state,
    payBill,
    updateGoalProgress,
    addSplit,
    setUser,
    setState
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
