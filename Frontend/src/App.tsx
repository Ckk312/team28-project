import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './components/LoginSignup/LoginSignup';
import LandingPage from './components/LandingPage/LandingPage';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import TopBar from './components/TopBar/TopBar';
import ResetPassword from './components/ResetPassword/ResetPassword'; // Import ResetPassword page
import Teams from './components/Teams/Teams';
import TeamLayout from './components/TeamLayout/TeamLayout';
import Error from './components/Error/Error';
import { UserProvider } from './context/UserContext';
import UserPage from './components/UserPage/UserPage';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TopBar />} >
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginSignup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="teams" >
              <Route index element={<Teams />} />
              <Route path="*" element={<TeamLayout />} />
            </Route>
            <Route path="user/:name" element={<UserPage />} />
            <Route path="*" element={<Error />} />
            {/* Add ResetPassword route */}
          </Route>
        </Routes>
      </Router>
      </UserProvider>
  );
}

export default App;