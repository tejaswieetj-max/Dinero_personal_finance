import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import '../css/main.css';
import '../css/dashboard.css';
import '../css/features.css';

const Calendar = () => {
  const { user } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  // Mock bills data
  const MOCK_BILLS = [
    { id: "bill-1", name: "Electricity • City Power", due: "2026-04-14", amount: 12840, status: "unpaid" },
    { id: "bill-2", name: "Internet • FiberNet", due: "2026-04-16", amount: 7999, status: "unpaid" },
    { id: "bill-3", name: "Credit Card • NeoBank", due: "2026-04-20", amount: 20386, status: "unpaid" },
    { id: "bill-4", name: "Streaming • DineroFlix", due: "2026-04-02", amount: 1299, status: "paid" },
    { id: "bill-5", name: "Phone • MobileCo", due: "2026-04-29", amount: 8701, status: "unpaid" }
  ];

  useEffect(() => {
    generateCalendar();
  }, [currentDate]);

  const formatCurrency = (cents) => {
    return `₹${Math.abs(cents / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0];
      const isCurrentMonth = current.getMonth() === month;
      const isToday = current.toDateString() === new Date().toDateString();
      
      // Find bills due on this day
      const dayBills = MOCK_BILLS.filter(bill => bill.due === dateStr);
      
      days.push({
        date: new Date(current),
        dateStr,
        isCurrentMonth,
        isToday,
        bills: dayBills,
        dayNumber: current.getDate()
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    setCalendarDays(days);
  };

  const changeMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getMonthLabel = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="content">
      <div className="page-header">
        <div className="page-title">
          <h1>Bill Calendar</h1>
          <p>Visualize your upcoming financial commitments.</p>
        </div>

        <div className="pill">
          <img 
            id="userAvatar" 
            className="header-avatar" 
            alt="User avatar"
            src={user?.avatar || "assets/avatars/avatar1.png"}
          />
          <div>
            <div style={{ fontWeight: '700' }}>
              Hi, <span id="username">{user?.name || 'User'}</span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              Monthly View
            </div>
          </div>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 id="calendarMonthLabel">{getMonthLabel()}</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn secondary" onClick={() => changeMonth(-1)}>
              ←
            </button>
            <button className="btn secondary" onClick={() => changeMonth(1)}>
              →
            </button>
          </div>
        </div>

        <div className="calendar-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          backgroundColor: 'var(--border)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} style={{
              backgroundColor: 'var(--surface)',
              padding: '12px',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '14px',
              color: 'var(--text-muted)'
            }}>
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div 
              key={index}
              className="calendar-day"
              style={{
                backgroundColor: day.isCurrentMonth ? 'var(--surface)' : 'var(--background)',
                padding: '8px',
                minHeight: '80px',
                position: 'relative',
                opacity: day.isCurrentMonth ? 1 : 0.3,
                border: day.isToday ? '2px solid var(--primary)' : 'none'
              }}
            >
              <div style={{
                fontWeight: day.isToday ? '700' : '400',
                color: day.isToday ? 'var(--primary)' : 'var(--text)',
                marginBottom: '4px'
              }}>
                {day.dayNumber}
              </div>
              
              {day.bills.length > 0 && (
                <div style={{ fontSize: '10px' }}>
                  {day.bills.map((bill, billIndex) => (
                    <div 
                      key={bill.id}
                      style={{
                        backgroundColor: bill.status === 'paid' ? 'var(--success)' : 'var(--warning)',
                        color: 'white',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        marginBottom: '2px',
                        fontSize: '9px',
                        fontWeight: '600',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      title={`${bill.name} - ${formatCurrency(bill.amount)}`}
                    >
                      {bill.name.split(' • ')[0]}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
