import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('http://ckk312.xyz:5000/api/forgotpass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const responseData = await response.json();
      if (response.ok) {
        setMessage(responseData.message);
        setError('');
      } else {
        setError(responseData.error || 'Something went wrong.');
        setMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
      setMessage('');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 id="this">Forgot Password</h2>
      <p>Enter your email to receive a password reset link.</p>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button className="btn" onClick={handleForgotPassword}>
        Send Reset Link
      </button>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
