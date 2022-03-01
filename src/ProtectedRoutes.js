import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebase';

export const ProtectedRoute = ({ children, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [children]);

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};
