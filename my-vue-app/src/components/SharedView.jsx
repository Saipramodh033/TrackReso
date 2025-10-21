import React, { useState } from 'react';
import apiService from '../services/apiService';
import { useErrorHandler } from '../utils/errorHandling';

const SharedView = ({ 
  sharedTopics, 
  onUnauthorized 
}) => {
  const [showSharedTopicModal, setShowSharedTopicModal] = useState(false);
  const [selectedSharedTopic, setSelectedSharedTopic] = useState(null);
  const [expandedSharedCards, setExpandedSharedCards] = useState(new Set());
  const handleError = useErrorHandler(onUnauthorized);

  const viewSharedTopic = async (topicId) => {
    try {
      const sharedTopicData = await apiService.getSharedTopic(topicId);
      setSelectedSharedTopic(sharedTopicData);
      setExpandedSharedCards(new Set()); // Reset expanded cards when opening new topic
      setShowSharedTopicModal(true);
    } catch (error) {
      console.error('Error viewing shared topic:', error);
      handleError(error, { customMessage: 'Failed to load shared topic. Please try again.' });
    }
  };

  const toggleSharedCardExpansion = (cardId) => {
    const newExpanded = new Set(expandedSharedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedSharedCards(newExpanded);
  };

  return (
    <div className="shared-view">
      <h3>Topics Shared with You</h3>
      <div className="shared-topics-grid">
        {sharedTopics.map(topic => (
          <div key={topic.id} className="shared-topic-card">
            <div className="shared-topic-header">
              <h4>{topic.name}</h4>
              <span className="shared-by">by {topic.owner?.username || 'Unknown'}</span>
            </div>
            <div className="shared-topic-content">
              <span>{topic.cards?.length || 0} cards</span>
              <button 
                className="view-shared-btn"
                onClick={() => viewSharedTopic(topic.id)}
              >
                View Cards
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shared Topic Viewing Modal */}
      {showSharedTopicModal && selectedSharedTopic && (
        <div className="modal-overlay" onClick={() => setShowSharedTopicModal(false)}>
          <div className="modal large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📚 {selectedSharedTopic.name}</h3>
              <p className="shared-by-text">
                <span className="shared-by-label">Shared by:</span>
                <strong>{selectedSharedTopic.owner?.username}</strong>
              </p>
            </div>
            
            <div className="shared-cards-container">
              <div className="cards-header">
                <h4>Cards</h4>
                <span className="cards-count">{selectedSharedTopic.cards?.length || 0} cards</span>
              </div>
              
              {selectedSharedTopic.cards && selectedSharedTopic.cards.length > 0 ? (
                <div className="shared-cards-grid">
                  {selectedSharedTopic.cards.map(card => {
                    const isExpanded = expandedSharedCards.has(card.id);
                    const hasContent = card.resource || card.note;
                    
                    return (
                      <div key={card.id} className="shared-card">
                        <div className="shared-card-header">
                          <div className="card-title-section">
                            <h5>{card.name}</h5>
                            {card.starred && <span className="star">⭐</span>}
                          </div>
                          <div className="card-header-right">
                            <div className="progress-section">
                              <span className="progress-text">{card.progress}%</span>
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ width: `${card.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            {hasContent && (
                              <button 
                                className="expand-btn"
                                onClick={() => toggleSharedCardExpansion(card.id)}
                                title={isExpanded ? "Collapse details" : "Expand details"}
                              >
                                {isExpanded ? '🔼' : '🔽'}
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {isExpanded && hasContent && (
                          <div className="shared-card-content">
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
                          <p className="no-content">No additional content available</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-cards-container">
                  <div className="no-cards-icon">📭</div>
                  <p className="no-cards">No cards in this topic yet.</p>
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowSharedTopicModal(false);
                  setSelectedSharedTopic(null);
                }}
                className="modal-btn secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedView;