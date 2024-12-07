import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import './TopBar.css';

<<<<<<< Updated upstream
export default function TopBar() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login state
=======
function TopBar() {
  const { isLoggedIn, firstName, lastName, setIsLoggedIn } = useUser();
  console.log('User Data: ', {isLoggedIn, firstName, lastName});
  const navigate = useNavigate();
>>>>>>> Stashed changes

    const handleSignOut = () => {
        if (isLoggedIn) {
            setIsLoggedIn(false);
        } else {
            window.location.href = '/login';
        }
    };

<<<<<<< Updated upstream
    return (
        <>
            <div id="top-bar">
                {/* Home button refreshes the page */}
                <button id="home-btn" onClick={() => window.location.href = '/'}>
                    Home
                </button>
                <h1 id="project-name">Team 28 UCF ESPORTS Project</h1>
                <button
                    id="auth-btn"
                    onClick={handleSignOut}
                >
                    {isLoggedIn ? 'Sign Out' : 'Sign In'}
                </button>
            </div>
=======
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
>>>>>>> Stashed changes

            <Outlet />
        </>
        
    )
}