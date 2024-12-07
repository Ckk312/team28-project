import React from 'react';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

import './TopBar.css';

function TopBar() {
  const { isLoggedIn, firstName, lastName, setIsLoggedIn } = useUser();
  console.log('User Data: ', {isLoggedIn, firstName, lastName});
  const navigate = useNavigate();

    const handleSignOut = () => {
        if (isLoggedIn) {
            setIsLoggedIn(false);
        } else {
            window.location.href = '/login';
        }
    };

  const handleEditProfile = () => {
    navigate('/edit-profile');
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
          <div>
            <button id="prof-btn" onClick={handleEditProfile}>
              Edit Profile
            </button>
            <button id="auth-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
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
