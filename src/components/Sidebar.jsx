import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase.js';
import logo from '../assets/logo.png';
import './Sidebar.css';

// New props: isOpen and onClose
function Sidebar({ isOpen, onClose }) {
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

  if (!currentUser) return null;

  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    /* Add the 'open' class if isOpen is true */
    <nav className={`sidebar glass-card ${isOpen ? 'open' : ''}`}>
      
      {/* Close Button (Visible only on mobile) */}
      <button className="close-sidebar-btn" onClick={onClose}>✕</button>

      <div className="logo-container">
        <img src={logo} alt="Khouribga Festival Logo" className="app-logo" />
      </div>
      
      <div className="user-info">
        <p>{currentUser.email}</p>
      </div>

      <ul className="nav-links-list">
        {/* We add onClick={onClose} to every link so the menu closes after clicking */}
        <li>
          <Link to="/admin" className={isActive('/admin')} onClick={onClose}>Example Admin</Link>
        </li>
        <li>
          <Link to="/scanner" className={isActive('/scanner')} onClick={onClose}>Staff Scanner</Link>
        </li>
        <li>
          <Link to="/dashboard" className={isActive('/dashboard')} onClick={onClose}>Dashboard</Link>
        </li>
      </ul>

      <div className="logout-container">
         <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Sidebar;