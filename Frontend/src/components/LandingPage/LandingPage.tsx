import React, { useState } from 'react';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Track login state

  const handleSignOut = () => {
    setIsLoggedIn(false);
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <div className="landing-container">
      <div className="top-bar">
        {/* Home button refreshes the page */}
        <button className="home-btn" onClick={() => window.location.reload()}>
          Home
        </button>
        <h1 className="project-name">Project Name</h1>
        <button
          className="auth-btn"
          onClick={isLoggedIn ? handleSignOut : () => (window.location.href = '/')}
        >
          {isLoggedIn ? 'Sign Out' : 'Sign In'}
        </button>
      </div>
      <div className="main-content">
        <h2>Welcome to Our Project</h2>
        <p>This is a brief description of the project, its goals, and purpose.</p>
        <button className="start-btn" onClick={() => window.location.href = "www.ckk312.xyz/"}>
          Start
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
