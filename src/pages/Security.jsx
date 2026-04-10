import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="pin-wrapper">
      <div className="pin-container">
        <h2>Enter PIN</h2>
        <div className="dots-container">
          {updateDots()}
        </div>
        <div className="keypad">
          <button onClick={() => pressKey(1)}>1</button>
          <button onClick={() => pressKey(2)}>2</button>
          <button onClick={() => pressKey(3)}>3</button>
          <button onClick={() => pressKey(4)}>4</button>
          <button onClick={() => pressKey(5)}>5</button>
          <button onClick={() => pressKey(6)}>6</button>
          <button onClick={() => pressKey(7)}>7</button>
          <button onClick={() => pressKey(8)}>8</button>
          <button onClick={() => pressKey(9)}>9</button>
          <div></div>
          <button onClick={() => pressKey(0)}>0</button>
          <button onClick={deleteKey}>â</button>
        </div>
        <button className="verify-btn" onClick={verifyPin}>Verify</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Security;
