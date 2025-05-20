import React, { useState } from 'react';
import './login.css'; 
import logo from './logo.png'; 
import { useNavigate } from 'react-router-dom';
import background from './background.png';

function Login() {
  const navigate = useNavigate();  // Use navigate hook to redirect after login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you would typically send the login details to the backend for authentication
    console.log('Email:', email);
    console.log('Password:', password);

    // If login is successful, navigate to the admin page (this can be based on the user role)
    // You should perform an actual authentication check with your backend API
    // For now, I'm assuming the login is always successful
    navigate('/admin'); // Redirect to /admin on successful login
  };

  return (
    <div className="login-container"
    style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className="login-box">
        <div className="login-header">
          <img src={logo} className="login-logo" alt="logo" />
          <span className="login-title">Welcome, Mga Itik!</span>
        </div>
        <form onSubmit={handleSubmit} className="login-content">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="button" className="forgot-button">
            Forgot Password?
          </button>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;

