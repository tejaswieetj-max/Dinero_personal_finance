import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import '../css/main.css';
import '../css/dashboard.css';
import '../css/features.css';

const Report = () => {
  const { user } = useApp();
  const [reportData, setReportData] = useState({
    grade: '?',
    month: 'Month',
    savingsRate: 0,
    savingsProgress: 0,
    topCategory: 'None',
    biggestExpense: 'None',
    budgetBreaches: 0,
    anomalies: 0
  });

  // Mock data for report
  const MOCK_TRANSACTIONS = [
    { id: "trans-1", date: "2026-04-10", desc: "Initial Deposit", category: "Income", amount: 2456200, type: "credit" },
    { id: "trans-2", date: "2026-04-09", desc: "Salary Credit", category: "Income", amount: 1500000, type: "credit" },
    { id: "trans-3", date: "2026-04-08", desc: "Grocery Shopping", category: "Food", amount: 3500, type: "debit" },
    { id: "trans-4", date: "2026-04-07", desc: "Electric Bill Payment", category: "Bills", amount: 12840, type: "debit" },
    { id: "trans-5", date: "2026-04-06", desc: "Restaurant", category: "Food", amount: 2500, type: "debit" },
    { id: "trans-6", date: "2026-04-05", desc: "Gas Station", category: "Transport", amount: 4500, type: "debit" },
    { id: "trans-7", date: "2026-04-04", desc: "Internet Bill", category: "Bills", amount: 7999, type: "debit" },
    { id: "trans-8", date: "2026-04-03", desc: "Shopping", category: "Shopping", amount: 15000, type: "debit" }
  ];

  useEffect(() => {
    generateReport();
  }, []);

  const formatCurrency = (cents) => {
    return `₹${Math.abs(cents / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const generateReport = () => {
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Calculate savings rate
    const income = MOCK_TRANSACTIONS.filter(tx => tx.type === 'credit').reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = MOCK_TRANSACTIONS.filter(tx => tx.type === 'debit').reduce((sum, tx) => sum + tx.amount, 0);
    const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0;
    
    // Find top spending category
    const categorySpending = {};
    MOCK_TRANSACTIONS.filter(tx => tx.type === 'debit').forEach(tx => {
      categorySpending[tx.category] = (categorySpending[tx.category] || 0) + tx.amount;
    });
    const topCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];
    
    // Find biggest expense
    const biggestExpense = MOCK_TRANSACTIONS.filter(tx => tx.type === 'debit')
      .sort((a, b) => b.amount - a.amount)[0];
    
    // Calculate grade based on savings rate
    let grade = '?';
    if (savingsRate >= 30) grade = 'A+';
    else if (savingsRate >= 20) grade = 'A';
    else if (savingsRate >= 15) grade = 'B';
    else if (savingsRate >= 10) grade = 'C';
    else if (savingsRate >= 5) grade = 'D';
    else grade = 'F';

    setReportData({
      grade,
      month: currentMonth,
      savingsRate: parseFloat(savingsRate),
      savingsProgress: Math.min(parseFloat(savingsRate), 100),
      topCategory: topCategory ? `${topCategory[0]} (${formatCurrency(topCategory[1])})` : 'None',
      biggestExpense: biggestExpense ? `${biggestExpense.desc} (${formatCurrency(biggestExpense.amount)})` : 'None',
      budgetBreaches: Math.floor(Math.random() * 3), // Mock data
      anomalies: Math.floor(Math.random() * 2) // Mock data
    });
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="content">
      <div className="page-header">
        <div className="page-title">
          <h1>Report Card</h1>
          <p>Your financial performance this month.</p>
        </div>
      </div>

      <div className="report-card" style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: 'white',
        borderRadius: '30px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(45, 183, 132, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '60px',
          background: 'var(--primary)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '4rem',
          fontWeight: '900',
          margin: '0 auto 24px',
          boxShadow: '0 0 30px var(--primary)'
        }}>
          {reportData.grade}
        </div>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>{reportData.month}</h2>
        <p style={{ opacity: '0.7', marginBottom: '32px' }}>Financial Performance Summary</p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '20px',
          marginBottom: '16px'
        }}>
          <small style={{ opacity: '0.7', textTransform: 'uppercase', letterSpacing: '1px' }}>Savings Rate</small>
          <h1 style={{ fontSize: '3rem', margin: '8px 0' }}>{reportData.savingsRate}%</h1>
          <div className="progress-container" style={{ maxWidth: '200px', margin: '0 auto', background: 'rgba(255,255,255,0.1)' }}>
            <div 
              className="progress-bar" 
              style={{ width: `${reportData.savingsProgress}%` }}
            ></div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginTop: '24px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '20px',
            marginBottom: '16px'
          }}>
            <small style={{ opacity: '0.7' }}>Top Spending</small>
            <h3 style={{ marginTop: '8px' }}>{reportData.topCategory}</h3>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '20px',
            marginBottom: '16px'
          }}>
            <small style={{ opacity: '0.7' }}>Biggest Single Expense</small>
            <p style={{ marginTop: '8px', fontWeight: '700' }}>{reportData.biggestExpense}</p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '20px',
            marginBottom: '16px'
          }}>
            <small style={{ opacity: '0.7' }}>Budget Breaches</small>
            <h3 style={{ marginTop: '8px' }}>{reportData.budgetBreaches}</h3>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '20px',
            marginBottom: '16px'
          }}>
            <small style={{ opacity: '0.7' }}>Spending Anomalies</small>
            <h3 style={{ marginTop: '8px' }}>{reportData.anomalies}</h3>
          </div>
        </div>

        <button 
          className="btn" 
          style={{ 
            marginTop: '32px', 
            background: 'white', 
            color: '#0f172a', 
            width: '100%', 
            fontWeight: '700', 
            height: '50px' 
          }}
          onClick={exportToPDF}
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export default Report;
