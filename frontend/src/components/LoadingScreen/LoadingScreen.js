import React, { useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadingComplete }) => {
  useEffect(() => {
    // Set a timer to match the total duration of your animations
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 5000); // Adjust this value to match your total animation duration

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-logo">
          <svg viewBox="0 0 100 100">
            <circle className="logo-circle" cx="50" cy="50" r="45" />
            <path className="logo-y" d="M30 30 L50 55 L70 30 M50 55 L50 70" />
          </svg>
        </div>
        <h2 className="loading-title">Yatharth</h2>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
        <p className="loading-subtitle">Preparing your experience...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;