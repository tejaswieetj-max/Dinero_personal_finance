import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import '../css/main.css';
import '../css/dashboard.css';
import '../css/features.css';

// Mock backend data from original app.js
const MOCK_BILLS = [
  { id: "bill-1", name: "Electricity • City Power", due: "2026-04-14", amount: 12840, status: "unpaid" },
  { id: "bill-2", name: "Internet • FiberNet", due: "2026-04-16", amount: 7999, status: "unpaid" },
  { id: "bill-3", name: "Credit Card • NeoBank", due: "2026-04-20", amount: 20386, status: "unpaid" },
  { id: "bill-4", name: "Streaming • DineroFlix", due: "2026-04-02", amount: 1299, status: "paid" },
  { id: "bill-5", name: "Phone • MobileCo", due: "2026-03-29", amount: 8701, status: "unpaid" }
];

const Bills = () => {
  const { bills, payBill, addBill, addTransaction } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBill, setNewBill] = useState({
    name: '',
    amount: '',
    due: ''
  });
  
  // Use mock bills if no bills in state
  const displayBills = bills.length > 0 ? bills : MOCK_BILLS;

  const handlePayBill = (billId) => {
    if (window.confirm('Are you sure you want to pay this bill?')) {
      const bill = displayBills.find(b => b.id === billId);
      if (bill) {
        // Mark bill as paid
        payBill(billId);
        // Create transaction entry
        addTransaction({
          id: `tx-bill-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          desc: bill.name,
          category: 'Bills',
          amount: bill.amount,
          type: 'debit'
        });
      }
    }
  };

  const handleAddBill = () => {
    if (!newBill.name || !newBill.amount || !newBill.due) {
      alert('Please fill in all fields');
      return;
    }
    
    const billToAdd = {
      id: `bill-${Date.now()}`,
      name: newBill.name,
      amount: parseFloat(newBill.amount) * 100, // Convert to cents
      due: newBill.due,
      status: 'unpaid'
    };
    
    addBill(billToAdd);
    setNewBill({ name: '', amount: '', due: '' });
    setShowAddForm(false);
  };

  const getStatusBadge = (status) => {
    return status === 'paid' ? 'badge paid' : 'badge unpaid';
  };

  const getStatusText = (status) => {
    return status === 'paid' ? 'Paid' : 'Unpaid';
  };

  const unpaidBills = displayBills.filter(bill => bill.status === 'unpaid');
  const paidBills = displayBills.filter(bill => bill.status === 'paid');
  const totalDue = unpaidBills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="bills-content">
      <div className="page-header">
        <div className="page-title">
          <h2>Bills</h2>
          <p>Manage and track your recurring payments</p>
        </div>
      </div>

      <div className="row">
        <div className="panel">
          <h4>Unpaid Bills</h4>
          <p className="amount negative">{unpaidBills.length}</p>
        </div>
        <div className="panel">
          <h4>Paid Bills</h4>
          <p className="amount positive">{paidBills.length}</p>
        </div>
        <div className="panel">
          <h4>Total Due</h4>
          <p className="amount negative"><span className="rupee-symbol">₹</span>{(totalDue / 100).toFixed(2)}</p>
        </div>
      </div>

      {showAddForm && (
        <div className="panel">
          <div className="page-header">
            <div className="page-title">
              <h3>Add New Bill</h3>
              <p>Enter bill details</p>
            </div>
          </div>
          <div className="row">
            <div>
              <label>Bill Name</label>
              <input
                className="input"
                type="text"
                value={newBill.name}
                onChange={(e) => setNewBill({...newBill, name: e.target.value})}
                placeholder="e.g., Electricity • City Power"
              />
            </div>
            <div>
              <label>Amount (<span className="rupee-symbol">₹</span>)</label>
              <input
                className="input"
                type="number"
                value={newBill.amount}
                onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                placeholder="128.40"
              />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Due Date</label>
              <input
                className="input"
                type="date"
                value={newBill.due}
                onChange={(e) => setNewBill({...newBill, due: e.target.value})}
              />
            </div>
          </div>
          <div className="row">
            <button onClick={handleAddBill} className="btn">Add Bill</button>
            <button onClick={() => setShowAddForm(false)} className="btn secondary">Cancel</button>
          </div>
        </div>
      )}

      <div className="row" style={{ marginBottom: '20px' }}>
        <button 
          className="btn"
          onClick={() => setShowAddForm(true)}
          style={{ width: '100%' }}
        >
          + Add Bill
        </button>
      </div>

      <div className="panel">
        <div className="page-header">
          <div className="page-title">
            <h3>All Bills</h3>
            <p>View and manage your bill payments</p>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Bill Name</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayBills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.name}</td>
                <td>{bill.due}</td>
                <td className="amount"><span className="rupee-symbol">₹</span>{(bill.amount / 100).toFixed(2)}</td>
                <td>
                  <span className={`badge ${bill.status === 'paid' ? 'paid' : 'overdue'}`}>
                    {getStatusText(bill.status)}
                  </span>
                </td>
                <td>
                  {bill.status === 'unpaid' && (
                    <button 
                      className="btn"
                      onClick={() => handlePayBill(bill.id)}
                    >
                      Pay Bill
                    </button>
                  )}
                  {bill.status === 'paid' && (
                    <span className="badge paid"><span className="rupee-symbol">₹</span> Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {unpaidBills.length === 0 && (
        <div className="panel">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>All bills paid! ð</h3>
            <p>You're all caught up on your bills.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;
