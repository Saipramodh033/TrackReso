import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDashboardData } from '../hooks/useDashboardData';
import DashboardHeader from '../components/DashboardHeader';
import TabNavigation from '../components/TabNavigation';
import TopicsView from '../components/TopicsView';
import PeersView from '../components/PeersView';
import SharedView from '../components/SharedView';
import '../styles/Dashboard.css';

const Dashboard = ({ defaultTab = 'my-topics' }) => {
  const { user, logout, handleUnauthorized } = useAuth();
  const {
    topics,
    setTopics,
    peers,
    setPeers,
    pendingRequests,
    setPendingRequests,
    sharedTopics,
    selectedTopic,
    setSelectedTopic,
    isLoading
  } = useDashboardData(user);

  const [activeTab, setActiveTab] = useState(defaultTab);

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <span className="loading-icon">⏳</span>
          <h3>Loading Dashboard...</h3>
          <p>Please wait while we load your data.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'my-topics', label: 'My Topics', icon: '📚', count: topics.length },
    { id: 'peers', label: 'Peers', icon: '👥', count: peers.length, badge: pendingRequests.length },
    { id: 'shared', label: 'Shared', icon: '🤝', count: sharedTopics.length }
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'my-topics':
        return (
          <TopicsView
            topics={topics}
            setTopics={setTopics}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            onUnauthorized={handleUnauthorized}
            user={user}
          />
        );
      case 'peers':
        return (
          <PeersView
            peers={peers}
            setPeers={setPeers}
            pendingRequests={pendingRequests}
            setPendingRequests={setPendingRequests}
            user={user}
            onUnauthorized={handleUnauthorized}
          />
        );
      case 'shared':
        return (
          <SharedView
            sharedTopics={sharedTopics}
            onUnauthorized={handleUnauthorized}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <DashboardHeader user={user} onLogout={logout} />
      
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      <main className="dashboard-content">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default Dashboard;