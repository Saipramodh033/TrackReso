import React from 'react';

const AddTopicModal = ({ 
  show, 
  onClose, 
  newTopicName, 
  setNewTopicName, 
  onAddTopic 
}) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTopic();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Add New Topic</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            placeholder="Enter topic name"
            className="modal-input"
            autoFocus
          />
          <div className="modal-actions">
            <button type="submit" className="modal-btn primary">
              Add Topic
            </button>
            <button type="button" onClick={onClose} className="modal-btn secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTopicModal;