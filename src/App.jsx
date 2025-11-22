import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // IMPORT THIS
import GuestManager from './components/GuestManager';
import GuestQRCodePage from './pages/GuestQRCodePage';
import ScannerPage from './pages/ScannerPage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';
import './App.css';

function RootRedirect() {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  return currentUser ? <Navigate to="/admin" /> : <Navigate to="/login" />;
}

function App() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const noSidebarRoutes = ['/login', '/register', '/guest/'];
  const showSidebar = !noSidebarRoutes.some(path => location.pathname.startsWith(path));

  return (
    <div className="app-layout">
      {/* Add the Toaster here. This manages all your popups. */}
      <Toaster position="top-center" reverseOrder={false} />

      {showSidebar && (
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      )}

      {showSidebar && (
        <Sidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      )}
      
      {showSidebar && isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      
      <main className={showSidebar ? 'main-content-with-sidebar' : 'main-content-full'}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/guest/:id" element={<GuestQRCodePage />} />

          <Route path="/admin" element={<ProtectedRoute><GuestManager /></ProtectedRoute>} />
          <Route path="/scanner" element={<ProtectedRoute><ScannerPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          <Route path="/" element={<RootRedirect />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;