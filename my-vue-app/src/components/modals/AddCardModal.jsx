import React from 'react';

const AddCardModal = ({ 
  show, 
  onClose, 
  newCard, 
  setNewCard, 
  onAddCard 
}) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCard();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal large" onClick={(e) => e.stopPropagation()}>
        <h3>Add New Card</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Card Name *</label>
            <input
              type="text"
              value={newCard.name}
              onChange={(e) => setNewCard({...newCard, name: e.target.value})}
              placeholder="Enter card name"
              className="modal-input"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Resource</label>
            <input
              type="text"
              value={newCard.resource}
              onChange={(e) => setNewCard({...newCard, resource: e.target.value})}
              placeholder="Enter resource (URL, book, etc.)"
              className="modal-input"
            />
          </div>
          <div className="form-group">
            <label>Note</label>
            <textarea
              value={newCard.note}
              onChange={(e) => setNewCard({...newCard, note: e.target.value})}
              placeholder="Enter your notes"
              className="modal-textarea"
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Progress (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={newCard.progress}
              onChange={(e) => setNewCard({...newCard, progress: e.target.value})}
              className="modal-input"
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="modal-btn primary">
              Add Card
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

export default AddCardModal;