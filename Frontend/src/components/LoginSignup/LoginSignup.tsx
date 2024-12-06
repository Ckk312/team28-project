import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';

const LoginSignup: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '', // Added confirmPassword
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState(''); // State for password mismatch
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate passwords on change
    if (name === 'password' || name === 'confirmPassword') {
      if (
        (name === 'password' && value !== formData.confirmPassword) ||
        (name === 'confirmPassword' && value !== formData.password)
      ) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && passwordError) {
      setMessage('Passwords must match to proceed.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const url = 'http://ckk312.xyz:5000';
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const body = isLogin
        ? {
            username: formData.username,
            password: formData.password,
          }
        : {
            firstname: formData.firstName,
            lastname: formData.lastName,
            email: formData.username,
            password: formData.password,
          };

      const response = await fetch(`${url}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        if (data['error'] === '') {
          setMessage(isLogin ? 'Login Successful!' : 'Registration Successful!');
          if (isLogin) navigate('/landing');
        } else {
          setMessage('Incorrect username or password');
        }
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h3 id="this">{isLogin ? 'Login' : 'Sign Up'}</h3>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your email"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          { isLogin && 
          <button
          className="forgot-password-btn"
          onClick={() => navigate('/forgot-password')} // Navigate to Forgot Password page
        >
          Forgot Password?
        </button>
        }  
          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {passwordError && <p className="error">{passwordError}</p>}
            </div>
          )}
          <button
            type="submit"
            className="btn"
            disabled={loading || (!isLogin && passwordError !== '')}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p>{message}</p>
        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            className="toggle-btn"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
              setPasswordError('');
              setFormData({
                firstName: '',
                lastName: '',
                username: '',
                password: '',
                confirmPassword: '',
              });
            }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
