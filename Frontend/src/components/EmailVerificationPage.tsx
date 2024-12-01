import React, { useState } from 'react';
import '../styles/Auth.css';

const EmailVerificationPage: React.FC = () => {
  const [code, setCode] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Verifying with code: ${code}`);
  };

  return (
    <div className="auth-container">
      <h2>Email Verification</h2>
      <form onSubmit={handleVerify} className="auth-form">
        <input
          type="text"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">Verify</button>
      </form>
      <a href="/register">Resend Verification Code</a>
    </div>
  );
};

export default EmailVerificationPage;