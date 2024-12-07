import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './TopBar.css';

function TopBar() {
  const { isLoggedIn, firstName, lastName, setIsLoggedIn } = useUser();
  const navigate = useNavigate();

  const handleSignOut = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <>
      <div id="top-bar">
        <button id="home-btn" onClick={() => navigate('/')}>
          Home
        </button>
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
      <Outlet />
    </>
  );
}

export default React.memo(TopBar);

