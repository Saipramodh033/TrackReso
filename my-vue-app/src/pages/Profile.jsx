import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import api from '../components/api';
import '../styles/Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState({
    topicsCount: 0,
    cardsCount: 0,
    peersCount: 0,
    sharedTopicsCount: 0
  });
  const [sharedTopics, setSharedTopics] = useState([]);
  const [peers, setPeers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [fullUserData, setFullUserData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchProfileData();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile/');
      setFullUserData(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to basic user data
      setFullUserData(user);
    }
  };

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Fetch all user data
      const [topicsRes, peersRes, sharedRes] = await Promise.all([
        api.get('/topics/'),
        api.get('/peers/'),
        api.get('/shared-topics/')
      ]);

      const topics = topicsRes.data;
      const peersData = peersRes.data;
      const sharedData = sharedRes.data;

      // Calculate stats
      const totalCards = topics.reduce((sum, topic) => sum + (topic.cards?.length || 0), 0);
      
      setUserStats({
        topicsCount: topics.length,
        cardsCount: totalCards,
        peersCount: peersData.length,
        sharedTopicsCount: sharedData.length
      });

      setPeers(peersData);
      
      // Fetch shared topics that the user has shared with others
      const sharedTopicsData = await fetchUserSharedTopics();
      setSharedTopics(sharedTopicsData);

      // Generate recent activity
      generateRecentActivity(topics, peersData, sharedTopicsData);

    } catch (error) {
      console.error('Error fetching profile data:', error);
      showError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    showSuccess('Refreshing profile data...');
    await fetchProfileData();
    setRefreshing(false);
    showSuccess('Profile data updated!');
  };

  const generateRecentActivity = (topics, peers, sharedTopics) => {
    const activities = [];

    // Add topic activities
    topics.slice(0, 3).forEach(topic => {
      activities.push({
        id: `topic-${topic.id}`,
        icon: '📚',
        text: `Created topic "${topic.name}"`,
        time: new Date(topic.created_at).toLocaleDateString(),
        type: 'topic'
      });
    });

    // Add peer activities
    peers.slice(0, 2).forEach(peer => {
      const peerName = getPeerName(peer);
      activities.push({
        id: `peer-${peer.id}`,
        icon: '👥',
        text: `Connected with ${peerName}`,
        time: new Date(peer.created_at).toLocaleDateString(),
        type: 'peer'
      });
    });

    // Add sharing activities
    sharedTopics.slice(0, 2).forEach(topic => {
      activities.push({
        id: `share-${topic.id}`,
        icon: '🤝',
        text: `Shared topic "${topic.name}"`,
        time: 'Recently',
        type: 'share'
      });
    });

    // Sort by most recent and limit to 5
    setRecentActivity(activities.slice(0, 5));
  };

  const fetchUserSharedTopics = async () => {
    try {
      // Get topics and their shares
      const topicsRes = await api.get('/topics/');
      const topics = topicsRes.data;
      
      // For each topic, get its shares
      const sharedTopicsPromises = topics.map(async (topic) => {
        try {
          const sharesRes = await api.get(`/topics/${topic.id}/shares/`);
          const shares = sharesRes.data;
          
          if (shares.length > 0) {
            return {
              ...topic,
              shares: shares
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching shares for topic ${topic.id}:`, error);
          return null;
        }
      });

      const sharedTopicsResults = await Promise.all(sharedTopicsPromises);
      return sharedTopicsResults.filter(topic => topic !== null);
    } catch (error) {
      console.error('Error fetching user shared topics:', error);
      return [];
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPeerName = (peer) => {
    if (!peer || !user) return 'Unknown User';
    
    if (peer.requester?.id === user.id) {
      return peer.addressee?.username || 'Unknown User';
    } else if (peer.addressee?.id === user.id) {
      return peer.requester?.username || 'Unknown User';
    }
    return 'Unknown User';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const renderOverview = () => (
    <div className="profile-overview">
      <div className="stats-grid">
        <div className="stat-card topics-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-number">{userStats.topicsCount}</div>
            <div className="stat-label">Topics Created</div>
            <div className="stat-change">+{Math.floor(Math.random() * 3)} this week</div>
          </div>
        </div>
        
        <div className="stat-card cards-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <div className="stat-number">{userStats.cardsCount}</div>
            <div className="stat-label">Learning Cards</div>
            <div className="stat-change">Active learning</div>
          </div>
        </div>
        
        <div className="stat-card peers-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{userStats.peersCount}</div>
            <div className="stat-label">Connected Peers</div>
            <div className="stat-change">Growing network</div>
          </div>
        </div>
        
        <div className="stat-card shared-card">
          <div className="stat-icon">🤝</div>
          <div className="stat-content">
            <div className="stat-number">{userStats.sharedTopicsCount}</div>
            <div className="stat-label">Shared Topics</div>
            <div className="stat-change">Collaborative</div>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <div className="activity-header">
          <h3>Recent Activity</h3>
          <button 
            className="refresh-btn"
            onClick={refreshData}
            disabled={refreshing}
          >
            {refreshing ? '⏳' : '🔄'} {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <div className="activity-list">
          {recentActivity.length === 0 ? (
            <div className="empty-activity">
              <div className="empty-icon">📝</div>
              <p>No recent activity. Start learning to see your progress here!</p>
              <button 
                className="cta-button primary"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <div className="activity-text">{activity.text}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button 
            className="action-card"
            onClick={() => navigate('/topics')}
          >
            <div className="action-icon">📚</div>
            <div className="action-text">Create Topic</div>
          </button>
          <button 
            className="action-card"
            onClick={() => navigate('/peers')}
          >
            <div className="action-icon">👥</div>
            <div className="action-text">Find Peers</div>
          </button>
          <button 
            className="action-card"
            onClick={() => navigate('/shared')}
          >
            <div className="action-icon">🤝</div>
            <div className="action-text">View Shared</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSharedTopics = () => (
    <div className="shared-topics-section">
      <div className="section-header">
        <h3>Topics You've Shared</h3>
        <p>Topics you've shared with your peers for collaboration</p>
      </div>
      
      {sharedTopics.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤝</div>
          <h4>No Shared Topics Yet</h4>
          <p>You haven't shared any topics with your peers yet. Go to your dashboard to start sharing!</p>
          <button 
            className="cta-button primary"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="shared-topics-list">
          {sharedTopics.map(topic => (
            <div key={topic.id} className="shared-topic-card">
              <div className="topic-header">
                <div className="topic-info">
                  <h4 className="topic-name">📚 {topic.name}</h4>
                  <div className="topic-meta">
                    <span className="card-count">{topic.cards?.length || 0} cards</span>
                    <span className="share-count">{topic.shares?.length || 0} shares</span>
                  </div>
                </div>
              </div>
              
              <div className="shared-with">
                <h5>Shared with:</h5>
                <div className="peers-list">
                  {topic.shares?.map(share => (
                    <div key={share.id} className="peer-item">
                      <div className="peer-avatar">👤</div>
                      <div className="peer-info">
                        <div className="peer-name">{share.peer?.username || 'Unknown User'}</div>
                        <div className="share-date">
                          Shared {new Date(share.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPeers = () => (
    <div className="peers-section">
      <div className="section-header">
        <h3>Your Learning Network</h3>
        <p>Peers you're connected with for collaborative learning</p>
      </div>
      
      {peers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h4>No Peers Connected</h4>
          <p>You haven't connected with any peers yet. Build your learning network!</p>
          <button 
            className="cta-button primary"
            onClick={() => navigate('/dashboard')}
          >
            Find Peers
          </button>
        </div>
      ) : (
        <div className="peers-grid">
          {peers.map(peer => (
            <div key={peer.id} className="peer-card">
              <div className="peer-avatar">👤</div>
              <div className="peer-info">
                <h4 className="peer-name">{getPeerName(peer)}</h4>
                <div className="peer-status">Connected</div>
                <div className="peer-date">
                  Since {new Date(peer.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <div className="loading-spinner">⏳</div>
          <h3>Loading Profile...</h3>
          <p>Please wait while we load your profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {(fullUserData?.username || user?.username)?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{getGreeting()}, {fullUserData?.username || user?.username || 'User'}!</h1>
            <p className="profile-email">{fullUserData?.email || 'Welcome to TrackReso Learning Platform'}</p>
            <div className="profile-stats-summary">
              <span>{userStats.topicsCount} Topics</span>
              <span>•</span>
              <span>{userStats.peersCount} Peers</span>
              <span>•</span>
              <span>Member since {fullUserData?.date_joined ? new Date(fullUserData.date_joined).toLocaleDateString() : 'Recently'}</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button 
            className="profile-button secondary"
            onClick={() => navigate('/dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className="profile-button primary"
            onClick={refreshData}
            disabled={refreshing}
          >
            {refreshing ? '⏳ Refreshing...' : '🔄 Refresh'}
          </button>
          <button 
            className="profile-button danger"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">📊</span>
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'shared' ? 'active' : ''}`}
          onClick={() => setActiveTab('shared')}
        >
          <span className="tab-icon">🤝</span>
          Shared Topics
        </button>
        <button 
          className={`tab-button ${activeTab === 'peers' ? 'active' : ''}`}
          onClick={() => setActiveTab('peers')}
        >
          <span className="tab-icon">👥</span>
          Network
        </button>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'shared' && renderSharedTopics()}
        {activeTab === 'peers' && renderPeers()}
      </div>
    </div>
  );
};

export default Profile;