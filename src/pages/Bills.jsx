import React from 'react';
import { useApp } from '../context/AppContext';

// Mock backend data from original app.js
const MOCK_BILLS = [
  { id: "bill-1", name: "Electricity • City Power", due: "2026-04-14", amount: 12840, status: "unpaid" },
  { id: "bill-2", name: "Internet • FiberNet", due: "2026-04-16", amount: 7999, status: "unpaid" },
  { id: "bill-3", name: "Credit Card • NeoBank", due: "2026-04-20", amount: 20386, status: "unpaid" },
  { id: "bill-4", name: "Streaming • DineroFlix", due: "2026-04-02", amount: 1299, status: "paid" },
  { id: "bill-5", name: "Phone • MobileCo", due: "2026-03-29", amount: 8701, status: "unpaid" }
];

const Bills = () => {
  const { bills, payBill } = useApp();
  
  // Use mock bills if no bills in state
  const displayBills = bills.length > 0 ? bills : MOCK_BILLS;

  const handlePayBill = (billId) => {
    if (window.confirm('Are you sure you want to pay this bill?')) {
      payBill(billId);
    }
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
      <div className="bills-header">
        <h2>Bills</h2>
        <div className="bills-summary">
          <div className="summary-card">
            <h4>Unpaid Bills</h4>
            <span className="count">{unpaidBills.length}</span>
          </div>
          <div className="summary-card">
            <h4>Paid Bills</h4>
            <span className="count">{paidBills.length}</span>
          </div>
          <div className="summary-card">
            <h4>Total Due</h4>
            <span className="amount">¥{(totalDue / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bills-table">
        <table>
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
                <td>¥{(bill.amount / 100).toFixed(2)}</td>
                <td>
                  <span className={getStatusBadge(bill.status)}>
                    {getStatusText(bill.status)}
                  </span>
                </td>
                <td>
                  {bill.status === 'unpaid' && (
                    <button 
                      className="pay-btn"
                      onClick={() => handlePayBill(bill.id)}
                    >
                      Pay Bill
                    </button>
                  )}
                  {bill.status === 'paid' && (
                    <span className="paid-indicator">â Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {unpaidBills.length === 0 && (
        <div className="no-bills">
          <h3>All bills paid! ð</h3>
          <p>You're all caught up on your bills.</p>
        </div>
      )}
    </div>
  );
};

export default Bills;
