import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../login.css';

const ProfessorLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/login', {
      username,
      password,
      role: 'professor'
    })
    .then((res) => {
      if (res.data.token) {
        // Save token if needed
        navigate('/professor-dashboard');
      } else {
        alert('Invalid credentials');
      }
    })
    .catch((err) => {
      console.error('Login error:', err);
      alert('Invalid credentials or server error');
    });
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">Professor Login</div>
          <div className="login-content">
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="login-button" type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorLoginPage;