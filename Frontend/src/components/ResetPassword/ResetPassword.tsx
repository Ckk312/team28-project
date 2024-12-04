import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = searchParams.get('token'); // Get token from URL

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://ckk312.xyz:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const responseData = await response.json();
      if (response.ok) {
        setMessage('Password reset successful. You can now log in.');
        setError('');
      } else {
        setError(responseData.error || 'Something went wrong.');
        setMessage('');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again later.');
      setMessage('');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <p>Enter your new password below.</p>
      <div className="form-group">
        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button className="btn" onClick={handleResetPassword}>
        Reset Password
      </button>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ResetPassword;
