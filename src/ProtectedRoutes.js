import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebase';

export function ProtectedRoute({ children }) {
  const isAuth = auth.currentUser !== null;

  return isAuth ? children : <Navigate to="/login" />;
}
