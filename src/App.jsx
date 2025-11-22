import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import GuestManager from './components/GuestManager';
import GuestQRCodePage from './pages/GuestQRCodePage';
import ScannerPage from './pages/ScannerPage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar'; // We import the new Sidebar here
import './App.css';

function App() {
  const location = useLocation();

  // We define which pages should NOT have the sidebar (like login or public guest pages)
  const noSidebarRoutes = ['/login', '/register', '/guest/'];
  
  // Logic: If the current URL starts with any of the routes above, hide the sidebar.
  const showSidebar = !noSidebarRoutes.some(path => location.pathname.startsWith(path));

  return (
    <div className="app-layout">
       {/* Conditional Rendering: Only show sidebar if showSidebar is true */}
      {showSidebar && <Sidebar />}
      
      {/* Dynamic Class: If sidebar is showing, push content to the right. If not, center it. */}
      <main className={showSidebar ? 'main-content-with-sidebar' : 'main-content-full'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/guest/:id" element={<GuestQRCodePage />} />

          {/* Protected Routes */}
          <Route path="/admin" element={<ProtectedRoute><GuestManager /></ProtectedRoute>} />
          <Route path="/scanner" element={<ProtectedRoute><ScannerPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Default Route */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;