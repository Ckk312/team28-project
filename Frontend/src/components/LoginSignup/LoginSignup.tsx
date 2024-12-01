import React, { useState } from 'react';
import './LoginSignup.css';

const LoginSignup: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container">
      <button className="info-btn" onClick={() => alert('This is where your information page would be.')}>
        Info
      </button>
      <div className="form-container">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {isLogin ? (
          <form>
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="Enter your username" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" required />
            </div>
            <button type="submit" className="btn">Login</button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => alert('Forgot Password functionality is not implemented yet.')}
            >
              Forgot Password?
            </button>
          </form>
        ) : (
          <form>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" placeholder="Enter your first name" required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Enter your last name" required />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="Enter your username" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" required />
            </div>
            <button type="submit" className="btn">Sign Up</button>
          </form>
        )}
        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
