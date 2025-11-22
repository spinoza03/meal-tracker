import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth(); // Get the loading state

  // 1. While Firebase is checking, show a loading message.
  if (loading) {
    return <h1>Loading...</h1>;
  }

  // 2. After Firebase is done, if there is no user, redirect to login.
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // 3. If a user is logged in, show the page.
  return children;
}

export default ProtectedRoute;