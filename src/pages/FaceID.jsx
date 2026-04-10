import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../public/css/main.css';
import '../public/css/face-id.css';

const FaceID = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
      setIsSuccess(true);
      
      // Navigate to dashboard after success
      const successTimer = setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
      return () => clearTimeout(successTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="face-wrapper">
      <div className="face-container" id="faceContainer">
        <div className={`face-icon ${isSuccess ? 'success' : ''}`}>
          {isSuccess ? 'â' : 'ð¤'}
        </div>
        <h2 id="faceTitle">
          {isScanning ? 'Scanning...' : 'Authentication Successful'}
        </h2>
        <p id="faceSub">
          {isScanning ? 'Hold still for Face ID' : 'Your identity has been verified. Welcome back!'}
        </p>
        
        {isSuccess && (
          <button 
            className="verify-btn" 
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default FaceID;
