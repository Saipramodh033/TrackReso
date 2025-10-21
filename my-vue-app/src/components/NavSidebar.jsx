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
      path: '/topics',
      icon: '📚',
      label: 'My Topics',
      description: 'Manage your learning topics'
    },
    {
      path: '/peers',
      icon: '👥',
      label: 'Peers',
      description: 'Manage peer connections'
    },
    {
      path: '/shared',
      icon: '🤝',
      label: 'Shared Topics',
      description: 'View topics shared with you'
    }
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="crystal-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar Overlay for Mobile */}
      <div 
        className={`crystal-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Navigation Sidebar */}
      <div className={`crystal-nav-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="crystal-nav-sidebar-header">
          <h2 className="crystal-nav-sidebar-title">TrackReso</h2>
          <div className="crystal-nav-user-info">
            <span className="crystal-nav-username">Hello, {getCurrentUser()}</span>
          </div>
        </div>

        <nav className="crystal-nav-menu">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`crystal-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false); // Close mobile sidebar after navigation
              }}
            >
              <div className="crystal-nav-item-content">
                <span className="crystal-nav-icon">{item.icon}</span>
                <div className="crystal-nav-text">
                  <span className="crystal-nav-label">{item.label}</span>
                  <span className="crystal-nav-description">{item.description}</span>
                </div>
              </div>
            </button>
          ))}
        </nav>

        <div className="crystal-nav-sidebar-footer">
          <button className="crystal-nav-logout-btn" onClick={handleLogout}>
            <span className="crystal-nav-icon">🚪</span>
            <span className="crystal-nav-label">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default NavSidebar;