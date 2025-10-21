import React from 'react';

const ShareModal = ({ 
  show, 
  onClose, 
  availablePeers, 
  onShareTopic, 
  user 
}) => {
  if (!show) return null;

  // Helper function to get the peer's name
  const getPeerName = (peer) => {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Share Topic</h3>
        <p>Select a peer to share this topic with:</p>
        <div className="peers-list">
          {availablePeers.length > 0 ? (
            availablePeers.map(peer => (
              <div key={peer.id} className="peer-option">
                <span>{getPeerName(peer)}</span>
                <button 
                  onClick={() => onShareTopic(peer)}
                  className="modal-btn primary small"
                >
                  Share
                </button>
              </div>
            ))
          ) : (
            <p className="no-peers">No peers available. Add some peers first!</p>
          )}
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="modal-btn secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;