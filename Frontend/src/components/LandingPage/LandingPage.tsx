import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Track login state
  const navigate = useNavigate();

  const handleSignOut = () => {
    setIsLoggedIn(false);
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="landing-container">
      <div className="top-bar">
        <button className="home-btn" onClick={() => navigate('/')}>
          Home
        </button>
        <h1 className="project-name">Project Name</h1>
        <button className="auth-btn" onClick={isLoggedIn ? handleSignOut : () => navigate('/')}>
          {isLoggedIn ? 'Sign Out' : 'Sign In'}
        </button>
      </div>
      <div className="main-content">
        <h2>Welcome to Our Project</h2>
        <p>This is a brief description of the project, its goals, and purpose.</p>
        <button className="start-btn" onClick={() => alert('Starting the project!')}>
          Start
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
