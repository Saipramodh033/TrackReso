import React from 'react';

const TabNavigation = ({ activeTab, onTabChange, tabs }) => {
  return (
    <nav className="dashboard-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`dashboard-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
          <span className="tab-count">{tab.count}</span>
          {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
        </button>
      ))}
    </nav>
  );
};

export default TabNavigation;