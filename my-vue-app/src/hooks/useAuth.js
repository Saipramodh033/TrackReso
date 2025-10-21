import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found');
        navigate('/login');
        return;
      }
      
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);
      setUser({ username: decoded.username, id: decoded.user_id });
      setIsLoading(false);
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.clear();
      navigate('/login');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleUnauthorized = () => {
    console.log('Unauthorized - redirecting to login');
    localStorage.clear();
    navigate('/login');
  };

  return {
    user,
    isLoading,
    logout,
    handleUnauthorized
  };
};