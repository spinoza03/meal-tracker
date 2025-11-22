import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase.js';
import logo from '../assets/logo.png'; // Import the logo
import './Sidebar.css';

function Sidebar() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Only show sidebar if user is logged in
  if (!currentUser) return null;

  // Helper to set active class
  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    <nav className="sidebar glass-card">
      <div className="logo-container">
        <img src={logo} alt="Khouribga Festival Logo" className="app-logo" />
      </div>
      
      <div className="user-info">
        <p>{currentUser.email}</p>
      </div>

      <ul className="nav-links-list">
        <li>
          <Link to="/admin" className={isActive('/admin')}>Example Admin</Link>
        </li>
        <li>
          <Link to="/scanner" className={isActive('/scanner')}>Staff Scanner</Link>
        </li>
        <li>
          <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
        </li>
      </ul>

      <div className="logout-container">
         <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Sidebar;