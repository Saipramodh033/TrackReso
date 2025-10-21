import React from 'react';

const EditCardModal = ({ 
  editingCard, 
  setEditingCard, 
  onUpdateCard 
}) => {
  if (!editingCard) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateCard();
  };

  const handleClose = () => {
    setEditingCard(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal large" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Card</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Card Name *</label>
            <input
              type="text"
              value={editingCard.name}
              onChange={(e) => setEditingCard({...editingCard, name: e.target.value})}
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
              value={editingCard.resource || ''}
              onChange={(e) => setEditingCard({...editingCard, resource: e.target.value})}
              placeholder="Enter resource (URL, book, etc.)"
              className="modal-input"
            />
          </div>
          <div className="form-group">
            <label>Note</label>
            <textarea
              value={editingCard.note || ''}
              onChange={(e) => setEditingCard({...editingCard, note: e.target.value})}
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
              value={editingCard.progress || 0}
              onChange={(e) => setEditingCard({...editingCard, progress: e.target.value})}
              className="modal-input"
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="modal-btn primary">
              Update Card
            </button>
            <button type="button" onClick={handleClose} className="modal-btn secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCardModal;