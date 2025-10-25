import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/NavSidebar.css';

const NavSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const getCurrentUser = () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decoded = jwtDecode(token);
        return decoded.username || 'User';
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    return 'User';
  };

  const navItems = [
    {
      path: '/home',
      icon: '🏠',
      label: 'Home'
    },
    {
      path: '/dashboard',
      icon: '📊',
      label: 'Dashboard'
    },
    {
      path: '/topics',
      icon: '📚',
      label: 'My Topics'
    },
    {
      path: '/peers',
      icon: '👥',
      label: 'Peers'
    },
    {
      path: '/shared',
      icon: '🤝',
      label: 'Shared Topics'
    },
    {
      path: '/profile',
      icon: '👤',
      label: 'Profile'
    }
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="crystal-nav-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Navigation Sidebar */}
      <div className={`crystal-nav-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* User Section */}
        <div className="crystal-nav-user">
          <div className="crystal-nav-user-info">
            <div className="crystal-nav-avatar">
              {getCurrentUser().charAt(0).toUpperCase()}
            </div>
            <div className="crystal-nav-user-details">
              <h3>{getCurrentUser()}</h3>
              <p>Learning Enthusiast</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="crystal-nav-menu">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`crystal-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => {
                console.log('Navigating to:', item.path);
                navigate(item.path);
                setSidebarOpen(false); // Close mobile sidebar after navigation
              }}
            >
              <span className="crystal-nav-icon">{item.icon}</span>
              <span className="crystal-nav-text">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default NavSidebar;