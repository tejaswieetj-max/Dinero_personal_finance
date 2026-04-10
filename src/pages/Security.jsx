import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/main.css';
import '../css/security.css';

const Security = () => {
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const pressKey = (num) => {
    if (enteredPin.length < 4) {
      setEnteredPin(prev => prev + num);
      setError('');
    }
  };

  const deleteKey = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setError('');
  };

  const updateDots = () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <div
          key={i}
          id={`dot${i}`}
          className={`dot ${i < enteredPin.length ? 'filled' : ''}`}
        />
      );
    }
    return dots;
  };

  const verifyPin = () => {
    if (enteredPin.length !== 4) {
      setError('Enter 4 digits');
      return;
    }

    if (enteredPin === '1234') {
      navigate('/dashboard');
    } else {
      setError('Incorrect PIN');
      setEnteredPin('');
    }
  };

  return (
    <div className="security-wrapper">
      <div className="security-container">
        <h2 className="security-title">Enter PIN</h2>
        
        {/* PIN Indicators */}
        <div className="pin-indicators">
          {[0, 1, 2, 3].map((index) => (
            <div 
              key={index}
              className={`pin-indicator ${index < enteredPin.length ? 'filled' : ''}`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="keypad-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button 
              key={num}
              className="keypad-btn"
              onClick={() => pressKey(num)}
            >
              {num}
            </button>
          ))}
          <button 
            className="keypad-btn keypad-btn-delete"
            onClick={deleteKey}
          >
            ⌫
          </button>
          <button 
            className="keypad-btn"
            onClick={() => pressKey(0)}
          >
            0
          </button>
        </div>

        {/* Verify Button */}
        <button 
          className="verify-btn"
          onClick={verifyPin}
          disabled={enteredPin.length !== 4}
        >
          Verify
        </button>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Security;
