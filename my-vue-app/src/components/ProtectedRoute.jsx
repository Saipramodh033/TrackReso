import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import api from './api';

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        if (isMounted) setIsAuthorized(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          const refreshToken = localStorage.getItem(REFRESH_TOKEN);
          if (!refreshToken) {
            if (isMounted) setIsAuthorized(false);
            return;
          }
          const response = await api.post('token/refresh/', { refresh: refreshToken });
          localStorage.setItem(ACCESS_TOKEN, response.data.access);
          if (isMounted) setIsAuthorized(true);
        } else {
          if (isMounted) setIsAuthorized(true);
        }
      } catch (error) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        if (isMounted) setIsAuthorized(false);
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
