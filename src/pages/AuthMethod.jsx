import React from 'react';
import { Link } from 'react-router-dom';
import '../css/main.css';
import '../css/auth-method.css';

const AuthMethod = () => {
  return (
    <div className="auth-bg">
      <div className="auth-container">
        <h2>Choose Authentication Method</h2>
        <div className="auth-methods">
          <Link to="/security" className="method-card">
            <div className="icon pin">🔐</div>
            <div>
              <h3>PIN</h3>
              <p>4-digit security code</p>
            </div>
          </Link>
          <Link to="/face-id" className="method-card">
            <div className="icon face">👤</div>
            <div>
              <h3>Face ID</h3>
              <p>Biometric authentication</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthMethod;
