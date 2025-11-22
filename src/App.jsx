import { Routes, Route } from 'react-router-dom';
import GuestManager from './components/GuestManager';
import GuestQRCodePage from './pages/GuestQRCodePage';
import ScannerPage from './pages/ScannerPage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  return (
    <>
      {/* We can add a simple nav bar or header later */}
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
    </>
  );
}

export default App;