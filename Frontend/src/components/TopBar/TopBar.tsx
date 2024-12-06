import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import './TopBar.css';

export default function TopBar() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login state

    const handleSignOut = () => {
        if (isLoggedIn) {
            setIsLoggedIn(false);
        } else {
            window.location.href = '/login';
        }
    };

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
                    {isLoggedIn ? ('Sign Out') : (<> Admin<br /> Sign In</>)}
                </button>
            </div>

            <Outlet />
        </>
        
    )
}