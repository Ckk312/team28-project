import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './components/LoginSignup/LoginSignup';
import LandingPage from './components/LandingPage/LandingPage';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import TopBar from './components/TopBar/TopBar';
import ResetPassword from './components/ResetPassword/ResetPassword'; // Import ResetPassword page


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopBar />} >
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginSignup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          {/* Add ResetPassword route */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;