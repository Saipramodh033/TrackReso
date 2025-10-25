import React, { useState, useEffect } from 'react';
import api from '../components/api';
import Card from '../components/Card';
import '../styles/TopicsPage.css';

const TopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [addingNewCard, setAddingNewCard] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0]);
    }
  }, [topics, selectedTopic]);

  const fetchTopics = async () => {
    try {
      const response = await api.get('topics/');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const addTopic = async () => {
    if (newTopicName.trim()) {
      try {
        const response = await api.post('topics/', { name: newTopicName.trim() });
        const newTopic = { ...response.data, cards: [] };
        setTopics([...topics, newTopic]);
        setNewTopicName('');
        setSelectedTopic(newTopic);
      } catch (error) {
        console.error('Error adding topic:', error);
        if (error.response?.status === 401) {
          alert('Session expired. Please login again.');
        } else {
          alert('Failed to add topic. Please try again.');
        }
      }
    }
  };

  const deleteTopic = async (topicId) => {
    try {
      await api.delete(`topics/${topicId}/`);
      const updatedTopics = topics.filter(topic => topic.id !== topicId);
      setTopics(updatedTopics);
      if (selectedTopic && selectedTopic.id === topicId) {
        setSelectedTopic(updatedTopics.length > 0 ? updatedTopics[0] : null);
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
      alert('Failed to delete topic. Please try again.');
    }
  };

  const deleteCard = async (cardId) => {
    try {
      await api.delete(`cards/${cardId}/`);
      const updatedTopics = topics.map(topic => 
        topic.id === selectedTopic.id 
          ? { ...topic, cards: topic.cards.filter(card => card.id !== cardId) }
          : topic
      );
      setTopics(updatedTopics);
      setSelectedTopic(updatedTopics.find(topic => topic.id === selectedTopic.id));
    } catch (error) {
      console.error('Error deleting card:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
      } else {
        alert('Failed to delete card. Please try again.');
      }
    }
  };

  return (
    <div className="crystal-topics-container">
      {/* Topics Sidebar */}
      <div className="crystal-topics-sidebar">
        <div className="crystal-topics-sidebar-header">
          <h2 className="crystal-topics-sidebar-title">Topics</h2>
          
          {/* Add Topic Form */}
          <div className="crystal-add-topic-form">
            <input
              type="text"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="Enter topic name"
              className="crystal-topics-input"
              onKeyDown={(e) => e.key === 'Enter' && addTopic()}
            />
            <button
              onClick={addTopic}
              className="crystal-add-topic-btn"
              disabled={!newTopicName.trim()}
            >
              ➕ Add
            </button>
          </div>
        </div>

        <div className="crystal-topics-list">
          {topics.length === 0 ? (
            <div className="crystal-topics-empty">
              <div className="crystal-topics-empty-icon">📚</div>
              <h3 className="crystal-topics-empty-title">No topics yet</h3>
              <p className="crystal-topics-empty-message">
                Create your first learning topic to get started!
              </p>
            </div>
          ) : (
            topics.map((topic) => (
              <div
                key={topic.id}
                className={`crystal-topic-item ${
                  selectedTopic && selectedTopic.id === topic.id ? 'active' : ''
                }`}
                onClick={() => setSelectedTopic(topic)}
              >
                <h3 className="crystal-topic-name">{topic.name}</h3>
                <span className="crystal-topic-cards">
                  {topic.cards?.length || 0} card{(topic.cards?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="crystal-topics-main-content">
        {selectedTopic ? (
          <>
            <div className="crystal-topics-main-header">
              <div className="crystal-topics-main-header-content">
                <h1 className="crystal-topics-main-title">{selectedTopic.name}</h1>
                <p className="crystal-topics-subtitle">
                  {selectedTopic.cards?.length || 0} learning card{(selectedTopic.cards?.length || 0) !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="crystal-topics-main-actions">
                <button
                  className="crystal-manage-sharing-btn"
                  onClick={() => {
                    // TODO: Open sharing modal
                    alert('Topic sharing feature coming soon!');
                  }}
                  title="Manage Topic Sharing"
                >
                  👥 Share Topic
                </button>
                <button
                  className="crystal-delete-topic-btn"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this topic? This action cannot be undone.')) {
                      deleteTopic(selectedTopic.id);
                    }
                  }}
                  title="Delete Topic"
                >
                  🗑 Delete Topic
                </button>
              </div>
            </div>

            <div className="crystal-topics-cards-content">
              {selectedTopic.cards?.length === 0 && !addingNewCard ? (
                <div className="crystal-topics-cards-empty">
                  <div className="crystal-topics-cards-empty-icon">📄</div>
                  <h3 className="crystal-topics-cards-empty-title">No cards yet</h3>
                  <p className="crystal-topics-cards-empty-message">
                    Add your first learning card to this topic.
                  </p>
                  <button
                    className="crystal-add-first-card-btn"
                    onClick={() => setAddingNewCard(true)}
                  >
                    ➕ Add First Card
                  </button>
                </div>
              ) : (
                <div className="crystal-topics-main-cards-grid">
                  {selectedTopic.cards?.map((card) => (
                    <div key={card.id} className="crystal-topics-main-card">
                      <Card
                        card={card}
                        deleteCard={deleteCard}
                        topicId={selectedTopic.id}
                        topics={topics}
                        setTopics={setTopics}
                      />
                    </div>
                  ))}

                  {/* New card form */}
                  {addingNewCard && (
                    <div className="crystal-topics-main-card">
                      <Card
                        key="new-card"
                        card={{}}
                        deleteCard={deleteCard}
                        topicId={selectedTopic.id}
                        topics={topics}
                        setTopics={setTopics}
                        isNew={true}
                        onAdded={() => setAddingNewCard(false)}
                      />
                    </div>
                  )}

                  {/* Add Card Button */}
                  {!addingNewCard && selectedTopic.cards?.length > 0 && (
                    <div
                      className="crystal-topics-add-card"
                      onClick={() => setAddingNewCard(true)}
                    >
                      <div className="crystal-topics-add-card-content">
                        <span className="crystal-topics-add-card-icon">➕</span>
                        <span className="crystal-topics-add-card-text">Add New Card</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : topics.length > 0 ? (
          <div className="crystal-topics-select-prompt">
            <div className="crystal-topics-select-icon">👈</div>
            <h2 className="crystal-topics-select-title">Select a topic</h2>
            <p className="crystal-topics-select-message">
              Choose a topic from the sidebar to view and manage its learning cards.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TopicsPage;