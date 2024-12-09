import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
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
        <div id="page-container">
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
            <div id="main-content">
                <Outlet />
            </div>
            <div id="footer">
                <div id="information">
                    <h1>Esports at UCF</h1>
                    <p>4000 Central Florida Blvd,</p>
                    <p>Orlando, Florida 32816</p>
                    <a href="mailto:esportsatucf@gmail.com">EsportsatUCF@gmail.com</a>
                </div>
                <div id="links">
                    <h3>Follow</h3>
                    <a href="https://eucf.link/twitter" target="_self">
                        <button>
                            X
                        </button>
                    </a>
                    <a href="https://eucf.link/instagram" target="_self">
                        <button>
                            IG
                        </button>
                    </a>
                    <a href="https://eucf.link/twitch" target="_self">
                        <button>
                            Twitch
                        </button>
                    </a>
                    <a href="https://eucf.link/youtube" target="_self">
                        <button>
                            Youtube
                        </button>
                    </a>
                    <a href="https://eucf.link/discord" target="_self">
                        <button>
                            Discord
                        </button>
                    </a>
                </div>
            </div>
        </div>
      
    </>
  );
}

export default React.memo(TopBar);