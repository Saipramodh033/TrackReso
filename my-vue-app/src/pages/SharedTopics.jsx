import React, { useState, useEffect } from 'react';
import api from '../components/api';
import Card from '../components/Card';
import '../styles/SharedTopics.css';

const SharedTopics = () => {
  const [sharedTopics, setSharedTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSharedTopics();
  }, []);

  const fetchSharedTopics = async () => {
    try {
      const response = await api.get('/shared-topics/');
      setSharedTopics(response.data);
      if (response.data.length > 0) {
        setSelectedTopic(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching shared topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const leaveSharedTopic = async (topicId) => {
    if (window.confirm('Are you sure you want to leave this shared topic? You will no longer have access to it.')) {
      try {
        await api.post(`/shared-topics/${topicId}/leave/`);
        const updatedTopics = sharedTopics.filter(topic => topic.id !== topicId);
        setSharedTopics(updatedTopics);
        
        if (selectedTopic && selectedTopic.id === topicId) {
          setSelectedTopic(updatedTopics.length > 0 ? updatedTopics[0] : null);
        }
        
        alert('Successfully left shared topic');
      } catch (error) {
        console.error('Error leaving shared topic:', error);
        alert('Error leaving shared topic');
      }
    }
  };

  if (loading) {
    return (
      <div className="crystal-page-container">
        <div className="crystal-loading">Loading shared topics...</div>
      </div>
    );
  }

  return (
    <div className="crystal-shared-container">
      {/* Sidebar for shared topics */}
      <div className="crystal-shared-sidebar">
        <div className="crystal-shared-sidebar-header">
          <h2 className="crystal-shared-sidebar-title">Shared Topics</h2>
          <span className="crystal-shared-count">
            {sharedTopics.length} topic{sharedTopics.length !== 1 ? 's' : ''} shared with you
          </span>
        </div>

        <div className="crystal-shared-topics-list">
          {sharedTopics.length === 0 ? (
            <div className="crystal-shared-empty">
              <div className="crystal-shared-empty-icon">📚</div>
              <h3 className="crystal-shared-empty-title">No shared topics</h3>
              <p className="crystal-shared-empty-message">
                No one has shared any topics with you yet. Ask your peers to share their learning materials!
              </p>
            </div>
          ) : (
            sharedTopics.map((topic) => (
              <div
                key={topic.id}
                className={`crystal-shared-topic-item ${
                  selectedTopic && selectedTopic.id === topic.id ? 'active' : ''
                }`}
                onClick={() => setSelectedTopic(topic)}
              >
                <div className="crystal-shared-topic-info">
                  <h3 className="crystal-shared-topic-name">{topic.name}</h3>
                  <span className="crystal-shared-topic-owner">
                    by {topic.owner.username}
                  </span>
                  <span className="crystal-shared-topic-cards">
                    {topic.cards.length} card{topic.cards.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  className="crystal-shared-leave-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    leaveSharedTopic(topic.id);
                  }}
                  title="Leave shared topic"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main content area for cards */}
      <div className="crystal-shared-main-content">
        {selectedTopic ? (
          <>
            <div className="crystal-shared-main-header">
              <div className="crystal-shared-main-header-content">
                <h1 className="crystal-shared-main-title">
                  {selectedTopic.name}
                </h1>
                <div className="crystal-shared-main-info">
                  <span className="crystal-shared-owner-badge">
                    Shared by {selectedTopic.owner.username}
                  </span>
                  <span className="crystal-shared-readonly-badge">
                    Read Only
                  </span>
                </div>
              </div>
              <div className="crystal-shared-main-actions">
                <button
                  className="crystal-shared-leave-topic-btn"
                  onClick={() => leaveSharedTopic(selectedTopic.id)}
                >
                  Leave Topic
                </button>
              </div>
            </div>

            <div className="crystal-shared-cards-content">
              {selectedTopic.cards.length === 0 ? (
                <div className="crystal-shared-cards-empty">
                  <div className="crystal-shared-cards-empty-icon">📄</div>
                  <h3 className="crystal-shared-cards-empty-title">No cards yet</h3>
                  <p className="crystal-shared-cards-empty-message">
                    This topic doesn't have any learning cards yet.
                  </p>
                </div>
              ) : (
                <div className="crystal-shared-main-cards-grid">
                  {selectedTopic.cards.map((card) => (
                    <div key={card.id} className="crystal-shared-main-card">
                      <Card
                        card={card}
                        deleteCard={() => {}} // No delete for shared cards
                        topicId={selectedTopic.id}
                        topics={[]} // No topics update for shared
                        setTopics={() => {}} // No topics update for shared
                        isReadOnly={true} // Mark as read-only
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : sharedTopics.length > 0 ? (
          <div className="crystal-shared-select-prompt">
            <div className="crystal-shared-select-icon">👈</div>
            <h2 className="crystal-shared-select-title">Select a topic</h2>
            <p className="crystal-shared-select-message">
              Choose a shared topic from the sidebar to view its learning cards.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SharedTopics;