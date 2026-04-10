import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Profiles from './pages/Profiles';
import AuthMethod from './pages/AuthMethod';
import FaceID from './pages/FaceID';
import Security from './pages/Security';
import Dashboard from './pages/Dashboard';
import Bills from './pages/Bills';
import Goals from './pages/Goals';
import Splits from './pages/Splits';
import Transactions from './pages/Transactions';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/auth-method" element={<AuthMethod />} />
          <Route path="/face-id" element={<FaceID />} />
          <Route path="/security" element={<Security />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/bills" element={<Layout><Bills /></Layout>} />
          <Route path="/goals" element={<Layout><Goals /></Layout>} />
          <Route path="/splits" element={<Layout><Splits /></Layout>} />
          <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
