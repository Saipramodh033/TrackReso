import React from 'react';

const DashboardHeader = ({ user, onLogout }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <h1 className="dashboard-title">TrackReso</h1>
        <span className="dashboard-subtitle">Learning Management</span>
      </div>
      <div className="dashboard-header-right">
        <div className="user-info">
          <span className="user-greeting">Hello, {user?.username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;