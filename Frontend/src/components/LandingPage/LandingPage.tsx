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
        <h1 className="project-name">Team 28 UCF ESPORTS Project</h1>
        <button
          className="auth-btn"
          onClick={isLoggedIn ? handleSignOut : () => (window.location.href = '/auth')}
        >
          {isLoggedIn ? 'Sign Out' : 'Sign In'}
        </button>
      </div>
      <div className="main-content">
        <h2>This project aims to raise awareness about Esports at the University of Central Florida (UCF) while providing tools to support the streaming of Esports matches. 
    By fostering greater engagement and accessibility, it seeks to enhance the visibility and community participation in the growing field of competitive gaming.
        </h2>
        
        <button className="start-btn" onClick={() => isLoggedIn ? window.location.href = "www.ckk312.xyz/" : (window.location.href = '/auth')}>
          Start
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
