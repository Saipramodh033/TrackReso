import React, { useState } from 'react';
import apiService from '../services/apiService';
import { useErrorHandler } from '../utils/errorHandling';

const TopicsView = ({ 
  topics, 
  setTopics, 
  selectedTopic, 
  setSelectedTopic, 
  onUnauthorized 
}) => {
  const [expandedCards, setExpandedCards] = useState(new Set());
  const handleError = useErrorHandler(onUnauthorized);
  
  // Modal states
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  
  // Form states
  const [newTopicName, setNewTopicName] = useState('');
  const [newCard, setNewCard] = useState({
    name: '',
    resource: '',
    note: '',
    progress: 0
  });
  const [shareTopicId, setShareTopicId] = useState(null);
  const [availablePeers, setAvailablePeers] = useState([]);

  const addTopic = async () => {
    if (!newTopicName.trim()) {
      alert('Topic name is required!');
      return;
    }

    try {
      console.log('Adding topic:', newTopicName.trim());
      
      const newTopic = await apiService.createTopic({ name: newTopicName.trim() });
      console.log('Topic added successfully:', newTopic);
      
      const topicWithCards = { ...newTopic, cards: [] };
      setTopics([...topics, topicWithCards]);
      setSelectedTopic(topicWithCards);
      setNewTopicName('');
      setShowAddTopicModal(false);
      alert('Topic added successfully!');
    } catch (error) {
      console.error('Error adding topic:', error);
      handleError(error, { customMessage: 'Failed to add topic. Please try again.' });
    }
  };

  const deleteTopic = async (topicId) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await apiService.deleteTopic(topicId);
        const updatedTopics = topics.filter(topic => topic.id !== topicId);
        setTopics(updatedTopics);
        if (selectedTopic && selectedTopic.id === topicId) {
          setSelectedTopic(updatedTopics.length > 0 ? updatedTopics[0] : null);
        }
      } catch (error) {
        console.error('Error deleting topic:', error);
        handleError(error, { customMessage: 'Failed to delete topic. Please try again.' });
      }
    }
  };

  const deleteCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      try {
        await apiService.deleteCard(cardId);
        const updatedTopics = topics.map(topic => 
          topic.id === selectedTopic.id 
            ? { ...topic, cards: topic.cards.filter(card => card.id !== cardId) }
            : topic
        );
        setTopics(updatedTopics);
        setSelectedTopic(updatedTopics.find(topic => topic.id === selectedTopic.id));
        alert('Card deleted successfully!');
      } catch (error) {
        console.error('Error deleting card:', error);
        handleError(error, { customMessage: 'Failed to delete card. Please try again.' });
      }
    }
  };

  const addCard = async () => {
    if (!newCard.name.trim()) {
      alert('Card name is required!');
      return;
    }

    try {
      const cardData = {
        ...newCard,
        topic: selectedTopic.id,
        progress: parseInt(newCard.progress) || 0
      };
      
      const newCardData = await apiService.createCard(cardData);
      
      const updatedTopics = topics.map(topic => 
        topic.id === selectedTopic.id 
          ? { ...topic, cards: [...(topic.cards || []), newCardData] }
          : topic
      );
      
      setTopics(updatedTopics);
      setSelectedTopic(updatedTopics.find(topic => topic.id === selectedTopic.id));
      setNewCard({ name: '', resource: '', note: '', progress: 0 });
      setShowAddCardModal(false);
      alert('Card added successfully!');
    } catch (error) {
      console.error('Error adding card:', error);
      handleError(error, { customMessage: 'Failed to add card. Please try again.' });
    }
  };

  const updateCard = async () => {
    if (!editingCard.name.trim()) {
      alert('Card name is required!');
      return;
    }

    try {
      const cardData = {
        ...editingCard,
        progress: parseInt(editingCard.progress) || 0
      };
      
      const updatedCardData = await apiService.updateCard(editingCard.id, cardData);
      
      const updatedTopics = topics.map(topic => 
        topic.id === selectedTopic.id 
          ? { 
              ...topic, 
              cards: topic.cards.map(card => 
                card.id === editingCard.id ? updatedCardData : card
              ) 
            }
          : topic
      );
      
      setTopics(updatedTopics);
      setSelectedTopic(updatedTopics.find(topic => topic.id === selectedTopic.id));
      setEditingCard(null);
      alert('Card updated successfully!');
    } catch (error) {
      console.error('Error updating card:', error);
      handleError(error, { customMessage: 'Failed to update card. Please try again.' });
    }
  };

  const initiateTopicShare = async (topicId) => {
    try {
      // Fetch available peers for sharing (use cached data)
      const peersData = await apiService.getPeers();
      setAvailablePeers(peersData);
      setShareTopicId(topicId);
      setShowShareModal(true);
    } catch (error) {
      console.error('Error fetching peers:', error);
      handleError(error, { customMessage: 'Failed to load peers. Please try again.' });
    }
  };

  const shareTopic = async (peer, user) => {
    try {
      // Get the peer user ID (the other user in the relationship)
      const peerUserId = peer.requester?.id === user?.id 
        ? peer.addressee?.id 
        : peer.requester?.id;
        
      await apiService.shareTopic(shareTopicId, {
        peer_id: peerUserId
      });
      
      setShowShareModal(false);
      setShareTopicId(null);
      alert('Topic shared successfully!');
    } catch (error) {
      console.error('Error sharing topic:', error);
      handleError(error, { customMessage: 'Failed to share topic. Please try again.' });
    }
  };

  const toggleCardExpansion = (cardId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  // Helper function to get the peer's name
  const getPeerName = (peer, user) => {
    if (!peer || !user) return 'Unknown User';
    
    if (peer.requester?.id === user.id) {
      return peer.addressee?.username || 'Unknown User';
    }
    else if (peer.addressee?.id === user.id) {
      return peer.requester?.username || 'Unknown User';
    }
    else {
      return peer.requester?.username === user.username 
        ? peer.addressee?.username || 'Unknown User'
        : peer.requester?.username || 'Unknown User';
    }
  };

  return (
    <div className="topics-view">
      <div className="topics-sidebar">
        <div className="topics-sidebar-header">
          <h3>Your Topics</h3>
          <button
            className="add-topic-btn"
            onClick={() => setShowAddTopicModal(true)}
          >
            <span>➕</span> Add Topic
          </button>
        </div>
        <div className="topics-list">
          {topics.map(topic => (
            <div
              key={topic.id}
              className={`topic-item ${selectedTopic?.id === topic.id ? 'active' : ''}`}
              onClick={() => setSelectedTopic(topic)}
            >
              <h4 className="topic-name">{topic.name}</h4>
              <span className="topic-count">{topic.cards?.length || 0} cards</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="topic-content">
        {selectedTopic ? (
          <>
            <div className="topic-header">
              <h2>{selectedTopic.name}</h2>
              <div className="topic-actions">
                <button 
                  className="share-btn"
                  onClick={() => initiateTopicShare(selectedTopic.id)}
                >
                  👥 Share
                </button>
                <button
                  className="add-card-btn"
                  onClick={() => setShowAddCardModal(true)}
                >
                  ➕ Add Card
                </button>
                <button
                  className="delete-topic-btn"
                  onClick={() => deleteTopic(selectedTopic.id)}
                >
                  🗑️ Delete Topic
                </button>
              </div>
            </div>
            <div className="cards-grid">
              {selectedTopic.cards && selectedTopic.cards.length > 0 ? (
                selectedTopic.cards.map(card => {
                  const isExpanded = expandedCards.has(card.id);
                  const hasContent = card.resource || card.note;
                  
                  return (
                    <div key={card.id} className="card-item">
                      <div className="card-header">
                        <div className="card-title-section">
                          <h4>{card.name}</h4>
                          {card.starred && <span className="star">⭐</span>}
                        </div>
                        <div className="card-header-right">
                          <div className="card-progress">
                            <span className="progress-text">{card.progress}%</span>
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{ width: `${card.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="card-actions">
                            {hasContent && (
                              <button 
                                className="expand-btn"
                                onClick={() => toggleCardExpansion(card.id)}
                                title={isExpanded ? "Collapse details" : "Expand details"}
                              >
                                {isExpanded ? '🔼' : '🔽'}
                              </button>
                            )}
                            <button 
                              onClick={() => setEditingCard(card)}
                              title="Edit card"
                              className="action-btn"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => deleteCard(card.id)}
                              title="Delete card"
                              className="action-btn"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && hasContent && (
                        <div className="card-content">
                          {card.resource && (
                            <div className="card-field">
                              <label>📎 Resource:</label>
                              <div className="card-resource">
                                {card.resource.startsWith('http') ? (
                                  <a href={card.resource} target="_blank" rel="noopener noreferrer" className="resource-link">
                                    🔗 {card.resource}
                                  </a>
                                ) : (
                                  <span className="resource-text">{card.resource}</span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {card.note && (
                            <div className="card-field">
                              <label>📝 Notes:</label>
                              <div className="card-note">{card.note}</div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {!hasContent && (
                        <p className="no-content">No additional content</p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">📄</span>
                  <h3>No cards yet</h3>
                  <p>Create your first card to start learning!</p>
                  <button
                    className="add-card-btn"
                    onClick={() => setShowAddCardModal(true)}
                  >
                    ➕ Add Your First Card
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">📚</span>
            <h3>No topic selected</h3>
            <p>Select a topic from the sidebar or create a new one</p>
          </div>
        )}
      </div>

      {/* Modals would be rendered here - these will be extracted to separate components */}
    </div>
  );
};

export default TopicsView;