import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import Card from './Card';
import {jwtDecode }from 'jwt-decode';
import '../styles/SidebarLayout.css';

const TopicManager = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addingNewCard, setAddingNewCard] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0]);
    } else if (selectedTopic) {
      // Update selected topic when topics change
      const updatedSelected = topics.find(t => t.id === selectedTopic.id);
      if (updatedSelected) {
        setSelectedTopic(updatedSelected);
      } else if (topics.length > 0) {
        setSelectedTopic(topics[0]);
      } else {
        setSelectedTopic(null);
      }
    }
  }, [topics]);

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
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No auth token found');

        const decoded = jwtDecode(token);
        const currentUserId = decoded.user_id || decoded.id || decoded.sub;

        const payload = {
          name: newTopicName,
          user: currentUserId,
        };

        const response = await api.post('topics/', payload);
        const newTopic = { ...response.data, cards: [] };
        setTopics([...topics, newTopic]);
        setSelectedTopic(newTopic);
        setNewTopicName('');
      } catch (error) {
        console.error('Error adding topic:', error);
      }
    }
  };

  const deleteTopic = async (id) => {
    try {
      await api.delete(`topics/${id}/`);
      const updatedTopics = topics.filter((topic) => topic.id !== id);
      setTopics(updatedTopics);
      
      // If deleted topic was selected, select first available topic
      if (selectedTopic && selectedTopic.id === id) {
        setSelectedTopic(updatedTopics.length > 0 ? updatedTopics[0] : null);
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const toggleCollapse = (id) => {
    setTopics(
      topics.map((topic) =>
        topic.id === id ? { ...topic, collapsed: !topic.collapsed } : topic
      )
    );
  };

  const selectTopic = (topic) => {
    setSelectedTopic(topic);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const deleteCard = (cardId) => {
    if (!selectedTopic) return;
    
    const updatedTopics = topics.map((topic) =>
      topic.id === selectedTopic.id
        ? { ...topic, cards: topic.cards.filter((card) => card.id !== cardId) }
        : topic
    );
    setTopics(updatedTopics);
    
    // Update selected topic
    const updatedSelectedTopic = updatedTopics.find(t => t.id === selectedTopic.id);
    setSelectedTopic(updatedSelectedTopic);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="crystal-layout-container">
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

      {/* Sidebar */}
      <div className={`crystal-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="crystal-sidebar-header">
          <h2 className="crystal-sidebar-title">Topics</h2>
          
          {/* Add Topic Form */}
          <div className="crystal-add-topic-form">
            <input
              type="text"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="Enter topic name"
              className="crystal-sidebar-input"
              onKeyDown={(e) => e.key === 'Enter' && addTopic()}
            />
            <button
              onClick={addTopic}
              disabled={!newTopicName.trim()}
              className="crystal-add-topic-btn"
            >
              Add Topic
            </button>
          </div>
        </div>

        {/* Topics List */}
        <div className="crystal-topics-sidebar-list">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className={`crystal-topic-sidebar-item ${
                selectedTopic && selectedTopic.id === topic.id ? 'active' : ''
              }`}
              onClick={() => selectTopic(topic)}
            >
              <span className="crystal-topic-sidebar-name">{topic.name}</span>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="crystal-sidebar-footer">
          <button className="crystal-logout-btn" onClick={handleLogout}>
            <span className="crystal-logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="crystal-main-content">
        <div className="crystal-main-header">
          <div className="crystal-main-header-content">
            <div className="crystal-main-header-info">
              <h1 className="crystal-main-title">Your Learning Journey</h1>
              {selectedTopic && (
                <p className="crystal-topic-subtitle">
                  {selectedTopic.name} • {selectedTopic.cards?.length || 0} cards
                </p>
              )}
            </div>
            {selectedTopic && (
              <div className="crystal-main-header-actions">
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
                  className="crystal-delete-topic-main-btn"
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
            )}
          </div>
        </div>

        <div className="crystal-cards-content">
          {selectedTopic ? (
            <>
              <div className="crystal-main-cards-grid">
                {selectedTopic.cards?.map((card) => (
                  <div key={card.id} className="crystal-main-card">
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
                  <div className="crystal-main-card">
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
                {!addingNewCard && (
                  <div
                    className="crystal-main-add-card"
                    onClick={() => setAddingNewCard(true)}
                  >
                    <div className="crystal-add-card-icon">+</div>
                    <div>Add New Card</div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="crystal-empty-state">
              <div className="crystal-empty-icon">📚</div>
              <h3 className="crystal-empty-title">No Topic Selected</h3>
              <p className="crystal-empty-message">
                Select a topic from the sidebar to view its cards, or create a new topic to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicManager;
