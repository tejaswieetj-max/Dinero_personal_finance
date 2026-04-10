import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../public/css/main.css';
import '../public/css/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useApp();
  const navigate = useNavigate();

  const MOCK_USERS = [
    { email: "admin@dinero.com", password: "password123", id: "admin", name: "Admin" },
    { email: "tejas@gmail.com", password: "1234", id: "tejas", name: "Tejas" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (mockUser) {
      setUser(mockUser);
      navigate('/profiles');
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="welcome-wrapper">
      <div className="welcome-left">
        <h1>Welcome to <span>Dinero</span></h1>
        <p>
          Your personal banking assistant that helps you keep track of
          your financial responsibilities.
        </p>
        <p style={{ marginTop: "8px", fontSize: "13px", color: "var(--text-muted)" }}>
          <h4>Done by - <strong>Tejas</strong></h4>
          <h4><b>24BE5518</b></h4>
        </p>
        <ul className="features">
          <li>Bank card integration</li>
          <li>UPI integration</li>
          <li>Monthly insights</li>
        </ul>
      </div>
      <div className="welcome-card">
        <img src="assets/logo.png" className="bank-logo" alt="Dinero logo" />
        <h2>Welcome back</h2>
        <form onSubmit={handleSubmit} className="form-area">
          <input 
            id="email" 
            type="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            id="password" 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="primary-btn">Sign In</button>
        </form>
        <p className="error">{error}</p>
      </div>
    </div>
  );
};

export default Login;
