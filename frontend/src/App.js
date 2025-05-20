import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './login';
import AdminPage from './Admin/AdminPage-Prof';
import AdminPageStudent from './Admin/AdminPage-Student';
import './login.css';

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/login') {
      document.body.classList.add('login-bg');
    } else {
      document.body.classList.remove('login-bg');
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/student" element={<AdminPageStudent />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
