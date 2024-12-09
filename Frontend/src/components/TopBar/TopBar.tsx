import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './TopBar.css';

function TopBar() {
  const { isLoggedIn, firstName, lastName, setIsLoggedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  const isGameView = location.pathname.includes('/teams/');
  const isUserView = location.pathname.includes('/user/');

  return (
    <>
      <div id="top-bar">
        <button id="home-btn" onClick={() => navigate('/')}>
          Esports at UCF
        </button>
        
        {isGameView && (
          <button
            id="go-back-btn"
            onClick={() => navigate('/teams')} // Navigate back to the previous page
          >
            Go Back
          </button>
        )}
        {isUserView && (
          <button
            id="go-back-btn"
            onClick={() => navigate('/teams')} // Navigate back to the previous page
          >
            Go Back
          </button>
        )}
        <h1 id="project-name">
          {isLoggedIn
            ? `Welcome ${firstName} ${lastName}`
            : 'Welcome!'}
        </h1>
        {isLoggedIn ? (
          <button id="auth-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        ) : (
          <button id="auth-btn" onClick={() => navigate('/login')}>
            Admin<br /> Sign In
          </button>
        )}
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default React.memo(TopBar);