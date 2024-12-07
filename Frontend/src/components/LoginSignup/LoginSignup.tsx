import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; // Import the context
import './LoginSignup.css';

const LoginSignup: React.FC = () => {
  const { setIsLoggedIn } = useUser(); // Destructure the function from context
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordStrengthError, setPasswordStrengthError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate passwords for strength
    if (name === 'password') {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/; // At least one uppercase, one number, and one special character
      if (!passwordRegex.test(value)) {
        setPasswordStrengthError(
          'Password must contain at least one uppercase letter, one number, and one special character'
        );
      } else {
        setPasswordStrengthError('');
      }
    }

    // Confirm passwords match
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

    // Validate first and last names dynamically
    if (name === 'firstName' || name === 'lastName') {
      const nameRegex = /^[A-Za-z]*$/; // Allow empty input while typing
      if (!nameRegex.test(value)) {
        setNameError('First and Last name must be characters only');
      } else {
        setNameError('');
      }
    }

    // Validate email dynamically
    if (name === 'username') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
      if (!emailRegex.test(value)) {
        setEmailError('Not a valid email');
      } else {
        setEmailError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!isLogin && (passwordError || nameError || emailError || passwordStrengthError)) {
      setMessage('Please fix the errors before proceeding.');
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
      if (response.ok && data.error === '') {
        if (isLogin) {
          setMessage('Login Successful!');
          setIsLoggedIn(true, data.firstName, data.lastName); // Pass names from response
          navigate('/');
        } else {
          setMessage('Registration Successful!');
          setIsLoggedIn(true, formData.firstName, formData.lastName); // Pass names from formData
          navigate('/');
        }
      } else {
        setMessage(data.error || 'An error occurred. Please try again.');
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
              {nameError && <p className="error-message">{nameError}</p>}
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
            {emailError && <p className="error-message">{emailError}</p>}
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
            {passwordStrengthError && (
              <p className="error-message">{passwordStrengthError}</p>
            )}
          </div>
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
              {passwordError && <p className="error-message">{passwordError}</p>}
            </div>
          )}
          <button
            type="submit"
            className="btn"
            disabled={
              loading ||
              (!isLogin &&
                (!!passwordError || !!nameError || !!emailError || !!passwordStrengthError))
            }
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
              setNameError('');
              setEmailError('');
              setPasswordStrengthError('');
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
